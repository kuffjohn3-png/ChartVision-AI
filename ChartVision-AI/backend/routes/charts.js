                                                import express from 'express';
import multer from 'multer';
import path from 'path';
import auth from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import Chart from '../models/Chart.js';
import axios from 'axios';
import admin from 'firebase-admin';

const router = express.Router();
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Images only'));
    cb(null, true);
  }
});

router.post('/upload', auth, uploadLimiter, upload.single('chart'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    const formData = new FormData();
    formData.append('chart', fs.createReadStream(req.file.path), req.file.originalname);

    const aiResponse = await axios.post(process.env.AI_SERVICE_URL + '/predict', formData, {
      headers: formData.getHeaders(),
      timeout: 20000
    });

    const chart = new Chart({
      userId: req.user.id,
      fileName: req.file.originalname,
      filePath: '/uploads/' + req.file.filename,
      symbol: aiResponse.data.symbol,
      patterns: aiResponse.data.patterns || []
    });

    await chart.save();

    if (chart.patterns.some(p => p.confidence >= 0.90) && req.user.fcmToken) {
      await admin.messaging().send({
        token: req.user.fcmToken,
        notification: {
          title: 'High Confidence Pattern!',
          body: `${chart.symbol} – ${chart.patterns[0].name} ${(chart.patterns[0].confidence * 100).toFixed(0)}%`
        }
      });
    }

    fs.unlinkSync(req.file.path);

    res.json(chart);
  } catch (err) {
    next(err);
  }
});

router.get('/list', auth, async (req, res, next) => {
  try {
    const charts = await Chart.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(charts);
  } catch (err) {
    next(err);
  }
});

export default router;                        export default mongoose.model('Chart', chartSchema);
