import type {Shape as RuleType, Condition } from "./rule.types"
import { operatorMap, normalizeOperator } from "./evaluator.operators";

export default class Rule {
  id: string;
  name: string;
  conditions: Condition[];
  action: {
    type: string
    value: any
  }
  priority: number

  constructor(ruleData: RuleType) {
    this.id = ruleData.id
    this.name = ruleData.name
    this.conditions = ruleData.conditions ?? []
    this.action = ruleData.action
    this.priority = ruleData.priority
  }


  getFieldValue(obj: any, fieldPath: string): any {
    if (!obj || !fieldPath) return undefined

    const parts = fieldPath.split('.')
    let current: any = obj

    for (const part of parts) {
      if (current == null) return undefined
      const idx = Number(part)
      if (!Number.isNaN(idx) && idx.toString() === part) {
        current = Array.isArray(current) ? current[idx] : undefined
      } else {
        current = current[part]
      }
    }
    return current
  }

  evaluate(inputData: any): boolean {
    const conditions = this.conditions;
    if (!Array.isArray(conditions) || conditions.length === 0) return false;
    for (let i = 0; i < conditions.length; i++) {
      const cond = conditions[i];
      if (!cond) continue;
      try {
        // evaluation for this condition goes here
        const actual = this.getFieldValue(inputData, cond.field);
        if (actual === undefined) {
          console.warn(`Rule ${this.id} missing field '${cond.field}'`);
          return false;
        }
        const rawOp = cond.operator ?? "equals";
        const opKey = normalizeOperator(rawOp);
        const opFn = operatorMap[opKey];
        if (typeof opFn !== "function") {
          console.warn(`Rule ${this.id} unknown operator '${rawOp}' (normalized '${opKey}')`);
          return false;
        }
        const matched = opFn(actual, cond.value);
        if (!matched) {
          // optional: console.debug(`Rule ${this.id} condition #${i} failed:`, cond, { actual });
          return false;
        }

      } catch (err) {
        console.warn(`Rule ${this.id} evaluation error on condition ${i}:`, err);
        return false; // fail-safe: do not match if error occurs
      }
    }
    return true
  }
}