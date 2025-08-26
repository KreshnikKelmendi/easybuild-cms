import mongoose from 'mongoose';

export interface ISocialMedia {
  platform: string;
  icon: string;
  url: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SocialMediaSchema = new mongoose.Schema<ISocialMedia>({
  platform: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  icon: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.models.SocialMedia || mongoose.model<ISocialMedia>('SocialMedia', SocialMediaSchema);
