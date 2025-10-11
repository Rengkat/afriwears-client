"use client";
import { RootState } from "@/redux/Store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
// import { selectCurrentUser } from "@/redux/features/authSlice";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user } = useSelector((store: RootState) => store.authSlice);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
        <p className="mb-6">
          {user
            ? `Your account (${user?.role}) doesn't have permission to access this page.`
            : "You need to be logged in to access this page."}
        </p>
        <div className="flex flex-col space-y-3">
          {user ? (
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">
              Go Back
            </button>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Login
            </Link>
          )}
          <Link
            href="/"
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
