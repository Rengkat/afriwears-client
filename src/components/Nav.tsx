"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { BsSearch, BsCart, BsChatDots, BsBellFill, BsBoxSeam, BsX } from "react-icons/bs";
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

const NavBar = () => {
  const { data: userData, isLoading: isLoadingUser } = useGetCurrentUserQuery(null);
  const { user: localUser } = useSelector((store: RootState) => store.authSlice);
  const cartState = useSelector((store: RootState) => store.cartSlice);
  const dispatch = useDispatch();
  const router = useRouter();

  const user = userData?.user || localUser;
  const [isClient, setIsClient] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false); // Separate state for mobile
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // CRITICAL FIX: Only fetch cart if user is logged in AND has token
  const isUserLoggedIn = !!user;
  const { data: cartData, isLoading: isLoadingCart } = useGetCartProductsQuery(undefined, {
    skip: !isUserLoggedIn,
    refetchOnMountOrArgChange: false,
  });

  // Fetch products for search
  const {
    data: searchData,
    isLoading: isLoadingSearch,
    isFetching,
  } = useGetApprovedProductsQuery(
    {
      name: searchQuery.trim(),
      limit: 5,
      page: 1,
    },
    {
      skip: !searchQuery.trim() || searchQuery.trim().length < 2,
    }
  );

  // Use Redux cart state for immediate updates
  const cartItemsCount = cartState.itemCount || 0;

  // For stylist/admin orders count
  const ordersCount = 3;

  useEffect(() => {
    setIsClient(true);
    setUnreadNotifications(3);
  }, []);

  // Update search results when data changes -
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      if (searchData?.products) {
        // Backend returns products directly
        setSearchResults(searchData.products);
        setShowSearchResults(true);
        setIsSearching(false);
      } else if (searchData?.data?.products) {
        // Or if it's nested in data property
        setSearchResults(searchData.data.products);
        setShowSearchResults(true);
        setIsSearching(false);
      } else if (searchData && searchQuery.trim().length >= 2) {
        // Data returned but no products property - means empty results
        setSearchResults([]);
        setShowSearchResults(true);
        setIsSearching(false);
      }
    } else if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      setIsSearching(false);
    }
  }, [searchData, searchQuery]);

  // Set searching state when fetching
  useEffect(() => {
    if (searchQuery.trim().length >= 2 && isFetching) {
      setIsSearching(true);
    }
  }, [isFetching, searchQuery]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim().length >= 2) {
      setIsSearching(true);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`);
      setShowSearchResults(false);
      setShowMobileSearch(false);
      setSearchQuery("");
      setIsSearching(false);
    }
  };

  // Handle clicking on a search result
  const handleResultClick = (productId: string) => {
    router.push(`/products/${productId}`);
    setShowSearchResults(false);
    setShowMobileSearch(false);
    setSearchQuery("");
    setIsSearching(false);
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
    setIsSearching(false);
    // Don't close mobile modal when clearing
  };

  // Close mobile search modal
  const handleCloseMobileSearch = () => {
    setShowMobileSearch(false);
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  // Toggle mobile search
  const handleMobileSearchToggle = () => {
    setShowMobileSearch(!showMobileSearch);
    if (!showMobileSearch) {
      setSearchQuery("");
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  // Close search results when clicking outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // For desktop search dropdown
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }

      // For mobile search overlay
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node) &&
        showMobileSearch
      ) {
        // Check if click is on the close/cancel button
        const target = event.target as HTMLElement;
        if (!target.closest(".mobile-search-close")) {
          handleCloseMobileSearch();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMobileSearch]);

  // Focus search input when mobile modal opens
  useEffect(() => {
    if (showMobileSearch) {
      setTimeout(() => {
        const input = document.getElementById("mobile-search-input");
        if (input) input.focus();
      }, 100);
    }
  }, [showMobileSearch]);

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
                    // console.log(product);
                    const productId = product.id || product._id;
                    const productName = product.name || product.title || "Unnamed Product";
                    const productPrice = product.price || product.priceInCents / 100 || 0;
                    const productImage = product.mainImage || product.image || product.images?.[0];
                    const productCategory = product.category || product.type || "Uncategorized";

                    return (
                      <button
                        key={productId}
                        onClick={() => handleResultClick(productId)}
                        className="w-full px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center gap-3 text-left">
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
            className="p-2 rounded-full hover:bg-gray-100 transition-colors">
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
                          key={cartState.lastUpdated}
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
          title="menu"
          onClick={() => dispatch(openMobileMenu())}
          className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors">
          <HiMenu size={24} className="text-gray-600" />
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
