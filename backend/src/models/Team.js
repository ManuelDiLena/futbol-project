import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    location: {
      type: String,
      required: true
    },
    emblem: {
      type: String,
      default: '🛡️'
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    pendingRequests: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    stats: {
      wins: { type: Number, default: 0 },
      draws: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
      goalsFor: { type: Number, default: 0 },
      goalsAgainst: { type: Number, default: 0 },
    },
    fairPlayScore: {
      type: Number,
      default: 5
    },
  },
  { timestamps: true }
);

const Team = mongoose.model('Team', teamSchema);
export default Team;