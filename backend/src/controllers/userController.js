import User from '../models/userModel.js';

// @desc    Get current logged in user profile
// @route   GET /api/v1/users/me
// @access  Private (Protected)
export const getMyProfile = async (req, res) => {
  try {
    // Auth Middleware থেকে সরাসরি req.user পাওয়া যাবে
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update user profile details
// @route   PATCH /api/v1/users/me
// @access  Private (Protected)
export const updateMyProfile = async (req, res) => {
  try {
    const { name, photoURL } = req.body;

    // ইউজার যাতে ভুল করে গুরুত্বপূর্ণ তথ্য (যেমন: role বা subscription) পরিবর্তন করতে না পারে
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, photoURL },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully!',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};