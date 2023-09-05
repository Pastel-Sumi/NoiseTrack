import mongoose from "mongoose";

const decibelSchema = new mongoose.Schema(
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

export default mongoose.model("Decibel", decibelSchema);
