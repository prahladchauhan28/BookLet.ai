import express from "express";
import { createSlides } from "../controllers/slideController.js";

const router = express.Router();
router.post("/", createSlides);

export default router;
