import express from "express";
import scrapeRoutes from "./routes/scrapeRoutes.js";
import cors from "cors";
// import bodyParser from "body-parser";

const app = express();

app.use(cors());
app.use(express.json());

// Scraping Routes
app.use("/api/scrape", scrapeRoutes);
// app.post("/api/scrape", scrapeRoutes);


//check api is working
app.get("/", (req, res) => {
  res.send("API is working");
});

export default app;