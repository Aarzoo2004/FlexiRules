export interface RunOptions {
    stopOnFirstMatch?: boolean; // if true stop when first rule matches
    combineActions?: 'merge' | 'first' | 'all'; // how to combine actions from matched rules
    ruleIdsToRun?: string[]; // optional filter: only run these rule ids
}

export interface RunResult {
    matched: boolean;
    appliedRules: { id: string; name: string; action: any }[];
    combinedAction: any | null; // merged result according to combineActions
    diagnostics?: { ruleId: string; matched: boolean; durationMs: number; failedConditionIndex?: number }[];
}

export interface ExecutionLog {
    id: string; // unique run id (timestamp-based)
    timestamp: string;
    inputSummary: any; // small version of input (avoid huge payloads)
    result: RunResult;
    durationMs: number;
}
