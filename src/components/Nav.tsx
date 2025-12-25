"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BsSearch, BsCart, BsChatDots, BsBellFill, BsBoxSeam } from "react-icons/bs";
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

const NavBar = () => {
  const { data: userData, isLoading: isLoadingUser } = useGetCurrentUserQuery(null);
  const {
    data: cartData,
    isLoading: isLoadingCart,
    refetch: refetchCart,
  } = useGetCartProductsQuery();
  const { user: localUser } = useSelector((store: RootState) => store.authSlice);
  const cartState = useSelector((store: RootState) => store.cartSlice);
  const dispatch = useDispatch();

  const user = userData?.user || localUser;
  const [isClient, setIsClient] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Use Redux cart state for immediate updates, fallback to API data
  const cartItemsCount =
    cartState.itemCount ||
    cartData?.cart?.items?.reduce((total, item) => total + item.quantity, 0) ||
    0;

  // For stylist/admin orders count
  const ordersCount = 3;

  useEffect(() => {
    setIsClient(true);
    setUnreadNotifications(3);

    // Refetch cart data when component mounts
    if (user) {
      refetchCart();
    }
  }, [user, refetchCart]);

  // Listen for cart updates and refetch if cart was updated more than 10 seconds ago
  useEffect(() => {
    if (!user) return;

    const checkCartUpdate = () => {
      const timeSinceLastUpdate = Date.now() - cartState.lastUpdated;
      if (timeSinceLastUpdate > 10000) {
        // 10 seconds
        refetchCart();
      }
    };

    const intervalId = setInterval(checkCartUpdate, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [user, refetchCart, cartState.lastUpdated]);

  if (!isClient || isLoadingUser) {
    return <NaveBarSkeleton />;
  }

  const authStatus = !!user;

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
        <div className="hidden md:flex items-center border border-gray-200 rounded-lg overflow-hidden hover:border-blue-400 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200">
          <input
            type="text"
            className="w-40 lg:w-64 px-4 py-2 text-sm outline-none bg-gray-50"
            placeholder="Search products..."
          />
          <button
            title="search"
            className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors">
            <BsSearch className="text-gray-600 hover:text-blue-500" size={18} />
          </button>
        </div>

        {/* Icons */}
        <div className="hidden md:flex items-center gap-4 md:gap-5">
          {/* Notification Bell */}
          {authStatus && (
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                <BsBellFill
                  size={20}
                  className={unreadNotifications > 0 ? "text-yellow-500" : "text-gray-600"}
                />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">
                        Your order #1234 has been shipped
                      </p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">
                        New stylist available in your area
                      </p>
                      <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-blue-50 cursor-pointer">
                      <p className="text-sm font-medium text-gray-800">
                        Special discount on summer collection
                      </p>
                      <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200 text-center bg-gray-50 rounded-b-lg">
                    <Link
                      href="/notifications"
                      className="text-sm text-blue-600 hover:underline font-medium">
                      View All Notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chat Icon */}
          <Link
            href="/chats"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
            <BsChatDots size={20} className="text-gray-600 hover:text-blue-500" />
          </Link>

          {/* Cart/Orders Icon */}
          {authStatus ? (
            <>
              {user?.role === "stylist" || user?.role === "admin" ? (
                <Link
                  href="/orders"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group">
                  <BsBoxSeam size={20} className="text-gray-600 hover:text-blue-500" />
                  {ordersCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1">
                      {ordersCount > 9 ? "9+" : ordersCount}
                    </span>
                  )}
                  <div className="absolute -bottom-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    View Orders
                  </div>
                </Link>
              ) : (
                <Link
                  href="/cart"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group">
                  {isLoadingCart ? (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin"></div>
                  ) : (
                    <>
                      <BsCart size={20} className="text-gray-600 hover:text-blue-500" />
                      {cartItemsCount > 0 && (
                        <span
                          key={cartState.lastUpdated} // Force re-animation on update
                          className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1 animate-pulse transition-all duration-300">
                          {cartItemsCount > 9 ? "9+" : cartItemsCount}
                        </span>
                      )}
                      <div className="absolute -bottom-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group">
              <BsCart size={20} className="text-gray-600 hover:text-blue-500" />
              <div className="absolute -bottom-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                View Cart
              </div>
            </Link>
          )}

          {/* Profile Component */}
          <Profile />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => dispatch(openMobileMenu())}
          className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors">
          <HiMenu size={24} className="text-gray-600" />
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
