const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/notifications", authMiddleware, getNotifications);
router.patch("/notifications/:notificationId/read", authMiddleware, markAsRead);
router.patch("/notifications/read-all", authMiddleware, markAllAsRead);
router.get("/notifications/unread-count", authMiddleware, getUnreadCount);

module.exports = router;

