import { model, Schema } from "mongoose";

const decibelSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    db: {
      type: Number,
      required: true,
    },
    place: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default model("Decibel", decibelSchema);