import Player from '../models/Player.js';
import User from '../models/User.js';

// @desc    Get profile of logged-in player
// @route   GET /api/players/me
// @access  PRIVATE
const getPlayerProfile = async (req, res) => {
  try {
    const player = await Player.findById(req.user.profile);
    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }
    res.status(200).json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update player profile
// @route   PUT /api/players/me
// @access  PRIVATE
const updatePlayerProfile = async (req, res) => {
  try {
    const { age, availability, avatar, location, positions } = req.body;
    const player = await Player.findById(req.user.porfile);
    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }
    player.age = age || player.age;
    player.availability = availability || player.availability;
    player.avatar = avatar || player.avatar;
    player.location = location || player.location;
    player.positions = positions || player.positions;
    const updatedPlayer = await player.save();
    const user = await User.findById(req.user._id);
    user.profileComplete = true;
    await user.save();
    res.status(200).json(updatedPlayer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get player's public profile
// @route   GET /api/players/:id
// @access  PRIVATE
const getPublicPlayerProfile = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).populate('user', 'name');
    if (!player) {
      return res.status(404).json({ message: 'Player not found' })
    }
    res.status(200).json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getPlayerProfile, updatePlayerProfile, getPublicPlayerProfile };