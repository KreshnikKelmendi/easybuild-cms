import mongoose from 'mongoose';

export interface IStepByStep {
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
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StepByStepSchema = new mongoose.Schema<IStepByStep>({
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
  images: {
    type: [String],
    required: true,
    validate: {
      validator: function(arr: string[]) {
        return Array.isArray(arr) && arr.length >= 3 && arr.every((item) => typeof item === 'string' && item.trim().length > 0);
      },
      message: 'At least 3 images are required',
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Prevent multiple active step by step sections
StepByStepSchema.pre('save', async function(next) {
  if (this.isActive) {
    await mongoose.model('StepByStep').updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

export default mongoose.models.StepByStep || mongoose.model<IStepByStep>('StepByStep', StepByStepSchema);
