"use client";
import React, { useState, useEffect, useRef } from "react";
import { GrClose } from "react-icons/gr";
import {
  BsSearch,
  BsCart4,
  BsBellFill,
  BsPersonCheck,
  BsBoxSeam,
  BsHeart,
  BsX,
  BsCheck,
} from "react-icons/bs";
import { FaUserAlt, FaUserTie, FaHome } from "react-icons/fa";
import { IoLogoWechat } from "react-icons/io5";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { openMobileMenu } from "@/redux/features/appSlice";
import { RootState } from "@/redux/Store";
import { useGetCurrentUserQuery } from "@/redux/services/AuthApiSlice";
import { useGetCartProductsQuery } from "@/redux/services/CartApiSlice";
import { useGetApprovedProductsQuery } from "@/redux/services/ProductApi";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from "@/redux/services/NotificationApiSlice";
import { useGetUnreadMessagesCountQuery } from "@/redux/services/MessageApiSlice";

const MobileNav = () => {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const isMobileMenuOpen = useSelector(
    (state: RootState) => state.shopReducer?.isMobileMenuOpen ?? false,
  );

  // Auth state
  const { data: userData, isLoading: isLoadingUser } = useGetCurrentUserQuery(null, {
    skip: !mounted, // Skip during SSR
  });
  const { user: localUser } = useSelector((store: RootState) => store.authSlice);
  const user = userData?.user || localUser;
  const isUserLoggedIn = !!user;

  // Set mounted after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Fetch notifications and unread counts - skip during SSR
  const { data: unreadCountData, refetch: refetchUnreadCount } = useGetUnreadCountQuery(undefined, {
    skip: !mounted || !isUserLoggedIn,
  });

  const { data: unreadMessagesData } = useGetUnreadMessagesCountQuery(undefined, {
    skip: !mounted || !isUserLoggedIn,
  });

  const {
    data: notificationsData,
    isLoading: isLoadingNotifications,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery({ page: 1, limit: 5 }, { skip: !mounted || !isUserLoggedIn });

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const unreadNotifications = unreadCountData?.count || 0;
  const unreadMessages = unreadMessagesData?.count || 0;
  const notifications = notificationsData?.notifications || [];

  // Cart query - skip during SSR
  const { data: cartData, isLoading: isLoadingCart } = useGetCartProductsQuery(undefined, {
    skip: !mounted || !isUserLoggedIn,
  });

  // Cart state from Redux
  const cartState = useSelector((store: RootState) => store.cartSlice);

  // Search query - skip during SSR
  const { data: searchData, isFetching: isSearchFetching } = useGetApprovedProductsQuery(
    {
      name: searchQuery.trim(),
      limit: 5,
      page: 1,
    },
    {
      skip: !mounted || !searchQuery.trim() || searchQuery.trim().length < 2,
    },
  );

  // Calculate cart items count
  const cartItemsCount = (() => {
    if (!mounted) return 0; // Return 0 during SSR

    if (!isUserLoggedIn) {
      return cartState.itemCount || 0;
    }

    if (cartData?.data?.items) {
      return cartData.data.items.reduce((total: number, item: any) => {
        return total + (item.quantity || 1);
      }, 0);
    }

    return cartState.itemCount || 0;
  })();

  // Update search results
  useEffect(() => {
    if (!mounted) return;

    if (searchQuery.trim().length >= 2 && searchData?.products) {
      setSearchResults(searchData.products);
      setIsSearching(false);
    } else if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchData, searchQuery, mounted]);

  // Set searching state
  useEffect(() => {
    if (!mounted) return;

    if (searchQuery.trim().length >= 2 && isSearchFetching) {
      setIsSearching(true);
    }
  }, [isSearchFetching, searchQuery, mounted]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target) &&
        showNotifications
      ) {
        setShowNotifications(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(target) &&
        !target.closest(".search-result-item")
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  // Close sidebar
  const closeSidebar = () => {
    dispatch(openMobileMenu());
    setShowNotifications(false);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  // Search handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim().length >= 2) {
      setIsSearching(true);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`);
      closeSidebar();
    }
  };

  const handleResultClick = (productId: string) => {
    router.push(`/products/${productId}`);
    closeSidebar();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // Notification handlers
  const handleMarkAsRead = async (notificationId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await markAsRead(notificationId).unwrap();
      refetchUnreadCount();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNotification(notificationId).unwrap();
      refetchUnreadCount();
      refetchNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (notifications.length === 0 || unreadNotifications === 0) return;

    try {
      await markAllAsRead().unwrap();
      refetchUnreadCount();
      refetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleNotificationClick = (notification: any) => {
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
        } else if (user?.role === "stylist") {
          router.push("/products/my-products");
        } else if (user?.role === "admin") {
          router.push("/admin/products");
        }
        break;

      case "message_received":
        router.push("/chats");
        break;

      case "stylist_verification_request":
        if (user?.role === "admin") {
          router.push("/admin/stylists");
        }
        break;

      case "stylist_approved":
      case "stylist_rejected":
      case "stylist_suspended":
      case "stylist_activated":
        if (user?.role === "stylist") {
          router.push("/stylist/profile");
        } else if (user?.role === "admin") {
          router.push("/admin/stylists");
        }
        break;

      case "credit_wallet":
      case "debit_wallet":
        router.push("/wallet");
        break;

      default:
        break;
    }

    closeSidebar();
  };

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
      default:
        return "📢";
    }
  };

  const formatTime = (dateString: string) => {
    if (!mounted) return ""; // Return empty during SSR
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Just now";
    }
  };

  // During SSR and initial hydration, render a minimal placeholder
  if (!mounted) {
    return (
      <div className="fixed inset-0 opacity-0 invisible bg-[#000000b8] backdrop-blur-[1px] z-50">
        <div className="transform translate-x-[-100%] bg-white z-50 w-[85%] sm:w-[75%] md:w-[65%] h-[100vh] relative overflow-y-auto">
          <div className="pt-16 px-6">
            <div className="mb-6">
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      onClick={closeSidebar}
      className={`fixed inset-0 transition-all duration-300 ${
        isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
      } bg-[#000000b8] backdrop-blur-[1px] z-50`}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`transform transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-[-100%]"
        } bg-white z-50 w-[85%] sm:w-[75%] md:w-[65%] h-[100vh] relative overflow-y-auto`}>
        {/* Close Button */}
        <button
          title="close slide-over menu"
          onClick={closeSidebar}
          className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors">
          <GrClose fontSize={20} className="text-gray-600" />
        </button>

        {/* User Profile Section */}
        <div className="pt-16 px-6">
          {isUserLoggedIn ? (
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <FaUserAlt className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {user?.firstName} {user?.surname}
                </h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
                {user?.role === "stylist" && (
                  <span className="text-xs text-purple-600 flex items-center mt-1">
                    <FaUserTie className="mr-1" /> Stylist Account
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <Link
                href="/login"
                onClick={closeSidebar}
                className="block w-full py-3 px-4 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Login / Register
              </Link>
            </div>
          )}
        </div>

        {/* Quick Access Icons */}
        <div className="flex justify-around px-6 py-5 border-t border-b border-gray-100 bg-gray-50">
          <Link href="/account" onClick={closeSidebar} className="flex flex-col items-center group">
            <div className="p-2 rounded-full group-hover:bg-blue-100 transition-colors">
              <FaUserAlt className="text-xl text-blue-600" />
            </div>
            <span className="text-xs mt-1 text-gray-600">Account</span>
          </Link>

          <Link
            href={isUserLoggedIn ? "/chats" : "/login?redirect=/chats"}
            onClick={closeSidebar}
            className="flex flex-col items-center group relative">
            <div className="p-2 rounded-full group-hover:bg-blue-100 transition-colors">
              <IoLogoWechat className="text-xl text-blue-600" />
            </div>
            <span className="text-xs mt-1 text-gray-600">Chats</span>
            {isUserLoggedIn && unreadMessages > 0 && (
              <span className="absolute top-0 right-2 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </Link>

          <div ref={notificationRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex flex-col items-center group relative">
              <div className="p-2 rounded-full group-hover:bg-blue-100 transition-colors">
                <BsBellFill
                  className={`text-xl ${unreadNotifications > 0 ? "text-yellow-500" : "text-blue-600"}`}
                />
              </div>
              <span className="text-xs mt-1 text-gray-600">Notifications</span>
              {isUserLoggedIn && unreadNotifications > 0 && (
                <span className="absolute top-0 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotifications > 9 ? "9+" : unreadNotifications}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isUserLoggedIn && showNotifications && (
              <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200 max-h-96 overflow-y-auto">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  {notifications.length > 0 && unreadNotifications > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                      Mark all as read
                    </button>
                  )}
                </div>

                {isLoadingNotifications ? (
                  <div className="px-4 py-6 flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification: any) => (
                      <div
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 group ${
                          !notification.read ? "bg-blue-50" : ""
                        }`}>
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3 flex-1">
                            <span className="text-lg mt-0.5 flex-shrink-0">
                              {getNotificationIcon(notification.type)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium ${
                                  !notification.read ? "text-gray-900" : "text-gray-700"
                                }`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatTime(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.read && (
                              <button
                                onClick={(e) => handleMarkAsRead(notification._id, e)}
                                className="text-gray-400 hover:text-green-600 p-1"
                                title="Mark as read">
                                <BsCheck size={14} />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDeleteNotification(notification._id, e)}
                              className="text-gray-400 hover:text-red-600 p-1"
                              title="Delete">
                              <BsX size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    <p>No notifications yet</p>
                    <p className="text-sm mt-1">You're all caught up!</p>
                  </div>
                )}
                {notifications.length > 0 && (
                  <div className="px-4 py-2 border-t border-gray-200 text-center bg-gray-50 rounded-b-lg">
                    <Link
                      href="/notifications"
                      className="text-sm text-blue-600 hover:underline font-medium"
                      onClick={closeSidebar}>
                      View All Notifications
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <Link
            href={
              isUserLoggedIn
                ? user?.role === "stylist" || user?.role === "admin"
                  ? "/orders"
                  : "/cart"
                : "/cart"
            }
            onClick={closeSidebar}
            className="flex flex-col items-center group relative">
            <div className="p-2 rounded-full group-hover:bg-blue-100 transition-colors">
              {isUserLoggedIn && (user?.role === "stylist" || user?.role === "admin") ? (
                <BsBoxSeam className="text-xl text-blue-600" />
              ) : (
                <BsCart4 className="text-xl text-blue-600" />
              )}
            </div>
            <span className="text-xs mt-1 text-gray-600">
              {isUserLoggedIn && (user?.role === "stylist" || user?.role === "admin")
                ? "Orders"
                : "Cart"}
            </span>
            {!isUserLoggedIn || (user?.role !== "stylist" && user?.role !== "admin")
              ? cartItemsCount > 0 && (
                  <span className="absolute top-0 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cartItemsCount > 9 ? "9+" : cartItemsCount}
                  </span>
                )
              : null}
          </Link>
        </div>

        {/* Main Menu */}
        <div className="px-6 py-5">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Menu</h3>
            <div className="space-y-3">
              <Link
                onClick={closeSidebar}
                className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 font-medium transition-colors"
                href="/">
                <span className="flex items-center gap-3">
                  <FaHome size={18} className="text-blue-600" /> Home
                </span>
              </Link>
              <Link
                onClick={closeSidebar}
                className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 font-medium transition-colors"
                href="/products">
                Shop
              </Link>
              <Link
                onClick={closeSidebar}
                className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 font-medium transition-colors"
                href="/stylists">
                Stylists
              </Link>
              {isUserLoggedIn && user?.role === "stylist" && (
                <Link
                  onClick={closeSidebar}
                  className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 font-medium transition-colors"
                  href="/dashboard">
                  <span className="flex items-center gap-3">
                    <FaUserTie className="text-purple-600" size={18} /> Stylist Dashboard
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Account Section */}
          {isUserLoggedIn && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">My Account</h3>
              <div className="space-y-3">
                <Link
                  onClick={closeSidebar}
                  className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 font-medium transition-colors"
                  href="/account">
                  Profile
                </Link>
                {user?.role !== "stylist" && user?.role !== "admin" && (
                  <>
                    <Link
                      onClick={closeSidebar}
                      className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 font-medium transition-colors"
                      href="/account/orders">
                      <span className="flex items-center gap-3">
                        <BsBoxSeam size={18} /> My Orders
                      </span>
                    </Link>
                    <Link
                      onClick={closeSidebar}
                      className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 font-medium transition-colors"
                      href="/account/wishlist">
                      <span className="flex items-center gap-3">
                        <BsHeart size={18} /> Wishlist
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Search Section */}
          <div className="mb-6" ref={searchRef}>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Search</h3>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery.trim().length >= 2 && setShowSearchResults(true)}
                  className="flex-1 px-4 py-2.5 text-sm outline-none bg-gray-50"
                  placeholder="Search products..."
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="px-2 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <BsX className="text-gray-500 hover:text-gray-700" size={18} />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <BsSearch className="text-gray-600" size={18} />
                </button>
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && searchQuery.trim().length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200 max-h-80 overflow-y-auto">
                  <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-800">
                      {isSearching ? "Searching..." : "Search Results"}
                    </h3>
                  </div>

                  {isSearching ? (
                    <div className="px-4 py-6 flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div>
                      {searchResults.slice(0, 5).map((product: any) => {
                        const productId = product.id || product._id;
                        const productName = product.name || product.title || "Unnamed Product";
                        const productPrice = product.price || product.priceInCents / 100 || 0;
                        const productImage =
                          product.mainImage || product.image || product.images?.[0];
                        const productCategory = product.category || product.type || "Uncategorized";

                        return (
                          <button
                            key={productId}
                            onClick={() => handleResultClick(productId)}
                            className="w-full px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center gap-3 text-left search-result-item">
                            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded overflow-hidden">
                              {productImage ? (
                                <img
                                  src={productImage}
                                  alt={productName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <BsBoxSeam size={16} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {productName}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {productCategory} • ₦{productPrice?.toLocaleString()}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                      {searchResults.length > 5 && (
                        <div className="px-4 py-2 border-t border-gray-200 text-center bg-gray-50">
                          <button
                            onClick={handleSearchSubmit}
                            className="text-sm text-blue-600 hover:underline font-medium">
                            View all results ({searchResults.length})
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center text-gray-500">
                      <p>No products found for "{searchQuery}"</p>
                      <p className="text-sm mt-1">Try different keywords</p>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
