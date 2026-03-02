"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useVerifyPaymentMutation } from "@/redux/services/OrderApiSlice";

const PaymentVerificationContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifyPayment, { isLoading }] = useVerifyPaymentMutation();
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");
  const [message, setMessage] = useState("Verifying your payment...");
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const verifyPaymentAsync = async () => {
      const reference = searchParams.get("reference");
      // orderId is optional now - we'll get it from the API response
      const orderIdParam = searchParams.get("orderId");

      console.log("Reference:", reference, "OrderId param:", orderIdParam);

      if (!reference) {
        setStatus("failed");
        setMessage("Invalid payment reference");
        return;
      }

      try {
        // We only need to pass the reference to the API
        // The API will find the order using the reference
        const result = await verifyPayment({
          reference,
          // Pass orderId if available, otherwise the API will find by reference
          orderId: orderIdParam || undefined,
        }).unwrap();

        if (result.success) {
          setStatus("success");
          setMessage("Payment verified successfully!");
          // Set orderId from the response if available
          if (result.order?._id) {
            setOrderId(result.order._id);
          }

          // Redirect to orders page after 3 seconds
          setTimeout(() => {
            router.push("/account/user/orders");
          }, 3000);
        } else {
          setStatus("failed");
          setMessage(result.message || "Payment verification failed");
        }
      } catch (error: any) {
        console.error("Payment verification error:", error);
        setStatus("failed");
        setMessage(error?.data?.message || "An error occurred while verifying your payment");
      }
    };

    verifyPaymentAsync();
  }, [searchParams, router, verifyPayment]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Status Icon */}
          <div className="mb-6">
            {status === "verifying" || isLoading ? (
              <div className="mx-auto h-20 w-20 text-amber-500">
                <FiLoader className="w-full h-full animate-spin" />
              </div>
            ) : status === "success" ? (
              <div className="mx-auto h-20 w-20 text-green-500">
                <FiCheckCircle className="w-full h-full" />
              </div>
            ) : (
              <div className="mx-auto h-20 w-20 text-red-500">
                <FiXCircle className="w-full h-full" />
              </div>
            )}
          </div>

          {/* Status Message */}
          <h2
            className={`text-2xl font-bold mb-4 ${
              status === "success"
                ? "text-green-900"
                : status === "failed"
                  ? "text-red-900"
                  : "text-gray-900"
            }`}>
            {status === "verifying" || isLoading
              ? "Verifying Payment"
              : status === "success"
                ? "Payment Successful!"
                : "Payment Failed"}
          </h2>

          <p className="text-gray-600 mb-8">{message}</p>

          {/* Action Buttons */}
          <div className="space-y-3">
            {status === "success" && (
              <>
                <Link
                  href="/account/user/orders"
                  className="block w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors">
                  View My Orders
                </Link>
                <Link
                  href="/products"
                  className="block w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">
                  Continue Shopping
                </Link>
              </>
            )}

            {status === "failed" && (
              <>
                <Link
                  href="/cart"
                  className="block w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors">
                  Return to Cart
                </Link>
                <Link
                  href="/account/user/orders"
                  className="block w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">
                  View Order History
                </Link>
              </>
            )}

            {(status === "verifying" || isLoading) && (
              <p className="text-sm text-gray-500">Please wait, do not close this page...</p>
            )}
          </div>

          {/* Order ID Display */}
          {orderId && status !== "verifying" && !isLoading && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Order ID: <span className="font-mono font-medium">{orderId.slice(-8)}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PaymentVerificationPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="mx-auto h-20 w-20 text-amber-500">
                <FiLoader className="w-full h-full animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
              <p className="text-gray-600">Preparing payment verification...</p>
            </div>
          </div>
        </div>
      }>
      <PaymentVerificationContent />
    </Suspense>
  );
};

export default PaymentVerificationPage;
