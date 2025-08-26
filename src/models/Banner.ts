import mongoose from 'mongoose';

export interface IBanner {
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
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new mongoose.Schema<IBanner>({
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
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Prevent multiple active banners
BannerSchema.pre('save', async function(next) {
  if (this.isActive) {
    await mongoose.model('Banner').updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

export default mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema);
