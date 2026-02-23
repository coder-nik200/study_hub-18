const TaskAssignment = require("../models/taskAssignment");
const Submission = require("../models/submission");

// Update task status for a student
const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, submissionData } = req.body;
    const studentId = req.user.id;

    // Validate status
    const validStatuses = ["Pending", "In Progress", "Completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find or create task assignment
    let assignment = await TaskAssignment.findOne({
      task: taskId,
      student: studentId,
    });

    if (!assignment) {
      return res.status(404).json({ message: "Task assignment not found" });
    }

    // Update status
    assignment.status = status;

    // Handle submission if provided
    if (submissionData && status === "Completed") {
      let submission = await Submission.findOne({
        task: taskId,
        student: studentId,
      });

      if (submission) {
        submission.answer = submissionData.answer || submission.answer;
        submission.status = "submitted";
        await submission.save();
      } else {
        // Create new submission
        submission = await Submission.create({
          task: taskId,
          student: studentId,
          answer: submissionData.answer,
          status: "submitted",
        });
      }

      assignment.submission = submission._id;
      assignment.submittedAt = new Date();
      assignment.completedAt = new Date();
    }

    if (status === "In Progress") {
      assignment.completedAt = null;
    }

    await assignment.save();

    res.status(200).json({
      message: "Task status updated successfully",
      assignment,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating task status", error: error.message });
  }
};

// Get task assignments for a student
const getStudentTaskAssignments = async (req, res) => {
  try {
    const studentId = req.user.id;

    const assignments = await TaskAssignment.find({ student: studentId })
      .populate({
        path: "task",
        populate: {
          path: "createdBy",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(assignments);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching assignments", error: error.message });
  }
};

// Get all assignments for a specific task (for expert)
const getTaskAssignments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const assignments = await TaskAssignment.find({ task: taskId })
      .populate("student", "name email avatar")
      .populate("submission")
      .sort({ createdAt: -1 });

    res.status(200).json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching task assignments",
      error: error.message,
    });
  }
};

module.exports = {
  updateTaskStatus,
  getStudentTaskAssignments,
  getTaskAssignments,
};
