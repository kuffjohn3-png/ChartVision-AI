import express from 'express';
import User from '../models/User.js';
import Chart from '../models/Chart.js';
import axios from 'axios';
import fs from 'fs';
import admin from 'firebase-admin';

const router = express.Router();

router.post('/tv/:userId', async (req, res) => {
  const { userId } = req.params;
  const { key, symbol, message = '' } = req.body;

  try {
    const user = await User.findOne({ _id: userId, webhookSecret: key });
    if (!user) return res.status(401).json({ msg: 'Invalid webhook' });

    if (!symbol) return res.status(400).json({ msg: 'Symbol required' });

    const snapshotUrl = `https://api.chart-img.com/v2/snapshot?symbol=${encodeURIComponent(symbol)}&theme=dark&key=${process.env.CHART_IMG_KEY}`;
    const imgResponse = await axios.get(snapshotUrl, { responseType: 'arraybuffer' });

    const fileName = `tv-${Date.now()}-${symbol.replace(/:/g, '-')}.png`;
    const filePath = path.join('uploads', fileName);
    fs.writeFileSync(filePath, imgResponse.data);

    const aiResponse = await axios.post(process.env.AI_SERVICE_URL + '/predict', {
      chart: { path: filePath, originalname: fileName }
    }, { headers: { 'Content-Type': 'multipart/form-data' } });

    const chart = new Chart({
      userId: user._id,
      fileName: `TradingView Alert · ${symbol}`,
      filePath: '/uploads/' + fileName,
      symbol,
      patterns: aiResponse.data.patterns || [],
      source: 'tradingview_webhook',
      webhookMessage: message
    });
    await chart.save();

    if (user.fcmToken) {
      const strongest = chart.patterns.reduce((a, b) => a.confidence > b.confidence ? a : b, {confidence: 0});
      await admin.messaging().send({
        token: user.fcmToken,
        notification: {
          title: `TV Alert → ${strongest.name} ${(strongest.confidence*100).toFixed(0)}%`,
          body: `${symbol} – ${message || 'Pattern detected'}`,
        },
        data: { chartId: chart._id.toString() }
      });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ msg: 'Processing failed' });
  }
});

export default router;
