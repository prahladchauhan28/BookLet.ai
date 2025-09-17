import mongoose from 'mongoose';

const bookletSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  sourceUrl: {
    type: String
  },
  summary: [
    {
      type: String
    }
  ],
  slides: [
    {
      type: String // will store HTML strings of slides
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Booklet = mongoose.model('Booklet', bookletSchema);