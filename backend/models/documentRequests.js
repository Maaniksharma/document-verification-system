import mongoose, { Schema, model } from "mongoose";

const DocRequestSchema = new Schema({
  "reader-id": {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Readers",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  "template-path": {
    type: String,
    required: true,
  },
  fields: {
    type: [String],
    of: mongoose.Schema.Types.Mixed,
    required: true,
  },
  values: {
    type: [
      {
        data: {
          type: [String],
          required: true,
        },
        status: {
          type: Number,
          enum: [0, 1, 2],
          default: 0,
        },
        "assigned-officer": {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Officers",
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
});

export default model("DocumentRequests", DocRequestSchema);
