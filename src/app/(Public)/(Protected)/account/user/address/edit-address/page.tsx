"use client";
import Link from "next/link";
import React, { useState } from "react";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { FiMapPin, FiTrash2, FiCheck, FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import {
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useGetCurrentUserDetailsQuery,
  useSetDefaultAddressMutation,
} from "@/redux/services/UserApiSlice";

const Edit = () => {
  const { data, refetch } = useGetCurrentUserDetailsQuery();
  const { data: addressData, isLoading } = useGetAddressesQuery();
  const [setDefault] = useSetDefaultAddressMutation();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();
  const addressList = addressData?.addresses ?? [];
  const router = useRouter();
  const user = data?.data || {
    firstName: "",
    surname: "",
    phone: "",
    addresses: [],
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefault({ id }).unwrap();
      toast.success("Default address updated successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to update default address");
      console.error("Update default address error:", error);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddress({ id }).unwrap();
      toast.success("Address deleted successfully");
    } catch (error) {
      toast.error("Failed to delete address");
      console.error("Delete address error:", error);
    }
  };

  const handleSaveSelection = () => {
    router.push("/account/user/address");
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">Loading addresses...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/account/user/address"
            className="text-amber-600 hover:text-amber-700 transition-colors">
            <IoChevronBackCircleSharp fontSize={28} />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FiMapPin className="text-amber-500" />
            Select Delivery Address
          </h1>
        </div>
        <p className="text-gray-600 ml-10">
          Choose your preferred delivery address from saved addresses
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Saved Addresses</h2>
            <Link
              href="/account/user/address/add-address"
              className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium text-sm">
              <FiPlus size={16} />
              Add new address
            </Link>
          </div>

          <div className="space-y-4">
            {addressList.length > 0 ? (
              addressList.map((address) => (
                <div
                  key={address._id}
                  className={`p-4 border rounded-lg transition-colors ${
                    address?.isDefault
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {user.firstName} {user.surname}
                      </h3>
                      <p className="text-gray-600">{address.homeAddress}</p>
                      {address.homeAddress2 && (
                        <p className="text-gray-600">{address.homeAddress2}</p>
                      )}
                      <p className="text-gray-600">
                        {address.street}, {address.city}
                      </p>
                      <p className="text-gray-600">
                        {address.state}, {address.country}, {address.postalCode}
                      </p>
                      {/* <p className="text-gray-600 mt-2">{user.phone}</p> */}
                    </div>

                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <button
                        onClick={() => handleSetDefault(address._id)}
                        className={`p-2 rounded-full ${
                          address?.isDefault
                            ? "text-amber-600 bg-amber-100"
                            : "text-gray-400 hover:text-amber-600 hover:bg-amber-50"
                        }`}
                        title="Set as default">
                        <FiCheck size={18} />
                      </button>

                      <button
                        onClick={() => handleDeleteAddress(address._id)}
                        className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete address"
                        disabled={isDeleting}>
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {address?.isDefault && (
                    <div className="mt-3 flex items-center text-amber-600 text-sm">
                      <FiCheck className="mr-1" />
                      <span>Default delivery address</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You don't have any saved addresses yet</p>
                <Link
                  href="/account/user/address/add-address"
                  className="flex items-center gap-1 mx-auto text-amber-600 hover:text-amber-700 font-medium">
                  <FiPlus size={16} />
                  Add your first address
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {addressList.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleSaveSelection}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-sm transition-colors">
            Save Selection
          </button>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 bg-amber-50 rounded-xl p-6">
        <h3 className="font-medium text-gray-900 mb-3">Delivery Information</h3>
        <p className="text-gray-600 mb-4">
          Your selected address will be used as the default shipping address for all orders. You can
          change it anytime before checkout.
        </p>
        <button className="text-amber-600 hover:text-amber-700 font-medium">
          Contact support for help
        </button>
      </div>
    </div>
  );
};

export default Edit;
