import { Booklet } from '../models/bookletModel.js';

// Save a new booklet
export const saveBooklet = async (req, res) => {
  try {
    const { title, sourceUrl, summary, slides } = req.body;

    if (!title || !slides || slides.length === 0) {
      return res.status(400).json({ message: 'Title and slides are required' });
    }

    const booklet = new Booklet({ title, sourceUrl, summary, slides });
    const saved = await booklet.save();

    res.status(201).json({ message: 'Booklet saved', booklet: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Saving failed', error: err.message });
  }
};

// Fetch all booklets
export const getAllBooklets = async (req, res) => {
  try {
    const booklets = await Booklet.find().sort({ createdAt: -1 });
    res.json(booklets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Fetching failed', error: err.message });
  }
};
