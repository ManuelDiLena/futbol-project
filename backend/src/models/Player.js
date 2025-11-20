import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    age: {
      type: Number,
    },
    avatar: {
      type: String,
      default: '',
    },
    positions: {
      type: [String],
      enum: ['QK', 'CB', 'RB', 'LB', 'CMD', 'CM', 'CAM', 'RW', 'LW', 'ST'],
      default: [],
    },
    location: {
      type: String,
    },
    availability: {
      type: [String],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Full'],
      default: [],
    },
    ratings: {
      level: { type: Number, default: 0 },
      fairPlay: { type: Number, default: 0 },
      commitment: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

const Player = mongoose.model('Player', playerSchema);
export default Player;