"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiShoppingBag,
  FiCreditCard,
  FiTruck,
  FiChevronLeft,
  FiMapPin,
  FiPhone,
  FiDollarSign,
} from "react-icons/fi";
import { useGetCartProductsQuery } from "@/redux/services/CartApiSlice";
import { useCreateOrderMutation } from "@/redux/services/OrderApiSlice";
import toast from "react-hot-toast";

interface ShippingAddress {
  country: string;
  state: string;
  city: string;
  street: string;
  postalCode: string;
  homeAddress: string;
  phone: string;
}

interface CartProduct {
  id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    mainImage: string;
    stock: number;
  };
  quantity: number;
  price: number;
  selectedSize?: string;
  selectedColor?: string;
}

const CheckoutPage = () => {
  const router = useRouter();
  const { data: cartData, isLoading: cartLoading } = useGetCartProductsQuery(undefined);
  const [createOrder, { isLoading: orderLoading }] = useCreateOrderMutation();

  // Form state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    country: "Nigeria",
    state: "",
    city: "",
    street: "",
    postalCode: "",
    homeAddress: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "wallet" | "cash_on_delivery">(
    "credit_card",
  );
  const [orderType] = useState<"standard" | "custom">("standard");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  // Cart calculations
  const cartProducts = cartData?.data?.items || [];
  const subtotal = cartData?.total || 0;
  const shipping = subtotal > 0 ? 2500 : 0;
  const tax = subtotal > 0 ? Math.round(subtotal * 0.075) : 0;
  const total = subtotal + shipping + tax;

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && cartProducts.length === 0) {
      toast.error("Your cart is empty");
      router.push("/cart");
    }
  }, [cartLoading, cartProducts.length, router]);

  // Nigerian states
  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  // Form validation
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!shippingAddress.state) errors.state = "State is required";
    if (!shippingAddress.city) errors.city = "City is required";
    if (!shippingAddress.street) errors.street = "Street address is required";
    if (!shippingAddress.postalCode) errors.postalCode = "Postal code is required";
    if (!shippingAddress.homeAddress) errors.homeAddress = "Home address is required";
    if (!shippingAddress.phone) errors.phone = "Phone number is required";
    if (shippingAddress.phone && !/^[\d\s\-\+\(\)]+$/.test(shippingAddress.phone)) {
      errors.phone = "Invalid phone number format";
    }
    if (!agreedToTerms) errors.terms = "You must agree to the terms and conditions";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle order submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const orderData = {
        shippingAddress,
        paymentMethod,
        orderType,
      };

      const response = await createOrder(orderData).unwrap();

      // Handle different payment methods
      if (paymentMethod === "credit_card" && response.authorizationUrl) {
        // Redirect to Paystack payment page
        toast.success("Redirecting to payment gateway...");
        window.location.href = response.authorizationUrl;
      } else if (paymentMethod === "wallet" || paymentMethod === "cash_on_delivery") {
        // For wallet or COD, redirect to order success page
        toast.success("Order placed successfully!");
        router.push(`/account/user/orders`);
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to create order. Please try again.";
      toast.error(errorMessage);
      console.error("Order creation error:", error);
    }
  };

  if (cartLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4">
          <FiChevronLeft className="mr-1" />
          Back to Cart
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FiShoppingBag className="text-amber-500" />
          Checkout
        </h1>
        <p className="text-gray-600 mt-1">Complete your purchase</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiMapPin className="text-amber-500" />
                Shipping Address
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    title="country"
                    type="text"
                    name="country"
                    value={shippingAddress.country}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    title="state"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      formErrors.state ? "border-red-500" : "border-gray-300"
                    }`}>
                    <option value="">Select State</option>
                    {nigerianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {formErrors.state && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      formErrors.city ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.city && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.city}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleInputChange}
                    placeholder="Enter street address"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      formErrors.street ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.street && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.street}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Home Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="homeAddress"
                    value={shippingAddress.homeAddress}
                    onChange={handleInputChange}
                    placeholder="Apartment, suite, unit, building, floor, etc."
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      formErrors.homeAddress ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.homeAddress && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.homeAddress}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    placeholder="Enter postal code"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      formErrors.postalCode ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.postalCode && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.postalCode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    placeholder="+234 xxx xxx xxxx"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      formErrors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiCreditCard className="text-amber-500" />
                Payment Method
              </h2>

              <div className="space-y-3">
                {/* Online Payment */}
                <label
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "credit_card"
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={paymentMethod === "credit_card"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Credit/Debit Card</span>
                      <FiCreditCard className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Pay securely with Paystack (Visa, Mastercard, Verve)
                    </p>
                  </div>
                </label>

                {/* Wallet Payment */}
                <label
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "wallet"
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Wallet</span>
                      <FiDollarSign className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Pay from your wallet balance</p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "cash_on_delivery"
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={paymentMethod === "cash_on_delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Cash on Delivery</span>
                      <FiTruck className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Pay when you receive your order</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (formErrors.terms) {
                      setFormErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.terms;
                        return newErrors;
                      });
                    }
                  }}
                  className={`mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 rounded ${
                    formErrors.terms ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <span className="ml-3 text-sm text-gray-600">
                  I agree to the{" "}
                  <Link href="/terms" className="text-amber-600 hover:text-amber-700 underline">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-amber-600 hover:text-amber-700 underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {formErrors.terms && <p className="mt-2 text-sm text-red-500">{formErrors.terms}</p>}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {cartProducts.map((item: CartProduct) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.product.mainImage ? (
                        <img
                          src={item.product.mainImage}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          <FiShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium text-gray-900">
                        ₦{item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartProducts.length} items)</span>
                  <span className="font-medium text-gray-900">₦{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">₦{shipping.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax (7.5%)</span>
                  <span className="font-medium text-gray-900">₦{tax.toLocaleString()}</span>
                </div>

                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-amber-600">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={orderLoading}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
                {orderLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FiCreditCard />
                    <span>Place Order</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
