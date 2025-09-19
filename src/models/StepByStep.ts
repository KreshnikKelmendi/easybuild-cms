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
  images: {
    step1: string;
    step2: string;
    step3: string;
  };
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
    step1: {
      type: String,
      required: true,
    },
    step2: {
      type: String,
      required: true,
    },
    step3: {
      type: String,
      required: true,
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
