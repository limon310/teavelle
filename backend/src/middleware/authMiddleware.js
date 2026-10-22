import admin from '../config/firebase.js';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
  let token;

  // Header থেকে Authorization টোকেন চেক করা (Format: Bearer <TOKEN>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'Not authorized! Please login to get access.'
    });
  }

  try {
    // ১. Firebase Admin SDK দিয়ে টোকেন ভেরিফাই
    const decodedToken = await admin.auth().verifyIdToken(token);

    // ২. মঙ্গোডিবি থেকে ইউজারের তথ্য খুঁজে বের করা
    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    // ৩. যদি প্রথমবার সাইন-ইন করে থাকে, তবে মঙ্গোডিবিতে নতুন ইউজার তৈরি হবে
    if (!user) {
      user = await User.create({
        firebaseUid: decodedToken.uid,
        name: decodedToken.name || 'SaaS User',
        email: decodedToken.email,
        photoURL: decodedToken.picture || ''
      });
    }

    // Request Object এ ইউজার অবজেক্ট যুক্ত করে দেওয়া
    req.user = user;
    next(); // পরের কন্ট্রোলারে পাঠাবে
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired authentication token!'
    });
  }
};