import express from "express";
import scrapeRoutes from "./routes/scrapeRoutes.js";
import cors from "cors";
import summarizeRoutes from "./routes/summarizeRoutes.js";
import slideRoutes from "./routes/slideRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
// Scraping API
app.use("/api/scrape", scrapeRoutes);
// Summarization API
app.use("/api/summarize", summarizeRoutes);

// Slide Generation API
app.use("/api/slides", slideRoutes);

//check api is working
app.get("/", (req, res) => {
  res.send("API is working");
});

export default app;