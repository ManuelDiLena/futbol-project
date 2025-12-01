import User from '../models/User.js';
import Player from '../models/Player.js';
import Field from '../models/Field.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  PUBLIC
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exist' });
    }
    const roleModel = role === 'player' ? 'Player' : 'Field';
    const user = await User.create({
      name,
      email,
      password,
      role,
      roleModel,
    });
    let profile;
    if (role === 'player') {
      profile = await Player.create({ user: user._id });
    } else if (role === 'adminField') {
      profile = await Field.create({ user: user._id });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }
    user.profile = profile._id;
    await user.save();
    const token = generateToken(res, user._id, user.role);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileId: profile._id,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  PUBLIC
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).populate('profile');
    if (user && (await user.comparePassword(password))) {
      const token = generateToken(res, user._id, user.role);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileId: user.profile?._id,
        profileComplete: user.profileComplete,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get logged-in user info
// @route   GET /api/auth/me
// @access  PRIVATE
const getMe = async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      await user.populate('profile');
      res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileId: user.profile?._id,
      },
      profileComplete: user.profileComplete || false,
    });
    }
  } catch (error) {
    console.error("Error in getMe:", error);
    res.status(500).json({ message: error.message });
  }
};

export { registerUser, loginUser, getMe };