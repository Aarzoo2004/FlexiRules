import express from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/test-rule", (req: any, res: any)=>{
    res.json({message: "Rule Engine setup working"})
})

export default app
