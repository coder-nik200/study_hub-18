const mongoose = require("mongoose");

const taskAssignmentSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExpertTask",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    submittedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
    },

    feedback: {
      type: String,
    },
    
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
    },
  },
  { timestamps: true },
);

// Index for efficient queries
taskAssignmentSchema.index({ task: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("TaskAssignment", taskAssignmentSchema);
