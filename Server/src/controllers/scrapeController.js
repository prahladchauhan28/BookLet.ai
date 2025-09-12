import { scrapePage } from "../services/scrapeService.js";

export const scrapeArticle = async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const { title, content } = await scrapePage(url);
    res.json({ title, content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
