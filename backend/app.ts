import express from "express"
import cors from "cors"
import Rule from "./src/engine/rule.class.js"
import { operatorMap, normalizeOperator } from "./src/engine/evaluator.operators.js"
import engineRoutes from "./src/routes/engine.routes.js"
import router from "./src/routes/rules.routes.js"


const app = express()

app.use(cors())
app.use(express.json())
app.use("/rules", router);
app.use("/engine", engineRoutes)

app.get("/test-rule", (req: any, res: any) => {
    res.json({ message: "Rule Engine setup working" })
})

app.post("/test-evaluate", (req, res) => {
    const { rule, input } = req.body

    if (!rule || !input) {
        return res.status(400).json({ error: "Rule and input are required" })
    }

    try {
        const ruleInstance = new Rule(rule)
        const matched = Boolean(ruleInstance.evaluate(input))

        let failedConditionIndex: number | null = null
        if (!matched) {
            const conditons = ruleInstance.conditions ?? []
            for (let i = 0; i < conditons.length; i++) {
                const cond = conditons[i]
                if (!cond) continue
                const actual = ruleInstance.getFieldValue(input, cond.field)
                const opKey = normalizeOperator(cond.operator ?? "equals")
                const opFn = operatorMap[opKey]
                if (typeof opFn !== "function") {
                    failedConditionIndex = i
                    break
                }
                const ok = opFn(actual, cond.value)
                if (!ok) {
                    failedConditionIndex = i
                    break
                }
            }
        }

        res.json({
            matched,
            failedConditionIndex,
        })
    } catch (error) {
        console.error("Error evaluating rule:", error)
        return res.status(500).json({ error: "Error evaluating rule", details: error instanceof Error ? error.message : String(error) })
    }
})

export default app
