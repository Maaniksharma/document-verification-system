import { Schema, model } from "mongoose";

const ReadersSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  "doc-requests": [String],
  createdAt: { type: Date, default: Date.now },
});

export default model("Readers", ReadersSchema);
