import mongoose from 'mongoose';

export interface ITeam {
  title: {
    en: string;
    de: string;
    al: string;
  };
  firstDescription: {
    en: string;
    de: string;
    al: string;
  };
  secondDescription: {
    en: string;
    de: string;
    al: string;
  };
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new mongoose.Schema<ITeam>({
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
  firstDescription: {
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
  secondDescription: {
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

// Prevent multiple active team sections
TeamSchema.pre('save', async function(next) {
  if (this.isActive) {
    await mongoose.model('Team').updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

export default mongoose.models.Team || mongoose.model<ITeam>('Team', TeamSchema);
