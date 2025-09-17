import express from "express";
import scrapeRoutes from "./routes/scrapeRoutes.js";
import cors from "cors";
import summarizeRoutes from "./routes/summarizeRoutes.js";
import slideRoutes from "./routes/slideRoutes.js";
import bodyParser from 'body-parser';
import exportRoutes from './routes/exportRoutes.js';
import bookletRoutes from './routes/bookletRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Scraping API
app.use("/api/scrape", scrapeRoutes);
// Summarization API
app.use("/api/summarize", summarizeRoutes);
// Slide Generation API
app.use("/api/slides", slideRoutes);
// Export Slides API
app.use(bodyParser.json({ limit: '10mb' }));
app.use('/api/export', exportRoutes);

app.use('/api/booklets', bookletRoutes);


export default app;