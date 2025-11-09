import Link from "next/link";
import React from "react";
import { FiEdit, FiMapPin, FiPlus } from "react-icons/fi";

const AddressCard = ({ user, hasAddresses }: any) => {
  console.log("AddressCard Rendered", { user, hasAddresses });
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">Default Shipping Address</h2>
      </div>

      <div className="p-6">
        {hasAddresses ? (
          <>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">
                  {user?.firstName} {user?.surname}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-900">{user?.fullAddress}</p>
              </div>
              {/* <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-900">{user?.phone}</p>
              </div> */}
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
  );
};

export default AddressCard;
