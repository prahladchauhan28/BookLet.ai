import { getSummary } from "../services/AiSummary.js";

export const summarizeText = async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const summary = await getSummary(text);
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
