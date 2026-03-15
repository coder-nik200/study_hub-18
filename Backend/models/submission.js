const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answer: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "submitted", "reviewed"],
      default: "pending",
    },

    marks: Number,
    feedback: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Submission", submissionSchema);
