import mongoose from 'mongoose';

export interface IAboutUs {
  title: {
    en: string;
    de: string;
    al: string;
  };
  description: {
    en: string;
    de: string;
    al: string;
  };
  missionDescription: {
    en: string;
    de: string;
    al: string;
  };
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AboutUsSchema = new mongoose.Schema<IAboutUs>({
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
  description: {
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
  missionDescription: {
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
  images: [{
    type: String,
    required: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Prevent multiple active about us sections
AboutUsSchema.pre('save', async function(next) {
  if (this.isActive) {
    await mongoose.model('AboutUs').updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

export default mongoose.models.AboutUs || mongoose.model<IAboutUs>('AboutUs', AboutUsSchema);
