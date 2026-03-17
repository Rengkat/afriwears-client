"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BsBoxSeam, BsHeart } from "react-icons/bs";
import { MdKeyboardArrowDown } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { openProfileDropdown } from "@/redux/features/appSlice";
import { RootState } from "@/redux/Store";
import { useGetCurrentUserQuery, useLogoutMutation } from "@/redux/services/AuthApiSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { isProfileOpen } = useSelector((state: any) => state.shopReducer);
  const { user: localUser, isAuthenticated } = useSelector((state: RootState) => state.authSlice);

  const { data } = useGetCurrentUserQuery(undefined, {
    skip: !mounted || !localUser,
  });

  // Prefer fresh server data, fall back to localStorage
  const user = data?.user || localUser;

  const [logout] = useLogoutMutation();

  const handleLogOut = async () => {
    await logout(undefined).unwrap();
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="relative">
      <div
        onClick={() => dispatch(openProfileDropdown())}
        className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-full p-2 transition-colors">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <CiUser className="text-blue-600 text-lg" />
        </div>
        {isAuthenticated && user && (
          <p className="font-medium text-sm hidden md:block">{user?.firstName}</p>
        )}
        <MdKeyboardArrowDown
          className={`text-gray-500 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
          size={18}
        />
      </div>

      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
          {!isAuthenticated ? (
            <div className="px-4 py-3">
              <Link href="/login">
                <button className="w-full bg-blue-500 text-white font-medium rounded-md py-2 px-3 hover:bg-blue-600 transition-colors">
                  Login
                </button>
              </Link>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">
                  {user?.firstName} {user?.surname}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link href="/account">
                  <div className="flex gap-3 items-center px-4 py-2 hover:bg-blue-50 text-gray-700 transition-colors">
                    <CiUser size={16} />
                    <span className="text-sm">My Account</span>
                  </div>
                </Link>
                {user?.role === "user" && (
                  <>
                    <Link href="/account/user/orders">
                      <div className="flex gap-3 items-center px-4 py-2 hover:bg-blue-50 text-gray-700 transition-colors">
                        <BsBoxSeam size={16} />
                        <span className="text-sm">Orders</span>
                      </div>
                    </Link>
                    <Link href="/account/user/wishlist">
                      <div className="flex gap-3 items-center px-4 py-2 hover:bg-blue-50 text-gray-700 transition-colors">
                        <BsHeart size={16} />
                        <span className="text-sm">Wishlist</span>
                      </div>
                    </Link>
                  </>
                )}
              </div>
              <div className="px-4 py-2 border-t border-gray-100">
                <button
                  onClick={handleLogOut}
                  className="w-full text-left text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-md transition-colors">
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
