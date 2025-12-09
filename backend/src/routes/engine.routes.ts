// src/routes/engine.routes.ts
import express from "express";
import { runEngine, getEngineLogs } from "../controllers/engine.controller.js";

const router = express.Router();

router.post("/run", runEngine);
router.get("/logs", getEngineLogs);

export default router;
