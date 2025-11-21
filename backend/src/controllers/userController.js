import User from '../models/User.js';

// @desc    Get profile of logged-in user
// @route   POST /api/users/me
// @access  PRIVATE
const getUserProfile = async (req, res) => {
  if (req.user) {
    const user = await User.findById(req.user._id).populate('profile');
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export { getUserProfile };