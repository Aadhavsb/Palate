import mongoose, { Document, Schema } from 'mongoose';
import { User as UserType } from '../types';

interface UserDocument extends Omit<UserType, '_id'>, Document {}

const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  avatar: {
    type: String,
    default: null
  },
  preferences: {
    favoriteCategories: [{
      type: String,
      trim: true
    }],
    allergens: [{
      type: String,
      trim: true
    }],
    spiceLevel: {
      type: Number,
      min: 0,
      max: 10,
      default: 5
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ createdAt: -1 });

// Virtual for user's recipe count
userSchema.virtual('recipeCount', {
  ref: 'Recipe',
  localField: '_id',
  foreignField: 'userId',
  count: true
});

export default mongoose.model<UserDocument>('User', userSchema);
