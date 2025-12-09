// src/engine/evaluator.operators.ts

/** Helper: is the value numeric (after trimming)? */
export function isNumeric(value: any): boolean {
  if (value === null || value === undefined) return false;
  const n = Number(String(value).trim());
  return !Number.isNaN(n) && Number.isFinite(n);
}

/** Normalize operator strings to a canonical key */
export function normalizeOperator(op: string): string {
  if (!op) return "equals";
  const s = String(op).trim().toLowerCase();
  switch (s) {
    case ">":
    case "gt":
    case "greater":
    case "greaterthan":
    case "greater_than":
      return ">";
    case "<":
    case "lt":
    case "less":
    case "lessthan":
    case "less_than":
      return "<";
    case ">=":
    case "gte":
    case "greaterorequal":
    case "greater_or_equal":
      return ">=";
    case "<=":
    case "lte":
    case "lessorequal":
    case "less_or_equal":
      return "<=";
    case "!=":
    case "<>":
    case "ne":
    case "notequals":
    case "not_equals":
    case "not":
      return "!=";
    case "==":
    case "=":
    case "eq":
    case "equals":
    case "equal":
      return "==";
    case "contains":
    case "includes":
      return "contains";
    case "startswith":
    case "starts_with":
    case "start":
      return "startsWith";
    case "endswith":
    case "ends_with":
    case "end":
      return "endsWith";
    case "in":
      return "in";
    case "between":
      return "between";
    default:
      return s; // allow custom operators to fall through
  }
}

/** Numeric comparisons - all guard for invalid input */
export function opGreater(actual: any, expected: any): boolean {
  if (!isNumeric(actual) || !isNumeric(expected)) return false;
  return Number(String(actual).trim()) > Number(String(expected).trim());
}

export function opLess(actual: any, expected: any): boolean {
  if (!isNumeric(actual) || !isNumeric(expected)) return false;
  return Number(String(actual).trim()) < Number(String(expected).trim());
}

export function opGte(actual: any, expected: any): boolean {
  if (!isNumeric(actual) || !isNumeric(expected)) return false;
  return Number(String(actual).trim()) >= Number(String(expected).trim());
}

export function opLte(actual: any, expected: any): boolean {
  if (!isNumeric(actual) || !isNumeric(expected)) return false;
  return Number(String(actual).trim()) <= Number(String(expected).trim());
}

/** Equality with sensible coercion */
export function opEquals(actual: any, expected: any): boolean {
  // fast path: strict equality (covers same type/value)
  if (actual === expected) return true;

  // treat missing values as not equal
  if (actual === null || actual === undefined || expected === null || expected === undefined) {
    return false;
  }

  // numeric comparison when both numeric-like
  if (isNumeric(actual) && isNumeric(expected)) {
    return Number(String(actual).trim()) === Number(String(expected).trim());
  }

  // boolean-like strings vs booleans
  const aLower = String(actual).trim().toLowerCase();
  const eLower = String(expected).trim().toLowerCase();
  const booleanLiterals = new Set(["true", "false"]);
  if (booleanLiterals.has(aLower) && booleanLiterals.has(eLower)) {
    return aLower === eLower;
  }

  // fallback: trimmed string equality
  return String(actual).trim() === String(expected).trim();
}

/** Inverse of equals */
export function opNotEquals(actual: any, expected: any): boolean {
  return !opEquals(actual, expected);
}

/** Contains: string includes or array includes */
export function opContains(actual: any, expected: any): boolean {
  if (actual === null || actual === undefined) return false;
  // If actual is array
  if (Array.isArray(actual)) {
    // use strict includes; allow expected to be coerced to same primitive type if needed
    return actual.includes(expected);
  }
  // If actual is string
  if (typeof actual === "string" || typeof actual === "number" || typeof actual === "boolean") {
    return String(actual).includes(String(expected));
  }
  return false;
}

/** startsWith / endsWith (strings only) */
export function opStartsWith(actual: any, expected: any): boolean {
  if (actual === null || actual === undefined) return false;
  if (typeof actual !== "string" && typeof actual !== "number" && typeof actual !== "boolean") return false;
  return String(actual).startsWith(String(expected));
}

export function opEndsWith(actual: any, expected: any): boolean {
  if (actual === null || actual === undefined) return false;
  if (typeof actual !== "string" && typeof actual !== "number" && typeof actual !== "boolean") return false;
  return String(actual).endsWith(String(expected));
}

/** 'in' operator: expected should be an array (contains actual) */
export function opIn(actual: any, expected: any): boolean {
  console.log("opIn", actual, expected)
  if (!Array.isArray(expected)) return false;
  console.log("opIn", expected.includes(actual))
  return expected.includes(actual);
}

/** between operator: expected can be [min, max] or {min, max} */
export function opBetween(actual: any, expected: any): boolean {
  if (!isNumeric(actual)) return false;
  const val = Number(String(actual).trim());

  let min: number | undefined;
  let max: number | undefined;

  if (Array.isArray(expected) && expected.length >= 2) {
    if (!isNumeric(expected[0]) || !isNumeric(expected[1])) return false;
    min = Number(String(expected[0]).trim());
    max = Number(String(expected[1]).trim());
  } else if (expected && typeof expected === "object") {
    if ("min" in expected) min = Number(String((expected as any).min).trim());
    if ("max" in expected) max = Number(String((expected as any).max).trim());
    if (min === undefined || max === undefined) return false;
  } else {
    return false;
  }

  return val >= (min as number) && val <= (max as number);
}

/** Operator map for quick lookup in evaluate() */
export const operatorMap: Record<string, (a: any, b: any) => boolean> = {
  ">": opGreater,
  "<": opLess,
  ">=": opGte,
  "<=": opLte,
  "==": opEquals,
  "equals": opEquals,
  "!=": opNotEquals,
  "contains": opContains,
  "includes": opContains,
  "startsWith": opStartsWith,
  "endsWith": opEndsWith,
  "in": opIn,
  "between": opBetween,
};
