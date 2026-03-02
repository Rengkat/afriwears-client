"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMail, FiMapPin, FiCreditCard, FiBell, FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import {
  useGetCurrentUserDetailsQuery,
  useUpdateCurrentUserMutation,
} from "@/redux/services/UserApiSlice";
import FundWalletModal from "./FundWalletModal";

interface Address {
  homeAddress: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface User {
  id: string;
  firstName: string;
  surname: string;
  email: string;
  phone?: string;
  avatar?: string;
  walletAmount?: number;
  subscribedToNewsLetter?: boolean;
  defaultDeliveryAddress?: number;
  addresses?: Address[];
}

const AccountOverview = () => {
  const [showFundModal, setShowFundModal] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  const [subscribeNewsletter, { isLoading: subscribing }] = useUpdateCurrentUserMutation();
  const { user: localUser } = useSelector((store: RootState) => store.authSlice);
  const { data, isLoading, isError, error: userDetailsError } = useGetCurrentUserDetailsQuery();
  console.log(data);
  // Use API data if available, otherwise fall back to localUser
  const user: User | any = data?.profile || localUser;
  const handleSubscribe = async () => {
    try {
      setSubscribeError(null);
      const res = await subscribeNewsletter({ subscribedToNewsLetter: true }).unwrap();
    } catch (err: any) {
      console.error("Subscription failed:", err);
      setSubscribeError(
        err.data?.message || err.message || "Failed to subscribe. Please try again.",
      );
    }
  };
  const handleShowModel = () => {
    setShowFundModal((pre) => !pre);
  };
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    const errorMessage =
      (userDetailsError as any)?.data?.message || "Error loading account information";
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-600 mt-1">{errorMessage}</p>
          <p className="text-red-600 mt-2">
            Please try refreshing the page or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }

  // Get default address if available
  const defaultAddress = user.addresses?.[user.defaultDeliveryAddress || 0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-amber-500">
          <Image
            src={user?.avatar || "/avatar.jpg"}
            alt={`${user?.firstName} ${user?.surname}`}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome, {user?.firstName}!
          </h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Details Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              <FiMail className="text-amber-500" />
              Account Details
            </h2>
            <Link
              href="/account/user/edit-profile"
              className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1">
              <FiEdit className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">
                  {user?.firstName} {user?.surname}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
              {user?.phone && (
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-900">{user.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Address Book Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              <FiMapPin className="text-amber-500" />
              Address Book
            </h2>
          </div>
          <div className="p-6">
            {user?.addresses?.length > 0 ? (
              <div>
                <p className="text-sm text-gray-500 mb-2">Default Shipping Address</p>
                <p className="font-medium text-gray-900">{user?.fullAddress}</p>
                <Link
                  href="/account/user/address/edit-address"
                  className="mt-4 inline-block text-sm font-medium text-amber-600 hover:text-amber-700">
                  Edit Address
                </Link>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-4">You haven't added a delivery address yet</p>
                <Link
                  href="/account/user/address/add-address"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700">
                  Add Delivery Address
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Store Credit Card */}
        {/* Store Credit Card - Updated with Fund Wallet Button */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              <FiCreditCard className="text-amber-500" />
              Store Credit
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-amber-50 p-3 rounded-full">
                <Image
                  src="/wallet.png"
                  width={48}
                  height={48}
                  alt="Wallet"
                  className="w-8 h-8"
                  priority
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">Available Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{(user?.walletAmount || 0).toLocaleString()}.00
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/account/user/transactions"
                className="flex-1 text-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                View History
              </Link>
              <button
                onClick={handleShowModel}
                className="flex-1 text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700">
                Add Funds
              </button>
            </div>
          </div>
        </div>
        {/* model */}
        {showFundModal && <FundWalletModal onClose={() => setShowFundModal(false)} />}
        {/* Newsletter Preferences Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              <FiBell className="text-amber-500" />
              Newsletter Preferences
            </h2>
          </div>
          <div className="p-6">
            {subscribeError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">
                {subscribeError}
              </div>
            )}
            {user?.subscribedToNewsLetter ? (
              <div>
                <p className="text-gray-900 mb-2">You're subscribed to our newsletter!</p>
                <p className="text-sm text-gray-500">
                  Get the latest updates on new arrivals, promotions, and more.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-900 mb-2">Don't miss out on our updates!</p>
                <p className="text-sm text-gray-500 mb-4">
                  Subscribe to receive exclusive offers and fashion inspiration.
                </p>
                <button
                  onClick={handleSubscribe}
                  disabled={subscribing}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400">
                  {subscribing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subscribing...
                    </>
                  ) : (
                    "Subscribe to Newsletter"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
