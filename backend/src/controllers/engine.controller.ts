import type { Request, Response } from "express";
import Engine from "../engine/engine.class.js";
import Rule from "../engine/rule.class.js"; 
import RuleModel from "../models/rule.model.js";
import type { Shape } from "../engine/rule.types.js";

// simple singleton engine for demo (in-memory)
const engine = new Engine();

export async function runEngine(req: Request, res: Response) {
  try {
    const { rules, input, options, ruleIds } = req.body;

    if (!input) {
      return res.status(400).json({ error: "input is required in body" });
    }

    // CASE 1: rules provided in body → use them directly (existing behavior)
    if (Array.isArray(rules) && rules.length > 0) {
      const ruleInstances = rules.map((r: any) => (r instanceof Rule ? r : new Rule(r)));
      engine.setRules(ruleInstances);
      const result = engine.run(input, options);
      return res.json({ runId: Date.now().toString(), source: "body", result });
    }

    // CASE 2: no rules in body → load from MongoDB
    const query: any = { active: true };

    // optional filter: ruleIds in body
    if (Array.isArray(ruleIds) && ruleIds.length > 0) {
      query._id = { $in: ruleIds };
    }

    const docs = await (RuleModel as any).find(query).sort({ priority: -1 });
    if (!docs.length) {
      return res.json({
        runId: Date.now().toString(),
        source: "db",
        result: {
          matched: false,
          appliedRules: [],
          combinedAction: null,
          diagnostics: [],
        },
        message: "No active rules found in DB",
      });
    }

    // map DB docs to Rule constructor input
    const ruleObjects = docs.map((doc: { id: any; name: any; conditions: any; action: any; priority: any; }) => ({
      id: doc.id,                  // Mongoose virtual string id
      name: doc.name,
      conditions: doc.conditions,
      action: doc.action,
      priority: doc.priority ?? 0,
    }));

    const ruleInstances = ruleObjects.map((r: Shape) => new Rule(r));
    engine.setRules(ruleInstances);

    const result = engine.run(input, options);
    return res.json({ runId: Date.now().toString(), source: "db", result });

  } catch (err) {
    console.error("runEngine error:", err);
    return res.status(500).json({
      error: "Engine run failed",
      details: err instanceof Error ? err.message : String(err),
    });
  }
}


export function getEngineLogs(req: any, res: any) {
  return res.json({ logs: engine.getLogs(50) });
}
