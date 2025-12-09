import mongoose, { Schema } from "mongoose";

export interface ConditionDoc {
  field: string;
  operator: string;
  value: any;
}

export interface RuleDoc {
  name: string;
  description?: string;
  conditions: ConditionDoc[];
  action: any;
  priority?: number;
  active?: boolean;
  tags?: string[];
  meta?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export type RuleDocument = mongoose.Document & RuleDoc;

const ConditionSchema = new Schema<ConditionDoc>(
  {
    field: { type: String, required: true },
    operator: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false } // conditions are embedded, no separate _id per condition
);

const RuleSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String },
    conditions: { type: [ConditionSchema], required: true },
    action: { type: Schema.Types.Mixed, required: true },
    priority: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true, index: true },
    tags: { type: [String], default: [] },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
    collection: "rules",
  }
);

RuleSchema.index({ name: "text", description: "text" });

const RuleModel = mongoose.models.Rule || mongoose.model<RuleDocument>("Rule", RuleSchema);
export default RuleModel;
