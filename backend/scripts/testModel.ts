// scripts/testModel.ts
import "dotenv/config";
import { connectDB, closeDB } from "../src/config/db.js";
import RuleModel from "../src/models/rule.model.js";

async function main() {
  await connectDB();

  const doc = new RuleModel({
    name: "Test: High value electronics",
    description: "Inserted by test script",
    conditions: [
      { field: "category", operator: "equals", value: "electronics" },
      { field: "price", operator: ">", value: 20000 }
    ],
    action: { type: "discount", value: 15 },
    priority: 10,
    active: true,
    tags: ["test","electronics"]
  });

  const saved = await doc.save();
  console.log("Inserted rule id:", saved._id.toString());

  await closeDB();
}
main().catch(err => {
  console.error(err);
  process.exit(1);
});
