import mongoose, { model, Schema } from "mongoose";

const courtSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  officers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Officers",
    required: true,
    default: [],
  },
  readers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Readers",
    deafult: [],
  },
  createdAt: { type: Date, default: Date.now },
});

export default model("Courts", courtSchema);
