import mongoose from 'mongoose';

const chartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: String,
  filePath: String,
  symbol: String,
  patterns: [{
    name: String,
    confidence: Number,
    type: String,
    suggestion: String,
    box: Array
  }],
  source: { type: String, default: 'upload' }, // upload, webhook, live-scan
  webhookMessage: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Chart', chartSchema);
