import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    role: {
      type: String,
      enum: ['player', 'adminPitch', 'adminTeam'],
      required: true,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'roleModel',
    },
    roleModel: {
      type: String,
      required: true,
      enum: ['Player', 'Pitch'],
    }
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePass) {
  return await bcrypt.compare(candidatePass, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;