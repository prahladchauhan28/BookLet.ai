import { generateSlides } from "../services/slideService.js";

export const createSlides = async (req, res) => {
  const { points } = req.body;
  if (!points || !Array.isArray(points)) {
    return res.status(400).json({ error: "Points array required" });
  }

  try {
    const slides = await generateSlides(points);
    res.json({ slides }); // returns array of file paths
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
