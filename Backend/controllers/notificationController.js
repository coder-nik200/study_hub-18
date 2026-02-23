const Notification = require("../models/notification");
const User = require("../models/user");

// Create notifications for multiple students when a task is assigned
const createTaskNotifications = async (
  studentIds,
  taskId,
  expertId,
  taskTitle,
) => {
  try {
    const expert = await User.findById(expertId);
    if (!expert) return;

    const notifications = studentIds.map((studentId) => ({
      user: studentId,
      task: taskId,
      expert: expertId,
      title: "New Task Assigned",
      message: `${expert.name} assigned you a new task: ${taskTitle}`,
      type: "task_assigned",
      priority: "high",
    }));

    await Notification.insertMany(notifications);
  } catch (error) {
    console.error("Error creating notifications:", error);
  }
};

// Get notifications for a user
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { unreadOnly } = req.query;

    const query = { user: userId };
    if (unreadOnly === "true") {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .populate("task", "title dueDate")
      .populate("expert", "name")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: error.message });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res
      .status(200)
      .json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating notification", error: error.message });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { user: userId, read: false },
      { read: true },
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating notifications", error: error.message });
  }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Notification.countDocuments({
      user: userId,
      read: false,
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching notification count",
      error: error.message,
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(400).jsoon({ message: "Notificaiton not found" });
    }

    res.json({ message: "Notificatin deleted successfully" });
  } catch (err) {
    console.error(error);
    res.status(500).json({
      message: "Error during deleting",
      error: error.message,
    });
  }
};

module.exports = {
  createTaskNotifications,
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
};
