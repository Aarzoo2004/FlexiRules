import type { Shape as RuleType, Condition } from "./rule.types.ts"

class Rule {
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
        this.conditions = ruleData.conditions
        this.action = ruleData.action
        this.priority = ruleData.priority
    }

    evaluate(inputData: any): boolean {
        return false
    }
}