"use client";
import React from "react";
import { GrClose } from "react-icons/gr";
import {
  BsSearch,
  BsCart4,
  BsBellFill,
  BsGeoAlt,
  BsPersonCheck,
  BsBoxSeam,
  BsHeart,
} from "react-icons/bs";
import { FaUserAlt, FaUserTie, FaStore } from "react-icons/fa";
import { IoLogoWechat } from "react-icons/io5";
import { HiMenu } from "react-icons/hi";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { openMobileMenu } from "@/redux/features/appSlice";

const MobileNav = () => {
  const dispatch = useDispatch();
  const { isMobileMenuOpen } = useSelector((state: any) => state.shopReducer);
  const authStatus = false;
  const cartProducts = [1, 4, 5];
  const user = {
    role: "user",
    addresses: [1, 3, 4],
    name: "Alex",
    email: "alex@gmail.com",
    isVerified: true,
    company: "Jos Entr",
  };
  const unreadNotifications = 3;

  return (
    <div
      className={`fixed inset-0 transition-all duration-300 ${
        isMobileMenuOpen ? "opacity-0 invisible" : "opacity-100 visible"
      } bg-[#000000b8] backdrop-blur-[1px] z-50`}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`transform transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-[-100%]" : "translate-x-0"
        } bg-white z-50 w-[85%] sm:w-[75%] md:w-[65%] h-[100vh] relative overflow-y-auto`}>
        {/* Close Button */}
        <button
          onClick={() => dispatch(openMobileMenu())}
          className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors">
          <GrClose fontSize={20} className="text-gray-600" />
        </button>

        {/* User Profile Section */}
        <div className="pt-16 px-6">
          {authStatus ? (
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <FaUserAlt className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
                {!user?.isVerified && (
                  <span className="text-xs text-yellow-600 flex items-center mt-1">
                    <BsPersonCheck className="mr-1" /> Account not verified
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <Link href="/login" className="btn btn-primary w-full py-3 rounded-lg font-medium">
                Login / Register
              </Link>
            </div>
          )}
        </div>

        {/* Quick Access Icons */}
        <div className="flex justify-around px-6 py-5 border-t border-b border-gray-100 bg-gray-50">
          <Link href="/account" className="flex flex-col items-center group">
            <div className="p-2 rounded-full group-hover:bg-blue-100 transition-colors">
              <FaUserAlt className="text-xl text-blue-600" />
            </div>
            <span className="text-xs mt-1 text-gray-600">Account</span>
          </Link>
          <Link href="/chats" className="flex flex-col items-center group relative">
            <div className="p-2 rounded-full group-hover:bg-blue-100 transition-colors">
              <IoLogoWechat className="text-xl text-blue-600" />
            </div>
            <span className="text-xs mt-1 text-gray-600">Chats</span>
          </Link>
          <button className="flex flex-col items-center group relative">
            <div className="p-2 rounded-full group-hover:bg-blue-100 transition-colors">
              <BsBellFill className="text-xl text-yellow-500" />
            </div>
            <span className="text-xs mt-1 text-gray-600">Notifications</span>
            {unreadNotifications > 0 && (
              <span className="absolute top-0 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>
          <Link href="/cart" className="flex flex-col items-center group relative">
            <div className="p-2 rounded-full group-hover:bg-blue-100 transition-colors">
              <BsCart4 className="text-xl text-blue-600" />
            </div>
            <span className="text-xs mt-1 text-gray-600">Cart</span>
            {authStatus && cartProducts?.length > 0 && (
              <span className="absolute top-0 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {cartProducts.length}
              </span>
            )}
          </Link>
        </div>

        {/* Main Menu */}
        <div className="px-6 py-5">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Menu</h3>
            <div className="space-y-3">
              <Link
                className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 font-medium transition-colors"
                href="/">
                Home
              </Link>
              <Link
                className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 font-medium transition-colors"
                href="/products">
                Shop
              </Link>
              <Link
                className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 font-medium transition-colors"
                href="/stylists">
                Stylists
              </Link>
              {authStatus && user?.role === "stylist" && (
                <Link
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
          {authStatus && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">My Account</h3>
              <div className="space-y-3">
                <Link
                  className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 font-medium transition-colors"
                  href="/account">
                  Profile
                </Link>
                {!user?.company && (
                  <>
                    <Link
                      className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 font-medium transition-colors"
                      href="/account/orders">
                      <span className="flex items-center gap-3">
                        <BsBoxSeam size={18} /> My Orders
                      </span>
                    </Link>
                    <Link
                      className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 font-medium transition-colors"
                      href="/account/wishlist">
                      <span className="flex items-center gap-3">
                        <BsHeart size={18} /> Wishlist
                      </span>
                    </Link>
                  </>
                )}
                {!user?.isVerified && (
                  <Link
                    className="block py-2.5 px-4 hover:bg-yellow-50 rounded-lg text-yellow-600 font-medium transition-colors"
                    href="/verify-account">
                    <span className="flex items-center gap-3">
                      <BsPersonCheck size={18} /> Verify Account
                    </span>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Search</h3>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200">
              <input
                type="text"
                className="flex-1 px-4 py-2.5 text-sm outline-none bg-gray-50"
                placeholder="Search products..."
              />
              <button className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors">
                <BsSearch className="text-gray-600" size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
