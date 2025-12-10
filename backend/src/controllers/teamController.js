import Team from '../models/Team.js';
import User from '../models/User.js';
import Message from '../models/Message.js';

// @desc    Create new team
// @route   POST /api/teams
const createTeam = async (req, res) => {
  const { name, location, emblem } = req.body;
  const userId = req.user.id;
  try {
    const teamExists = await Team.findOne({ name });
    if (teamExists) {
      return res.status(400).json({ message: 'Team name already exists' });
    } 
    const team = await Team.create({
      name,
      location,
      emblem,
      admin: userId,
      members: [userId],
    });
    const user = await User.findById(userId);
    user.role = 'adminTeam';
    user.team = team._id;
    await user.save();
    res.status(201).json({ team, updatedUserRole: 'adminTeam' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get current user team
// @route   GET /api/teams/me
const getMyTeam = async (req, res) => {
  try {
    const team = await Team.findOne({ members: req.user._id })
      .populate('members', 'name email role')
      .populate('pendingRequests', 'name email');
    if (!team) {
      return res.status(404).json({ message: 'No team found for this user' });
    }
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Search teams (filter by location)
// @route   GET /api/teams
const getTeams = async (req, res) => {
  const { location } = res.query;
  const query = location ? { location: { $regex: location, $options: 'i' } } : {};
  try {
    const teams = await Team.find(query).select('name location emblem members stats');
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Request to join a team
// @route   POST /api/teams/:id/join
const joinRequest = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    if (team.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already a member of this team' });
    }
    if (team.pendingRequests.includes(req.user._id)) {
      return res.status(400).json({ message: 'Join request already sent' });
    }
    team.pendingRequests.push(req.user._id);
    await team.save();
    res.json({ message: 'Join request sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Manage request (Approve/Reject)
// @route   PUT /api/teams/:id/request
const handleRequest = async (req, res) => {
  const { userId, action } = req.body;
  try {
    const team = await Team.findById(req.params.id);
    if (team.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only team admin can manage requests' });
    }
    team.pendingRequests = team.pendingRequests.filter(id => id.toString() !== userId);
    if (action === 'approve') {
      team.members.push(userId);
      const newMember = await User.findById(userId);
      newMember.team = team._id;
      await newMember.save();
    }
    await team.save();
    const updatedTeam = await Team.findById(req.params.id)
      .populate('members', 'name').populate('pendingRequests', 'name');
    res.json(updatedTeam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get chat messages
// @route   GET /api/teams/:id/messages
const getTeamMessages = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied. Not a team member.' });
    }
    const messages = await Message.find({ team: req.params.id })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Save message
// @route   POST /api/teams/:id/messages
const saveMessage = async (req, res) => {
  const { content } = req.body;
  try {
    const newMessage = await Message.create({
      team: req.params.id,
      sender: req.user._id,
      content
    });
    const populatedMsg = await newMessage.populate('sender', 'name');
    const io = req.app.get('socketio');
    io.to(req.params.id).emit('receive_message', populatedMsg);
    res.status(201).json(populatedMsg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export { createTeam, getMyTeam, getTeams, joinRequest, handleRequest, getTeamMessages, saveMessage };


