import Rule from "./rule.class.js"
import type { Shape as RuleType } from "./rule.types"
import type { ExecutionLog, RunOptions, RunResult } from "./engine.types"

export default class Engine {

    private rules: Rule[] = [];
    private logs: ExecutionLog[] = [];

    constructor(ruleList?: RuleType[] | Rule[]) {
        if (ruleList && ruleList.length) {
            // if raw RuleType objects passed, convert; if Rule instances, keep
            this.rules = ruleList.map(r => (r instanceof Rule ? r : new Rule(r as RuleType)))
            this.sortRules();
        }
    }

    private sortRules() {
        this.rules.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    }

    addRule(rule: Rule) {
        this.rules.push(rule)
        this.sortRules()
    }

    removeRule(ruleId: string): boolean{
        const idx = this.rules.findIndex(r => r.id === ruleId)
        if(idx === -1) return false
        this.rules.splice(idx, 1)
        return true
    }

    setRules(ruleList: RuleType[] | Rule[]){
        this.rules = ruleList.map(r => (r instanceof Rule ? r : new Rule(r as RuleType)))
        this.sortRules()
    }

    getRules(): Rule[] {
        return [...this.rules]
    }

    clearRules(){
        this.rules = []
    }

    run(inputData: any, options: RunOptions = {}): RunResult {
        const start = Date.now();
        const appliedRules: { id: string; name: string; action: any }[] = [];
        const diagnostics: any[] = [];
    
        // prepare rule list (filter by ids if provided)
        let rulesToRun = this.rules;
        if (options.ruleIdsToRun && options.ruleIdsToRun.length) {
          const set = new Set(options.ruleIdsToRun);
          rulesToRun = rulesToRun.filter(r => set.has(r.id));
        }
    
        for (const rule of rulesToRun) {
          const rStart = Date.now();
          let matched = false;
          try {
            matched = rule.evaluate(inputData);
          } catch (err) {
            matched = false;
          }
          const rDuration = Date.now() - rStart;
          diagnostics.push({ ruleId: rule.id, ruleName: rule.name, matched, durationMs: rDuration });
    
          if (matched) {
            appliedRules.push({ id: rule.id, name: rule.name, action: rule.action });
            if (options.stopOnFirstMatch) break;
          }
        }
    
        // combine actions
        let combinedAction: any = null;
        const combineMode = options.combineActions ?? "all";
        if (combineMode === "first") {
          combinedAction = appliedRules.length ? appliedRules[0]?.action : null;
        } else if (combineMode === "all") {
          combinedAction = appliedRules.map(a => a.action);
        } else if (combineMode === "merge") {
          combinedAction = this.mergeActions(appliedRules) ?? null;
        }
    
        const result: RunResult = {
          matched: appliedRules.length > 0,
          appliedRules,
          combinedAction,
          diagnostics,
        };
    
        const durationMs = Date.now() - start;
        const log: ExecutionLog = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
          timestamp: new Date().toISOString(),
          inputSummary: JSON.stringify(inputData).slice(0, 200),
          result,
          durationMs,
        };
    
        this.logs.unshift(log);
        if (this.logs.length > 200) this.logs.pop();
    
        return result;
      }

      private mergeActions(appliedRules: { id: string; name: string; action: any }[]): any {
        if (!appliedRules || appliedRules.length === 0) return null;
    
        // If all actions have type 'discount' and numeric value -> sum them
        const allDiscount = appliedRules.every(a => a.action && a.action.type === "discount" && typeof a.action.value === "number");
        if (allDiscount) {
          const total = appliedRules.reduce((s, a) => s + (a.action.value || 0), 0);
          return { type: "discount", value: total };
        }
    
        // fallback: return array of actions
        return appliedRules.map(a => a.action);
      }
    
      getLogs(limit = 20) {
        return this.logs.slice(0, limit);
      }
    
    
}