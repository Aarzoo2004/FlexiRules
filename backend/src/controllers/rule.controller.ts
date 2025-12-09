// src/controllers/rule.controller.ts
import type { Request, Response } from "express";
import RuleModel from "../models/rule.model.js";

// POST /rules
export async function createRule(req: Request, res: Response) {
    try {
        const payload = req.body;

        if (!payload?.name || !Array.isArray(payload?.conditions) || !payload?.action) {
            return res.status(400).json({ error: "name, conditions and action are required" });
        }

        const doc = await (RuleModel as any).create(payload as any);
        return res.status(201).json(doc);
    } catch (err) {
        console.error("createRule error:", err);
        return res.status(500).json({ error: "Failed to create rule" });
    }
}

// GET /rules
export async function listRules(req: Request, res: Response) {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const skip = (page - 1) * limit;

        const search = req.query.search?.toString().trim();
        const active = req.query.active?.toString();

        const filter: any = {};
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }
        if (active === "true") filter.active = true;
        if (active === "false") filter.active = false;

        const [items, total] = await Promise.all([
            (RuleModel as any).find(filter).sort({ priority: -1, createdAt: -1 }).skip(skip).limit(limit),
            RuleModel.countDocuments(filter),
        ]);

        return res.json({
            items,
            total,
            page,
            limit,
        });
    } catch (err) {
        console.error("listRules error:", err);
        return res.status(500).json({ error: "Failed to list rules" });
    }
}

// GET /rules/:id
export async function getRuleById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const doc = await (RuleModel as any).findById(id);
        if (!doc) return res.status(404).json({ error: "Rule not found" });
        return res.json(doc);
    } catch (err) {
        console.error("getRuleById error:", err);
        return res.status(500).json({ error: "Failed to fetch rule" });
    }
}

// PUT /rules/:id
export async function updateRule(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const payload = req.body;
        const doc = await (RuleModel as any).findByIdAndUpdate(id, payload, { new: true });
        if (!doc) return res.status(404).json({ error: "Rule not found" });
        return res.json(doc);
    } catch (err) {
        console.error("updateRule error:", err);
        return res.status(500).json({ error: "Failed to update rule" });
    }
}

// DELETE /rules/:id
export async function deleteRule(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const doc = await (RuleModel as any).findByIdAndDelete(id);
        if (!doc) return res.status(404).json({ error: "Rule not found" });
        return res.status(204).send();
    } catch (err) {
        console.error("deleteRule error:", err);
        return res.status(500).json({ error: "Failed to delete rule" });
    }
}

// PATCH /rules/:id/active
export async function setRuleActive(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { active } = req.body;
        if (typeof active !== "boolean") {
            return res.status(400).json({ error: "active (boolean) is required in body" });
        }

        const doc = await (RuleModel as any).findByIdAndUpdate(id, { active }, { new: true });
        if (!doc) return res.status(404).json({ error: "Rule not found" });
        return res.json(doc);
    } catch (err) {
        console.error("setRuleActive error:", err);
        return res.status(500).json({ error: "Failed to update active flag" });
    }
}
