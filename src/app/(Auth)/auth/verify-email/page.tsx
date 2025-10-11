"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
import { useVerifyEmailMutation } from "@/redux/services/AuthApiSlice";
import toast from "react-hot-toast";

interface ApiError {
  data?: {
    message?: string | undefined;
  };
  status?: number;
}

const VerifyEmail = () => {
  const [verify] = useVerifyEmailMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const verificationToken = searchParams.get("verificationToken");
  const email = searchParams.get("email");

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [countdown, setCountdown] = useState(5);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!verificationToken) {
      setStatus("error");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await verify({ verificationToken, email }).unwrap();
        toast.success(res.message);
        setStatus("success");

        // Start countdown to redirect
        timerRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              router.push("/login");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (err: any) {
        toast.error(err?.data?.message || "Verification failed");
        setStatus("error");
      }
    };

    verifyToken();
  }, [verificationToken, email, router, verify]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          {status === "verifying" && (
            <div className="space-y-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12">
                <FiLoader className="h-10 w-10 text-amber-500 animate-spin" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900">Verifying your email</h2>
              <p className="text-sm text-gray-600">
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <FiCheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900">Email Verified!</h2>
              <p className="text-sm text-gray-600">
                Your email has been successfully verified. Redirecting to login in {countdown}{" "}
                seconds...
              </p>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-amber-600 hover:text-amber-500">
                  Go to login now
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <FiXCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900">Verification Failed</h2>
              <p className="text-sm text-gray-600">
                The verification link is invalid or has expired.
              </p>
              <div className="pt-4 space-y-3">
                <Link
                  href="/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700">
                  Go to Login
                </Link>
                <p className="text-sm text-gray-600">
                  Need a new verification email?{" "}
                  <Link
                    href="/resend-verification"
                    className="font-medium text-amber-600 hover:text-amber-500">
                    Resend
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
