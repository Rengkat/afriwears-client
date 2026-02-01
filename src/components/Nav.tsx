"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { BsSearch, BsCart, BsChatDots, BsBellFill, BsBoxSeam, BsX, BsCheck } from "react-icons/bs";
import { FaHome } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import NavLink from "./NavLinks";
import { NaveBarSkeleton } from "./Skeleton";
import Profile from "./Profile";
import { useDispatch, useSelector } from "react-redux";
import { openMobileMenu } from "@/redux/features/appSlice";
import { RootState } from "@/redux/Store";
import { useGetCurrentUserQuery } from "@/redux/services/AuthApiSlice";
import { useGetCartProductsQuery } from "@/redux/services/CartApiSlice";
import { useGetApprovedProductsQuery } from "@/redux/services/ProductApi";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useSocket } from "@/redux/SocketContext";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from "@/redux/services/NotificationApiSlice";
import { useGetUnreadMessagesCountQuery } from "@/redux/services/MessageApiSlice";

const NavBar = () => {
  const { data: userData, isLoading: isLoadingUser } = useGetCurrentUserQuery(null);
  const { user: localUser } = useSelector((store: RootState) => store.authSlice);
  const cartState = useSelector((store: RootState) => store.cartSlice);
  const dispatch = useDispatch();
  const router = useRouter();
  const { socket } = useSocket();

  const user = userData?.user || localUser;
  const [showNotifications, setShowNotifications] = useState(false);

  // Check if user is authenticated
  const isUserLoggedIn = !!user;

  // Fetch notifications and unread counts
  const {
    data: unreadCountData,
    refetch: refetchUnreadCount,
    isError: unreadCountError,
  } = useGetUnreadCountQuery(undefined, {
    skip: !isUserLoggedIn,
  });

  const {
    data: unreadMessagesData,
    refetch: refetchUnreadMessages,
    isError: unreadMessagesError,
  } = useGetUnreadMessagesCountQuery(undefined, {
    skip: !isUserLoggedIn,
  });

  const {
    data: notificationsData,
    isLoading: isLoadingNotifications,
    refetch: refetchNotifications,
    isError: notificationsError,
  } = useGetNotificationsQuery(
    { page: 1, limit: 5 },
    {
      skip: !isUserLoggedIn,
    },
  );

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const unreadNotifications = unreadCountError ? 0 : unreadCountData?.count || 0;
  const unreadMessages = unreadMessagesError ? 0 : unreadMessagesData?.count || 0;
  const notifications = notificationsError ? [] : notificationsData?.notifications || [];

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Cart query
  const { data: cartData, isLoading: isLoadingCart } = useGetCartProductsQuery(undefined, {
    skip: !isUserLoggedIn,
  });

  // Search query
  const { data: searchData, isFetching: isSearchFetching } = useGetApprovedProductsQuery(
    {
      name: searchQuery.trim(),
      limit: 5,
      page: 1,
    },
    {
      skip: !searchQuery.trim() || searchQuery.trim().length < 2,
    },
  );

  // Calculate cart items count
  const cartItemsCount = useMemo(() => {
    if (!isUserLoggedIn) {
      return cartState.itemCount || 0;
    }

    if (cartData?.data?.items) {
      return cartData.data.items.reduce((total: number, item: any) => {
        return total + (item.quantity || 1);
      }, 0);
    }

    return cartState.itemCount || 0;
  }, [isUserLoggedIn, cartData, cartState.itemCount]);

  // Socket listener for unread message count updates
  useEffect(() => {
    if (!socket || !isUserLoggedIn) {
      return;
    }

    const handleUnreadCountUpdate = (data: { count: number }) => {
      refetchUnreadMessages();
    };

    socket.on("unreadCountUpdate", handleUnreadCountUpdate);

    return () => {
      socket.off("unreadCountUpdate", handleUnreadCountUpdate);
    };
  }, [socket, isUserLoggedIn, refetchUnreadMessages]);

  // Socket listener for notifications
  useEffect(() => {
    if (!socket || !isUserLoggedIn) {
      return;
    }

    const handleNewNotification = (notification: any) => {
      console.log("🔔 REAL-TIME NOTIFICATION RECEIVED:", {
        type: notification.type,
        message: notification.message,
        timestamp: new Date().toISOString(),
      });

      refetchNotifications();
      refetchUnreadCount();
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket, isUserLoggedIn, refetchNotifications, refetchUnreadCount]);

  // Update search results
  useEffect(() => {
    if (searchQuery.trim().length >= 2 && searchData?.products) {
      setSearchResults(searchData.products);
      setIsSearching(false);
    } else if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchData, searchQuery]);

  // Set searching state
  useEffect(() => {
    if (searchQuery.trim().length >= 2 && isSearchFetching) {
      setIsSearching(true);
    }
  }, [isSearchFetching, searchQuery]);

  // Notification handlers
  const handleBellClickNotLoggedIn = () => {
    router.push("/login?redirect=/notifications");
    setShowNotifications(false);
  };

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

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      handleMarkAsRead(notification._id);
    }

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

    setShowNotifications(false);
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
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Just now";
    }
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
      setShowSearchResults(false);
      setShowMobileSearch(false);
      setSearchQuery("");
    }
  };

  const handleResultClick = (productId: string) => {
    router.push(`/products/${productId}`);
    setShowSearchResults(false);
    setShowMobileSearch(false);
    setSearchQuery("");
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleCloseMobileSearch = () => {
    setShowMobileSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleMobileSearchToggle = () => {
    setShowMobileSearch(!showMobileSearch);
    if (!showMobileSearch) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target) &&
        !target.closest(".search-result-item")
      ) {
        setShowSearchResults(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target) &&
        showNotifications
      ) {
        setShowNotifications(false);
      }

      if (
        showMobileSearch &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(target)
      ) {
        if (!target.closest('[aria-label="Search"]')) {
          handleCloseMobileSearch();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications, showMobileSearch]);

  if (isLoadingUser) {
    return <NaveBarSkeleton />;
  }
  return (
    <nav className="w-full px-6 lg:px-12 py-3 flex justify-between items-center shadow-sm bg-white sticky top-0 z-50 border-b border-gray-100">
      {/* Logo Section */}
      <header className="text-2xl font-bold">
        <NavLink href="/">
          <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
            <FaHome size={28} className="text-blue-600" />
            <span className="font-bold text-xl">Afriwears</span>
          </div>
        </NavLink>
      </header>

      {/* Navigation Links */}
      <div className="hidden xl:flex gap-10 text-base font-semibold items-center">
        <NavLink href="/">HOME</NavLink>
        <NavLink href="/products">SHOP</NavLink>
        <NavLink href="/stylists">STYLISTS</NavLink>
      </div>

      {/* Right Side Icons and Search */}
      <div className="flex items-center gap-5 md:gap-7">
        {/* Search Bar - Desktop */}
        <div ref={searchContainerRef} className="hidden md:block relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden hover:border-blue-400 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.trim().length >= 2 && setShowSearchResults(true)}
                className="w-40 lg:w-64 px-4 py-2 text-sm outline-none bg-gray-50"
                placeholder="Search products..."
                aria-label="Search products"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-2 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
                  aria-label="Clear search">
                  <BsX className="text-gray-500 hover:text-gray-700" size={18} />
                </button>
              )}
              <button
                type="submit"
                title="search"
                className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                <BsSearch className="text-gray-600 hover:text-blue-500" size={18} />
              </button>
            </div>
          </form>

          {/* Search Results Dropdown */}
          {showSearchResults && searchQuery.trim().length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200 max-h-80 overflow-y-auto">
              <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-800">
                  {isSearching ? "Searching..." : "Search Results"}
                </h3>
                {!isSearching && searchResults.length > 0 && (
                  <p className="text-xs text-gray-500">
                    {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} found
                  </p>
                )}
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
                    const productImage = product.mainImage || product.image || product.images?.[0];
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
        </div>

        {/* Mobile Search Button */}
        <div className="md:hidden relative">
          <button
            onClick={handleMobileSearchToggle}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Search">
            <BsSearch size={20} className="text-gray-600 hover:text-blue-500" />
          </button>

          {/* Mobile Search Overlay */}
          {showMobileSearch && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 px-4">
              <div ref={mobileSearchRef} className="w-full max-w-md bg-white rounded-lg shadow-xl">
                <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                  <div className="flex-1 relative">
                    <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="mobile-search-input"
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Search products..."
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        title="Clear search"
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <BsX size={20} />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseMobileSearch}
                    className="mobile-search-close px-4 py-2 text-gray-600 hover:text-gray-800">
                    Cancel
                  </button>
                </div>

                {/* Mobile Search Results */}
                <div className="max-h-96 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-6 flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div>
                      {searchResults.map((product) => {
                        const productId = product.id || product._id;
                        const productName = product.name || product.title || "Unnamed Product";
                        const productPrice = product.price || product.priceInCents / 100 || 0;
                        const productImage =
                          product.mainImage || product.image || product.images?.[0];

                        return (
                          <button
                            key={productId}
                            onClick={() => handleResultClick(productId)}
                            className="w-full px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 flex items-center gap-3">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded overflow-hidden">
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
                            <div className="flex-1 text-left">
                              <p className="font-medium text-gray-800">{productName}</p>
                              <p className="text-sm text-gray-500">
                                ₦{productPrice?.toLocaleString()}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                      <div className="p-4 border-t border-gray-200 text-center bg-gray-50">
                        <button
                          onClick={handleSearchSubmit}
                          className="text-sm text-blue-600 hover:underline font-medium">
                          View all {searchResults.length} results
                        </button>
                      </div>
                    </div>
                  ) : searchQuery.trim().length >= 2 ? (
                    <div className="p-6 text-center text-gray-500">
                      <p>No products found for "{searchQuery}"</p>
                      <p className="text-sm mt-1">Try different keywords</p>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <p>Type at least 2 characters to search</p>
                      <p className="text-sm mt-2 text-gray-400">
                        Example: "Blue Agbada", "Traditional wear"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Icons */}
        <div className="hidden md:flex items-center gap-4 md:gap-5">
          {/* Notification Bell */}
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => {
                if (isUserLoggedIn) {
                  setShowNotifications(!showNotifications);
                } else {
                  handleBellClickNotLoggedIn();
                }
              }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group"
              aria-label="Notifications">
              <BsBellFill
                size={20}
                className={
                  isUserLoggedIn && unreadNotifications > 0 ? "text-yellow-500" : "text-gray-600"
                }
              />
              {/* Notification count badge */}
              {isUserLoggedIn && unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1">
                  {unreadNotifications > 9 ? "9+" : unreadNotifications}
                </span>
              )}
              {/* Tooltip for non-logged in users */}
              {!isUserLoggedIn && (
                <div className="absolute -bottom-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Login to see notifications
                </div>
              )}
            </button>

            {/* Notification Dropdown */}
            {isUserLoggedIn && showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200 max-h-96 overflow-y-auto">
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
                    {notifications.map((notification) => (
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
                      onClick={() => setShowNotifications(false)}>
                      View All Notifications
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Chat Icon */}
          <Link
            href={isUserLoggedIn ? "/chats" : "/login?redirect=/chats"}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group"
            aria-label="Chats">
            <BsChatDots
              size={20}
              className={
                isUserLoggedIn && unreadMessages > 0
                  ? "text-blue-500"
                  : "text-gray-600 hover:text-blue-500"
              }
            />

            {/* Unread messages badge */}
            {isUserLoggedIn && unreadMessages > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-blue-500 text-white text-xs flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1 animate-pulse">
                {unreadMessages > 9 ? "9+" : unreadMessages}
              </span>
            )}

            {/* Tooltip */}
            {!isUserLoggedIn ? (
              <div className="absolute -bottom-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                Login to access chats
              </div>
            ) : (
              <div className="absolute -bottom-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {unreadMessages === 0
                  ? "No unread messages"
                  : `${unreadMessages} unread message${unreadMessages !== 1 ? "s" : ""}`}
              </div>
            )}
          </Link>

          {/* Cart/Orders Icon */}
          {isUserLoggedIn ? (
            <>
              {user?.role === "stylist" || user?.role === "admin" ? (
                <Link
                  href="/orders"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group"
                  aria-label="Orders">
                  <BsBoxSeam size={20} className="text-gray-600 hover:text-blue-500" />
                  <div className="absolute -bottom-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    View Orders
                  </div>
                </Link>
              ) : (
                <Link
                  href="/cart"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group"
                  aria-label="Cart">
                  {isLoadingCart ? (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin"></div>
                  ) : (
                    <>
                      <BsCart size={20} className="text-gray-600 hover:text-blue-500" />
                      {cartItemsCount > 0 && (
                        <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1">
                          {cartItemsCount > 9 ? "9+" : cartItemsCount}
                        </span>
                      )}
                      <div className="absolute -bottom-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {cartItemsCount === 0
                          ? "Cart is empty"
                          : `${cartItemsCount} item${cartItemsCount !== 1 ? "s" : ""} in cart`}
                      </div>
                    </>
                  )}
                </Link>
              )}
            </>
          ) : (
            <Link
              href="/cart"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group"
              aria-label="Cart">
              <BsCart size={20} className="text-gray-600 hover:text-blue-500" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1">
                  {cartItemsCount > 9 ? "9+" : cartItemsCount}
                </span>
              )}
              <div className="absolute -bottom-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                View Cart
              </div>
            </Link>
          )}

          {/* Profile Component */}
          <Profile />
        </div>

        {/* Mobile Menu Button */}
        <button
          title="menu"
          onClick={() => dispatch(openMobileMenu())}
          className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Menu">
          <HiMenu size={24} className="text-gray-600" />
        </button>
      </div>
    </nav>
  );
};
export default NavBar;
