"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FiChevronDown, FiChevronUp, FiBell, FiCheck, FiX } from "react-icons/fi";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} from "@/redux/services/NotificationApiSlice";
import { useSocket } from "@/redux/SocketContext";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

// TypeScript interfaces
interface NotificationData {
  orderId?: string;
  promoCode?: string;
  productId?: string;
  stylistId?: string;
  [key: string]: any;
}

interface Notification {
  _id: string;
  type: "order" | "promotion" | "system" | "product" | "message" | "admin" | string;
  title?: string;
  message: string;
  read: boolean;
  data?: NotificationData;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  count: number;
  notifications: Notification[];
}

const NotificationPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 20;
  const [activeTab, setActiveTab] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Socket integration
  const { socket, isConnected } = useSocket();
  const { isAuthenticated } = useSelector((store: RootState) => store.authSlice);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/notifications");
    }
  }, [isAuthenticated, router]);

  // RTK Query hooks
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetNotificationsQuery({ page, limit });

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  // Extract notifications from API response
  const notifications = apiResponse?.notifications || [];

  // Socket effect for real-time notifications
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewNotification = (notification: Notification) => {
      console.log("New notification received on page:", notification);
      // Refetch notifications to update the list
      refetch();
    };

    socket.on("newNotification", handleNewNotification);
    socket.on("notification-updated", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
      socket.off("notification-updated", handleNewNotification);
    };
  }, [socket, isConnected, refetch]);

  // Format date relative to now
  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Just now";
    }
  };

  // Handle marking notification as read
  const handleMarkAsRead = async (notificationId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await markAsRead(notificationId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  // Handle deleting notification
  const handleDeleteNotification = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNotification(notificationId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification._id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case "new_order":
      case "order_status_update":
      case "order_delivered":
      case "order_cancelled":
        if (notification.data?.orderId) {
          router.push(`/orders/${notification.data.orderId}`);
        } else {
          router.push("/orders");
        }
        break;

      case "product_approved":
      case "product_rejected":
      case "product_approval_request":
        if (notification.data?.productId) {
          router.push(`/products/${notification.data.productId}`);
        } else {
          router.push("/products");
        }
        break;

      case "message_received":
        router.push("/chats");
        break;

      case "promotion":
        if (notification.data?.promoCode) {
          router.push(`/offers?code=${notification.data.promoCode}`);
        } else {
          router.push("/offers");
        }
        break;

      case "stylist_approved":
      case "stylist_rejected":
      case "stylist_suspended":
      case "stylist_activated":
        router.push("/stylist/profile");
        break;

      case "credit_wallet":
      case "debit_wallet":
        router.push("/wallet");
        break;

      default:
        // For unknown types or system notifications, just close
        break;
    }
  };

  // Filter notifications based on active tab
  const filteredNotifications =
    activeTab === "all" ? notifications : notifications.filter((n) => n.type === activeTab);

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_order":
      case "order_status_update":
        return "🛍️";
      case "product_approved":
      case "product_approval_request":
        return "📦";
      case "product_rejected":
        return "❌";
      case "message_received":
        return "💬";
      case "credit_wallet":
        return "💰";
      case "stylist_approved":
      case "stylist_verification_request":
        return "✂️";
      case "stylist_rejected":
        return "⚠️";
      case "system_alert":
        return "🔔";
      case "promotion":
        return "🎉";
      default:
        return "📢";
    }
  };

  // Get display title based on notification type
  const getNotificationTitle = (notification: Notification) => {
    if (notification.title) return notification.title;

    switch (notification.type) {
      case "new_order":
        return "New Order Received";
      case "order_status_update":
        return "Order Status Updated";
      case "product_approved":
        return "Product Approved";
      case "product_rejected":
        return "Product Rejected";
      case "message_received":
        return "New Message";
      case "promotion":
        return "Special Promotion";
      default:
        return "Notification";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiBell className="text-amber-600" /> Notifications
          </h1>
        </div>

        {/* Tabs Skeleton */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            {["All", "Orders", "Promotions", "System", "Products", "Messages"].map((tab) => (
              <div key={tab} className="py-4 px-1">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 h-5 w-5 rounded-full bg-gray-300" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-48"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-64"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-5 w-5 bg-gray-300 rounded"></div>
                  <div className="h-5 w-5 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-red-500">
            <FiBell className="w-full h-full" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading notifications</h3>
          <p className="mt-1 text-sm text-gray-500">
            {error?.data?.message || "Unable to load notifications. Please try again."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FiBell className="text-amber-600" /> Notifications
          {socket && (
            <span
              className={`ml-2 text-xs px-2 py-1 rounded-full ${
                isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          )}
        </h1>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm font-medium text-amber-600 hover:text-amber-700">
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { id: "all", name: "All" },
            { id: "order", name: "Orders" },
            { id: "promotion", name: "Promotions" },
            { id: "system", name: "System" },
            { id: "product", name: "Products" },
            { id: "message", name: "Messages" },
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
          filteredNotifications.map((notification) => {
            const title = getNotificationTitle(notification);

            return (
              <div
                key={notification._id}
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
                        {title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="text-gray-400 hover:text-gray-500"
                        title="Mark as read">
                        <FiCheck className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDeleteNotification(notification._id, e)}
                      className="text-gray-400 hover:text-gray-500"
                      title="Delete">
                      <FiX className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        setExpandedId(expandedId === notification._id ? null : notification._id)
                      }
                      className="text-gray-400 hover:text-gray-500 ml-1">
                      {expandedId === notification._id ? (
                        <FiChevronUp className="h-5 w-5" />
                      ) : (
                        <FiChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedId === notification._id && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-200">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-lg mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <p className="text-sm text-gray-700 flex-1">{notification.message}</p>
                    </div>

                    {/* Action buttons based on notification type */}
                    {notification.type === "order" && notification.data?.orderId && (
                      <button
                        onClick={() => handleNotificationClick(notification)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none">
                        View Order
                      </button>
                    )}

                    {notification.type === "promotion" && notification.data?.promoCode && (
                      <div className="space-y-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Use code: {notification.data.promoCode}
                        </span>
                        <button
                          onClick={() => handleNotificationClick(notification)}
                          className="ml-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700">
                          View Offers
                        </button>
                      </div>
                    )}

                    {notification.type === "product" && notification.data?.productId && (
                      <button
                        onClick={() => handleNotificationClick(notification)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                        View Product
                      </button>
                    )}

                    {notification.type === "message" && notification.data?.stylistId && (
                      <button
                        onClick={() => handleNotificationClick(notification)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-purple-600 hover:bg-purple-700">
                        View Message
                      </button>
                    )}

                    {/* Delete button for expanded view */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <button
                        onClick={(e) => handleDeleteNotification(notification._id, e)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium">
                        Delete this notification
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {notifications.length > 0 && (
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className={`px-4 py-2 rounded-md ${
              page === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-amber-600 text-white hover:bg-amber-700"
            }`}>
            Previous
          </button>

          <span className="text-sm text-gray-600">Page {page}</span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={notifications.length < limit}
            className={`px-4 py-2 rounded-md ${
              notifications.length < limit
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-amber-600 text-white hover:bg-amber-700"
            }`}>
            Next
          </button>
        </div>
      )}

      {/* View all notifications link */}
      {notifications.length > 0 && (
        <div className="mt-8 text-center">
          <Link
            href="/notifications"
            className="text-sm font-medium text-amber-600 hover:text-amber-700">
            View all notifications
          </Link>
        </div>
      )}

      {/* Socket connection status */}
      {socket && (
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Real-time notifications: {isConnected ? "Connected" : "Disconnected"}</p>
          {!isConnected && (
            <p className="mt-1">Notifications may be delayed. Check your connection.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
