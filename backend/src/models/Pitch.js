import mongoose from 'mongoose';

const pitchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pitchName: {
      type: String,
    },
    location: {
      type: String,
    },
    schedules: {
      type: String,
    },
    pitchCount: {
      type: Number,
    },
    matchTypes: {
      type: [String],
      enum: ['F5', 'F7', 'F9', 'F11'],
      default: [],
    },
    ratings: {
      facilities: { type: Number, default: 0 },
      cleanliness: { type: Number, default: 0 },
    }
  },
  { timestamps: true }
);

const Pitch = mongoose.model('Pitch', pitchSchema);
export default Pitch;