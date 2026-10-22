import express from 'express';
import { getMyProfile, updateMyProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// নিচের সবকটি রুট সুরক্ষিত রাখতে protect middleware যুক্ত করা হয়েছে
router.use(protect);

router.get('/me', getMyProfile);
router.patch('/me', updateMyProfile);

export default router;