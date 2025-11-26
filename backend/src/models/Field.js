import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fieldName: {
      type: String,
    },
    location: {
      type: String,
    },
    schedules: {
      type: String,
    },
    fieldCount: {
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

const Field = mongoose.model('Field', fieldSchema);
export default Field;