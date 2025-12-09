// src/routes/rules.routes.ts
import express from "express";
import {
  createRule,
  listRules,
  getRuleById,
  updateRule,
  deleteRule,
  setRuleActive,
} from "../controllers/rule.controller.js";

const router = express.Router();

router.post("/", createRule);
router.get("/", listRules);
router.get("/:id", getRuleById);
router.put("/:id", updateRule);
router.delete("/:id", deleteRule);
router.patch("/:id/active", setRuleActive);

export default router;
