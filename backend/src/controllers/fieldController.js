import Field from '../models/Field.js';
import User from '../models/User.js';

// @desc    Get profile of logged-in field
// @route   GET /api/fields/me
// @access  PRIVATE
const getFieldProfile = async (req, res) => {
  try {
    const field = await Field.findById(req.user.profile);
    if (!field) {
      return res.status(404).json({ message: 'Field profile not found' });
    }
    res.status(200).json(field);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update field profile
// @route   PUT /api/fields/me
// @access  PRIVATE
const updateFieldProfile = async (req, res) => {
  try {
    const { fieldName, location, schedules, fieldCount, matchTypes } = req.body;
    const field = await Field.findById(req.user.profile);
    if (!field) {
      return res.status(404).json({ message: 'Field profile not found' });
    }
    field.fieldName = fieldName || field.fieldName;
    field.location = location || field.location;
    field.schedules = schedules || field.schedules;
    field.fieldCount = fieldCount || field.fieldCount;
    field.matchTypes = matchTypes || field.matchTypes;
    const updatedField = await field.save();
    const user = await User.findById(req.user._id);
    user.profileComplete = true;
    await user.save();
    res.status(200).json(updatedField);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get field's public profile
// @route   GET /api/fields/:id
// @access  PRIVATE
const getPublicFieldProfile = async (req, res) => {
  try {
    const field = await Field.findById(req.params.id).populate('user', 'name');
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }
    res.status(200).json(field);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getFieldProfile, updateFieldProfile, getPublicFieldProfile };