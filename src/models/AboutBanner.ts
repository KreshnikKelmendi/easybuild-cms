import mongoose from 'mongoose';

export interface IAboutBanner {
  title: {
    en: string;
    de: string;
    al: string;
  };
  subtitle: {
    en: string;
    de: string;
    al: string;
  };
  image: string;
  video: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AboutBannerSchema = new mongoose.Schema<IAboutBanner>({
  title: {
    en: {
      type: String,
      required: true,
      trim: true,
    },
    de: {
      type: String,
      required: true,
      trim: true,
    },
    al: {
      type: String,
      required: true,
      trim: true,
    },
  },
  subtitle: {
    en: {
      type: String,
      required: true,
      trim: true,
    },
    de: {
      type: String,
      required: true,
      trim: true,
    },
    al: {
      type: String,
      required: true,
      trim: true,
    },
  },
  image: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Prevent multiple active about banners
AboutBannerSchema.pre('save', async function(next) {
  if (this.isActive) {
    await mongoose.model('AboutBanner').updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

export default mongoose.models.AboutBanner || mongoose.model<IAboutBanner>('AboutBanner', AboutBannerSchema);
