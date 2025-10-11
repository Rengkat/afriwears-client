"use client";
import Link from "next/link";
import React, { useState } from "react";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { FiMapPin, FiHome, FiNavigation, FiMail, FiPackage } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useCreateAddressMutation } from "@/redux/services/UserApiSlice";
import toast from "react-hot-toast";
type AddressDetails = {
  country: string;
  state: string;
  city: string;
  street: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string;
  isDefault?: boolean;
};

const AddAddress = () => {
  const [addAddress, { isLoading }] = useCreateAddressMutation();
  const router = useRouter();

  const [address, setAddress] = useState<AddressDetails>({
    country: "",
    state: "",
    city: "",
    street: "",
    postalCode: "",
    addressLine1: "",
    addressLine2: "",
    isDefault: false,
  });

  const [errors, setErrors] = useState<Partial<AddressDetails>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof AddressDetails]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<AddressDetails> = {};
    if (!address.country.trim()) newErrors.country = "Country is required";
    if (!address.state.trim()) newErrors.state = "State is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.street.trim()) newErrors.street = "Street is required";
    if (!address.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    if (!address.addressLine1.trim()) newErrors.addressLine1 = "Address line is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      const addressData = {
        country: address.country,
        state: address.state,
        city: address.city,
        street: address.street,
        postalCode: address.postalCode,
        homeAddress: address.addressLine1,
        homeAddress2: address.addressLine2 || undefined,
        isDefault: address.isDefault,
      };

      await addAddress(addressData).unwrap();

      toast.success("Address added successfully!");
      router.push("/account/user/address");
    } catch (error: any) {
      console.error("Failed to save address:", error);
      const errorMessage = error.data?.message || "Failed to save address. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/account/user/address"
            className="text-amber-600 hover:text-amber-700 transition-colors">
            <IoChevronBackCircleSharp fontSize={28} />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FiMapPin className="text-amber-500" />
            Add New Address
          </h1>
        </div>
        <p className="text-gray-600 ml-10">Enter your complete shipping information</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="space-y-6">
              {/* Country and Postal Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
                    htmlFor="country">
                    <FiNavigation className="text-gray-400" />
                    Country*
                  </label>
                  <input
                    onChange={handleChange}
                    value={address.country}
                    type="text"
                    name="country"
                    id="country"
                    className={`w-full px-4 py-3 border ${
                      errors.country ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-amber-500 focus:border-amber-500 transition-colors`}
                    placeholder="Country"
                  />
                  {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
                    htmlFor="postalCode">
                    <FiMail className="text-gray-400" />
                    Postal Code*
                  </label>
                  <input
                    onChange={handleChange}
                    value={address.postalCode}
                    type="text"
                    name="postalCode"
                    id="postalCode"
                    className={`w-full px-4 py-3 border ${
                      errors.postalCode ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-amber-500 focus:border-amber-500 transition-colors`}
                    placeholder="Postal/Zip Code"
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
                  )}
                </div>
              </div>

              {/* State and City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="state">
                    State/Province*
                  </label>
                  <input
                    onChange={handleChange}
                    value={address.state}
                    type="text"
                    name="state"
                    id="state"
                    className={`w-full px-4 py-3 border ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-amber-500 focus:border-amber-500 transition-colors`}
                    placeholder="State/Province"
                  />
                  {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="city">
                    City*
                  </label>
                  <input
                    onChange={handleChange}
                    value={address.city}
                    type="text"
                    name="city"
                    id="city"
                    className={`w-full px-4 py-3 border ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-amber-500 focus:border-amber-500 transition-colors`}
                    placeholder="City"
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                </div>
              </div>

              {/* Street and Address Line 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="street">
                  Street*
                </label>
                <input
                  onChange={handleChange}
                  value={address.street}
                  type="text"
                  name="street"
                  id="street"
                  className={`w-full px-4 py-3 border ${
                    errors.street ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-amber-500 focus:border-amber-500 transition-colors`}
                  placeholder="Street name"
                />
                {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street}</p>}
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
                  htmlFor="addressLine1">
                  <FiHome className="text-gray-400" />
                  Address Line 1*
                </label>
                <input
                  onChange={handleChange}
                  value={address.addressLine1}
                  type="text"
                  name="addressLine1"
                  id="addressLine1"
                  className={`w-full px-4 py-3 border ${
                    errors.addressLine1 ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-amber-500 focus:border-amber-500 transition-colors`}
                  placeholder="House number, building, apartment, etc."
                />
                {errors.addressLine1 && (
                  <p className="mt-1 text-sm text-red-600">{errors.addressLine1}</p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
                  htmlFor="addressLine2">
                  <FiPackage className="text-gray-400" />
                  Address Line 2 (Optional)
                </label>
                <input
                  onChange={handleChange}
                  value={address.addressLine2 || ""}
                  type="text"
                  name="addressLine2"
                  id="addressLine2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder="Additional information (landmark, etc.)"
                />
              </div>

              <div className="flex items-center">
                <input
                  onChange={handleChange}
                  checked={address.isDefault || false}
                  type="checkbox"
                  name="isDefault"
                  id="isDefault"
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                  Set as default shipping address
                </label>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push("/account/user/address")}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm transition-colors hover:bg-gray-50"
                disabled={isLoading}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 bg-amber-600 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-amber-700"
                }`}>
                {isLoading ? (
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
                    Saving...
                  </>
                ) : (
                  "Save Address"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Help Section */}
      <div className="mt-8 bg-amber-50 rounded-xl p-6">
        <h3 className="font-medium text-gray-900 mb-3">Address Tips</h3>
        <ul className="text-gray-600 mb-4 space-y-2">
          <li>• Include apartment or suite numbers if applicable</li>
          <li>• Add landmarks to help delivery personnel locate your address</li>
          <li>• Double-check your postal code for accuracy</li>
        </ul>
        <button className="text-amber-600 hover:text-amber-700 font-medium">
          Contact support for help
        </button>
      </div>
    </div>
  );
};

export default AddAddress;
