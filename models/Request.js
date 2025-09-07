// models/Request.js
const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    why: {
      type: String,
      required: [true, "Reason for request (why) is required"],
      trim: true,
      minlength: [3, "Reason must be at least 3 characters long"],
    },
    what: {
      type: String,
      required: [true, "Details about the request (what) are required"],
      trim: true,
      minlength: [3, "Details must be at least 3 characters long"],
    },
    where: {
      type: String,
      required: [true, "Location (where) is required"],
      trim: true,
    },
    priority: {
      type: String,
      required: [true, "Priority is required"],
      enum: {
        values: ["low", "medium", "high", "critical"],
        message: "Priority must be low, medium, high, or critical",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "in-progress", "resolved", "rejected"],
        message: "Status must be pending, in-progress, resolved, or rejected",
      },
      default: "pending",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);