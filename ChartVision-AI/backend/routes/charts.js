import mongoose from 'mongoose';

const chartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
                                    createdAt: { type: Date, default: Date.now }
                                    });

                                    export default mongoose.model('Chart', chartSchema);import mongoose from 'mongoose';

                                    const chartSchema = new mongoose.Schema({
                                      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
                                                                        createdAt: { type: Date, default: Date.now }
                                                                        });

                                                                        export default mongoose.model('Chart', chartSchema);