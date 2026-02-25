"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
import { useVerifyWalletFundingMutation } from "@/redux/services/TransactionApiSlice";

const VerifyFundingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [verifyFunding, { isLoading }] = useVerifyWalletFundingMutation();
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "failed">(
    "pending",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      console.log("Verifying payment with reference:", reference);
      if (!reference) {
        setError("No payment reference provided");
        setVerificationStatus("failed");
        return;
      }

      try {
        const res = await verifyFunding({ reference }).unwrap();
        setVerificationStatus("success");
        setTimeout(() => router.push("/account/user"), 3000);
      } catch (err: any) {
        setError(err.data?.message || "Payment verification failed");
        setVerificationStatus("failed");
      }
    };

    verifyPayment();
  }, [reference, verifyFunding, router]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 max-w-md mx-auto">
        <div className="p-8 text-center">
          {verificationStatus === "pending" && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <FiLoader className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Verifying Payment</h3>
              <p className="text-gray-500">Please wait while we verify your transaction...</p>
            </>
          )}

          {verificationStatus === "success" && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <FiCheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Verified!</h3>
              <p className="text-gray-500 mb-6">Your wallet has been funded successfully.</p>
              <p className="text-sm text-gray-500">You'll be redirected shortly...</p>
            </>
          )}

          {verificationStatus === "failed" && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <FiXCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Verification Failed</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => router.push("/account/wallet/fund-wallet")}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700">
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyFundingPage;
