import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import chartRoutes from './routes/charts.js';
import webhookRoutes from './routes/webhook.js';
import tradingviewRoutes from './routes/tradingview.js';
import notificationRoutes from './routes/notifications.js';
import admin from 'firebase-admin';
import cron from 'node-cron';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Firebase Admin (for push notifications)
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  });

  // MongoDB Connection
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
      .catch(err => console.log(err));

      // Routes
      app.use('/api/auth', authRoutes);
      app.use('/api/charts', chartRoutes);
      app.use('/api/webhook', webhookRoutes);
      app.use('/api/tradingview', tradingviewRoutes);
      app.use('/api/notifications', notificationRoutes);

      // Monthly Revenue Share Cron (1st of every month at 00:00)
      cron.schedule('0 0 1 * *', async () => {
        console.log('Running monthly revenue share...');
          // Your payout logic here (from previous code)
          });

          const PORT = process.env.PORT || 5000;
          app.listen(PORT, () => console.log(`Server running on port ${PORT}`));