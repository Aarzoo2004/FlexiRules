// src/types/rule.ts

export interface Condition {
    field: string;
    operator: string;
    value: any; // you can narrow this later (string | number | boolean | ...)
  }
  
  export interface RuleAction {
    type: string; // e.g. "discount", "flag", "reject"
    value: any;   // e.g. 15, "REASON_CODE", etc.
  }
  
  export interface Rule {
    _id: string;              // MongoDB id
    name: string;
    description?: string;
    conditions: Condition[];
    action: RuleAction | any; // backend currently stores Mixed; you can refine later
    priority?: number;
    active?: boolean;
    tags?: string[];
    meta?: any;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface RulesListResponse {
    items: Rule[];
    total: number;
    page: number;
    limit: number;
  }
  