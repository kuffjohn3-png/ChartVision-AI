import express from 'express';
import auth from '../middleware/auth.js';
import axios from 'axios';

const router = express.Router();

router.post('/publish-script', auth, async (req, res) => {
  const { script, name } = req.body;

  try {
    const tvToken = await refreshTradingViewToken(req.user.tvRefreshToken);

    const response = await axios.post('https://api.tradingview.com/v1/pine/publish', {
      name,
      script,
      is_public: false
    }, {
      headers: { Authorization: `Bearer ${tvToken.access_token}` }
    });

    res.json({ success: true, scriptId: response.data.script_id });
  } catch (err) {
    res.status(500).json({ msg: 'Publish failed' });
  }
});

export default router;
