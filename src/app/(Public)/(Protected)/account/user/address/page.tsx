"use client";
import { FiEdit, FiPlus, FiMapPin, FiPhone } from "react-icons/fi";
import Link from "next/link";
import {
  useGetAddressesQuery,
  useGetCurrentUserDetailsQuery,
  useUpdateCurrentUserMutation,
} from "@/redux/services/UserApiSlice";

const AddressPage = () => {
  const { data, isLoading, refetch } = useGetCurrentUserDetailsQuery();
  const { data: addresses } = useGetAddressesQuery();
  // console.log(data);
  const user = data?.profile;
  // console.log(user);
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Default Shipping Address</h2>
          </div>

          <div className="p-6">
            {addresses?.addresses?.length > 0 ? (
              <>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-900">{user?.fullAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-900">{user?.phone}</p>
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  <Link
                    href="/account/user/address/edit-address"
                    className="inline-flex items-center p-2 border border-gray-300 rounded-full text-gray-400 hover:text-amber-600 hover:border-amber-600 transition-colors"
                    title="Edit address">
                    <FiEdit size={18} />
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto h-16 w-16 text-gray-300 mb-4">
                  <FiMapPin className="w-full h-full" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No address saved</h3>
                <p className="text-gray-500 mb-4">You haven't added a delivery address yet</p>
                <Link
                  href="/account/user/address/add-address"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700">
                  <FiPlus className="mr-2" />
                  Add Address
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Additional Address Slot */}
        {mockUser?.address.length >= 1 && (
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
