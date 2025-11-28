import mongoose from 'mongoose';

const strategySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tvScriptId: String,
  name: String,
  pnlToday: { type: Number, default: 0 },
  totalPnl: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
  lastUpdate: Date
});

export default mongoose.model('StrategyTracking', strategySchema);
