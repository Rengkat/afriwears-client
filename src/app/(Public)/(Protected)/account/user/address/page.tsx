"use client";
import { FiEdit, FiPlus, FiMapPin, FiPhone } from "react-icons/fi";
import Link from "next/link";
import {
  useGetAddressesQuery,
  useGetCurrentUserDetailsQuery,
  useUpdateCurrentUserMutation,
} from "@/redux/services/UserApiSlice";
import AddressCard from "./AddressCard";

const AddressPage = () => {
  const { data, isLoading, refetch } = useGetCurrentUserDetailsQuery();
  const { data: addresses } = useGetAddressesQuery();
  const user = data?.data;
  // Calculate if user has addresses to show the "Add Another Address" section
  const addressList = addresses?.addresses ?? [];
  const hasAddresses = addressList.length > 0;
  const canAddMoreAddresses = hasAddresses;
  // console.log(user, hasAddresses, addresses);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FiMapPin className="text-amber-500" />
          Delivery Address
        </h1>
        <p className="text-gray-600 mt-1">Manage your shipping addresses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Address Card */}
        <AddressCard user={user} hasAddresses={hasAddresses} />
        {/* Additional Address Slot - Fixed the condition */}
        {canAddMoreAddresses && (
          <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-8 text-center min-h-[300px] hover:border-amber-400 transition-colors">
            <div className="mx-auto h-16 w-16 text-gray-300 mb-4">
              <FiPlus className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Add Another Address</h3>
            <p className="text-gray-500 mb-4 max-w-xs">
              Save multiple addresses for faster checkout
            </p>
            <Link
              href="/account/user/address/add-address"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700">
              <FiPlus className="mr-2" />
              Add New Address
            </Link>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-amber-50 rounded-xl p-6">
        <h3 className="font-medium text-gray-900 mb-3">Need help with your address?</h3>
        <p className="text-gray-600 mb-4">
          Make sure your delivery address is accurate and includes any important details like
          building names, landmarks, or delivery instructions.
        </p>
        <button className="text-amber-600 hover:text-amber-700 font-medium">
          Contact support for help
        </button>
      </div>
    </div>
  );
};

export default AddressPage;
