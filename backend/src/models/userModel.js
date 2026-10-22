import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true // দ্রুত সার্চ করার জন্য ইনডেক্সিং
    },
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    photoURL: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    // SaaS Specific Billing Data
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free'
      },
      status: {
        type: String,
        enum: ['active', 'canceled', 'past_due', 'trialing', 'none'],
        default: 'none'
      },
      stripeCustomerId: { type: String, default: null },
      stripeSubscriptionId: { type: String, default: null },
      currentPeriodEnd: { type: Date, default: null }
    }
  },
  {
    timestamps: true // createdAt এবং updatedAt নিজে থেকেই অ্যাড হবে
  }
);

const User = mongoose.model('User', userSchema);

export default User;