"use client";
import { useState } from "react";
import Link from "next/link";
import { FiChevronDown, FiChevronUp, FiBell, FiCheck, FiX } from "react-icons/fi";

const NotificationPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "order",
      title: "Your order has been shipped",
      message:
        "Your African print dress (Order #AFR-7892) has been shipped and will arrive in 2-3 business days.",
      date: "10 minutes ago",
      read: false,
      orderId: "AFR-7892",
    },
    {
      id: 2,
      type: "promotion",
      title: "New collection just dropped!",
      message:
        "Check out our new Ankara summer collection. Get 15% off for the first 100 customers.",
      date: "2 hours ago",
      read: true,
      promoCode: "SUMMER15",
    },
    {
      id: 3,
      type: "system",
      title: "Password changed successfully",
      message: "Your account password was updated on June 15, 2023 at 2:45 PM.",
      date: "1 day ago",
      read: true,
    },
    {
      id: 4,
      type: "order",
      title: "Order confirmed",
      message: "Your order #AFR-6541 has been confirmed and is being processed.",
      date: "3 days ago",
      read: true,
      orderId: "AFR-6541",
    },
    {
      id: 5,
      type: "promotion",
      title: "Flash sale ending soon!",
      message:
        "Last chance! Our 24-hour flash sale ends in 3 hours. Don't miss out on these deals!",
      date: "1 week ago",
      read: true,
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const filteredNotifications =
    activeTab === "all" ? notifications : notifications.filter((n) => n.type === activeTab);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FiBell className="text-amber-600" /> Notifications
        </h1>
        <button
          onClick={markAllAsRead}
          className="text-sm font-medium text-amber-600 hover:text-amber-700">
          Mark all as read
        </button>
      </div>

      {/* Notification Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "all", name: "All" },
            { id: "order", name: "Orders" },
            { id: "promotion", name: "Promotions" },
            { id: "system", name: "System" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <FiBell className="w-full h-full" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === "all"
                ? "You don't have any notifications yet."
                : `You don't have any ${activeTab} notifications.`}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border ${
                notification.read ? "bg-white border-gray-200" : "bg-amber-50 border-amber-200"
              }`}>
              <div className="p-4 flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 flex-shrink-0 h-5 w-5 rounded-full ${
                      notification.read ? "bg-gray-300" : "bg-amber-500"
                    }`}
                  />
                  <div>
                    <h3
                      className={`text-sm font-medium ${
                        notification.read ? "text-gray-700" : "text-gray-900"
                      }`}>
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{notification.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-gray-400 hover:text-gray-500"
                      title="Mark as read">
                      <FiCheck className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-gray-400 hover:text-gray-500"
                    title="Delete">
                    <FiX className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === notification.id ? null : notification.id)
                    }
                    className="text-gray-400 hover:text-gray-500 ml-1">
                    {expandedId === notification.id ? (
                      <FiChevronUp className="h-5 w-5" />
                    ) : (
                      <FiChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {expandedId === notification.id && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-700 mb-3">{notification.message}</p>
                  {notification.type === "order" && notification.orderId && (
                    <Link
                      href={`/orders/${notification.orderId}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none">
                      View Order
                    </Link>
                  )}
                  {notification.type === "promotion" && notification.promoCode && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Use code: {notification.promoCode}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Empty state for mobile filtering */}
      {filteredNotifications.length === 0 && activeTab !== "all" && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setActiveTab("all")}
            className="text-sm font-medium text-amber-600 hover:text-amber-700">
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
