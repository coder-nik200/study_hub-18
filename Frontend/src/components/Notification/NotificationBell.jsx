import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
  deleteNotification,
} from "../../api/axios";
import { toast } from "react-toastify";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch notifications and unread count
  const fetchNotifications = async () => {
    try {
      const [notificationsRes, countRes] = await Promise.all([
        getNotifications(),
        getUnreadNotificationCount(),
      ]);
      setNotifications(notificationsRes.data);
      setUnreadCount(countRes.data.count);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true })),
      );
      setUnreadCount(0);
      setIsOpen(false);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const handleDeleteNotification = async (notificationId, isUnread) => {
    try {
      await deleteNotification(notificationId);

      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId),
      );

      if (isUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      toast.success("Notification removed");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to remove notification");
    }
  };

  // Format notification message
  const formatMessage = (notification) => {
    if (notification.message) return notification.message;
    if (notification.task) {
      return `New task: ${notification.task.title}`;
    }
    return "You have a new notification";
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-600";
      case "medium":
        return "bg-yellow-100 text-yellow-600";
      case "low":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Format date
  const formatDate = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffInSeconds = Math.floor((now - notifDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return notifDate.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
      >
        <Bell size={22} className="text-gray-700" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-auto sm:left-auto sm:translate-x-0 sm:right-0 sm:top-auto mt-3 w-[90vw] max-w-[320px] sm:w-80 bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 z-50 max-h-[75vh]  flex flex-col min-h-0 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
              Notifications
            </h3>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium"
              >
                <CheckCheck size={16} />
                Mark all
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none][-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {notifications.length === 0 ? (
              <div className="p-10 text-center text-gray-500 flex flex-col min-h-0 items-center">
                <div className="bg-gray-100 p-4 rounded-full mb-3">
                  <Bell size={28} className="opacity-60" />
                </div>
                <p className="text-sm">You're all caught up 🎉</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`
                    p-4
                    hover:bg-gray-50
                    transition-all duration-200
                    cursor-pointer
                    ${!notification.read ? "bg-indigo-50/40" : ""}
                  `}
                    onClick={() => {
                      if (!notification.read) {
                        handleMarkAsRead(notification._id);
                      }
                      if (notification.task?._id) {
                        navigate("/student/tasks");
                        setIsOpen(false);
                      }
                    }}
                  >
                    <div className="flex gap-3">
                      {/* Dot */}
                      <div
                        className={`
                        mt-2 w-2 h-2 rounded-full
                        ${!notification.read ? "bg-indigo-600" : "bg-transparent"}
                      `}
                      />

                      <div className="flex-1 min-w-0">
                        {/* Title + Priority */}
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-gray-800 truncate">
                            {notification.title}
                          </h4>

                          <span
                            className={`
                            text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap
                            ${getPriorityColor(notification.priority)}
                          `}
                          >
                            {notification.priority}
                          </span>
                        </div>

                        {/* Message */}
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                          {formatMessage(notification)}
                        </p>

                        {/* Due Date */}
                        {notification.task && (
                          <p className="text-[11px] text-gray-500 mt-1">
                            Due:{" "}
                            {new Date(
                              notification.task.dueDate,
                            ).toLocaleDateString()}
                          </p>
                        )}

                        {/* Footer Row */}
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-[11px] text-gray-400">
                            {formatDate(notification.createdAt)}
                          </span>

                          <div className="flex items-center gap-3">
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification._id);
                                }}
                                className="text-[11px] text-indigo-600 hover:text-indigo-700 font-medium"
                              >
                                Mark
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNotification(
                                  notification._id,
                                  !notification.read,
                                );
                              }}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
