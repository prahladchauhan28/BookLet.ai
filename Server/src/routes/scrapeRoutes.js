import express from "express";
import { scrapeArticle } from "../controllers/scrapeController.js";

const router = express.Router();
router.post("/", scrapeArticle);

export default router;

