const ExpertTask = require("../models/expertTask");
const User = require("../models/user");
const TaskAssignment = require("../models/taskAssignment");
const { createTaskNotifications } = require("./notificationController");

// Assign a task to multiple students
const assignTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, attachments, students } =
      req.body;

    const expertId = req.user.id;

    if (!title || !dueDate) {
      return res
        .status(400)
        .json({ message: "Title and due date are required" });
    }

    if (!students || students.length === 0) {
      return res.status(400).json({ message: "No students provided" });
    }

    // Find students - support both IDs and names
    let studentIds = [];
    if (Array.isArray(students)) {
      // Check if students are IDs or names
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(students[0]);

      if (isObjectId) {
        // Students are IDs
        studentIds = students;
      } else {
        // Students are names - find by name
        const foundStudents = await User.find({
          name: { $in: students },
          role: "student",
        });

        if (foundStudents.length === 0) {
          return res
            .status(404)
            .json({ message: "No matching students found" });
        }

        studentIds = foundStudents.map((student) => student._id);
      }
    }

    // Create the task
    const task = await ExpertTask.create({
      title,
      description,
      dueDate,
      priority: priority || "medium",
      attachments: attachments || [],
      createdBy: expertId,
      assignedTo: studentIds,
    });

    // Create task assignments for each student
    const assignments = studentIds.map((studentId) => ({
      task: task._id,
      student: studentId,
      status: "Pending",
    }));

    await TaskAssignment.insertMany(assignments);

    // Create notifications for all students
    await createTaskNotifications(studentIds, task._id, expertId, title);

    // Populate task with student details
    await task.populate("assignedTo", "name email");

    res.status(201).json({
      message: "Task assigned successfully",
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error assigning task",
      error: error.message,
    });
  }
};

// Fetch tasks assigned by an expert with progress data
const getTasksByExpert = async (req, res) => {
  try {
    const expertId = req.user.id;

    const tasks = await ExpertTask.find({ createdBy: expertId })
      .populate("assignedTo", "name email avatar")
      .sort({ createdAt: -1 });

    // Get progress data for each task
    const tasksWithProgress = await Promise.all(
      tasks.map(async (task) => {
        const assignments = await TaskAssignment.find({ task: task._id });

        const total = assignments.length;
        const completed = assignments.filter(
          (a) => a.status === "Completed",
        ).length;
        const inProgress = assignments.filter(
          (a) => a.status === "In Progress",
        ).length;
        const pending = assignments.filter(
          (a) => a.status === "Pending",
        ).length;

        return {
          ...task.toObject(),
          progress: {
            total,
            completed,
            inProgress,
            pending,
            completionRate:
              total > 0 ? Math.round((completed / total) * 100) : 0,
          },
        };
      }),
    );

    res.status(200).json(tasksWithProgress);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
};

// Get task details with all student progress
const getTaskDetails = async (req, res) => {
  try {
    const { taskId } = req.params;
    const expertId = req.user.id;

    const task = await ExpertTask.findOne({
      _id: taskId,
      createdBy: expertId,
    })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email avatar");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const assignments = await TaskAssignment.find({ task: taskId })
      .populate("student", "name email avatar")
      .populate("submission")
      .sort({ createdAt: -1 });

    const total = assignments.length;
    const completed = assignments.filter(
      (a) => a.status === "Completed",
    ).length;
    const inProgress = assignments.filter(
      (a) => a.status === "In Progress",
    ).length;
    const pending = assignments.filter((a) => a.status === "Pending").length;

    // Calculate average completion time
    const completedAssignments = assignments.filter((a) => a.completedAt);
    let avgCompletionTime = 0;
    if (completedAssignments.length > 0) {
      const totalTime = completedAssignments.reduce((sum, a) => {
        const timeDiff = a.completedAt - task.createdAt;
        return sum + timeDiff;
      }, 0);
      avgCompletionTime = Math.round(
        totalTime / completedAssignments.length / (1000 * 60 * 60 * 24),
      ); // in days
    }

    res.status(200).json({
      task,
      assignments,
      analytics: {
        total,
        completed,
        inProgress,
        pending,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        avgCompletionTime,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching task details", error: error.message });
  }
};

// Get all students for selection
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("name email avatar")
      .sort({ name: 1 });

    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching students", error: error.message });
  }
};

// Update task assignment score/feedback (expert grading)
const updateAssignmentGrade = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { score, feedback } = req.body;
    const expertId = req.user.id;

    const assignment =
      await TaskAssignment.findById(assignmentId).populate("task");

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Verify expert owns the task
    if (assignment.task.createdBy.toString() !== expertId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    assignment.score = score;
    assignment.feedback = feedback;

    // Update submission if exists
    if (assignment.submission) {
      const submission = await require("../models/submission").findById(
        assignment.submission,
      );
      if (submission) {
        submission.marks = score;
        submission.feedback = feedback;
        submission.status = "reviewed";
        await submission.save();
      }
    }

    await assignment.save();

    res.status(200).json({
      message: "Grade updated successfully",
      assignment,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating grade", error: error.message });
  }
};

// Delete task assignment
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const expertId = req.user.id;

    const deletedTask = await ExpertTask.findOneAndDelete({
      _id: id,
      createdBy: expertId, // security: only delete own task
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Also delete related assignments
    await TaskAssignment.deleteMany({ task: id });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  assignTask,
  getTasksByExpert,
  getTaskDetails,
  getAllStudents,
  updateAssignmentGrade,
  deleteTask,
};
