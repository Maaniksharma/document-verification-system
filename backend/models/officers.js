import { Schema, model } from "mongoose";

const OfficersSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  "uploaded-signs": [String],
  createdAt: { type: Date, default: Date.now },
});

export default model("Officers", OfficersSchema);
