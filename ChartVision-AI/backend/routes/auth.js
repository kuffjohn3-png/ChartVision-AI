import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
      webhookSecret: { type: String, default: () => require('crypto').randomBytes(16).toString('hex') },
        fcmToken: String,
          stripeAccountId: String,
            tvRefreshToken: String,
              createdAt: { type: Date, default: Date.now }
              });

              export default mongoose.model('User', userSchema);