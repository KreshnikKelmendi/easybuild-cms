import mongoose from 'mongoose';

export interface IProject {
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
  mainImage: string;
  additionalImages: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new mongoose.Schema<IProject>({
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
  mainImage: {
    type: String,
    required: true,
  },
  additionalImages: [{
    type: String,
    required: false,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
