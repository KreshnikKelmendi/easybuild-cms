import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    de: { type: String, required: true },
    al: { type: String, required: true }
  },
  description: {
    en: { type: String, required: true },
    de: { type: String, required: true },
    al: { type: String, required: true }
  },
  description2: {
    en: { type: String, required: true },
    de: { type: String, required: true },
    al: { type: String, required: true }
  },
  image: { type: String, required: true },
  hoverImage: { type: String },
  stepImages: [{
    image: { type: String, required: true },
    titleKey: { type: String, required: true }
  }],
  exteriorWall: { type: Boolean, default: false },
  interiorWall: { type: Boolean, default: false },
  exteriorWallImages: [{
    image: { type: String, required: true },
    title: { type: String, default: '' }
  }],
  interiorWallImages: [{
    image: { type: String, required: true },
    title: { type: String, default: '' }
  }],
  customWalls: [{
    name: { type: String, required: true },
    images: [{
      image: { type: String, required: true },
      title: { type: String, default: '' }
    }]
  }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

export default Service;
