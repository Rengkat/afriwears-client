import { useLogoutMutation } from "@/redux/services/AuthApiSlice";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FiLogOut, FiLoader } from "react-icons/fi";
import { toast } from "react-hot-toast";

const Logout = () => {
  const router = useRouter();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    // Prevent multiple simultaneous requests
    if (isLoggingOut || isLoading) return;

    setIsLoading(true);

    try {
      await logout().unwrap();

      // Show success feedback
      toast.success("Logged out successfully!");

      // Optional: Add a small delay for better UX
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error: any) {
      console.error("Logout failed:", error);

      // Enhanced error handling with user feedback
      let errorMessage = "Logout failed. Please try again.";

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.status === "FETCH_ERROR") {
        errorMessage = "Network error. Please check your connection.";
      }

      toast.error(errorMessage);

      // If it's an authentication error, redirect to login
      if (error?.status === 401) {
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = isLoggingOut || isLoading;

  return (
    <div className="p-4 border-t border-gray-100">
      <button
        onClick={handleLogout}
        disabled={isButtonDisabled}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${
          isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}>
        {isButtonDisabled ? (
          <FiLoader size={20} className="text-gray-400 animate-spin" />
        ) : (
          <FiLogOut size={20} className="text-gray-400" />
        )}
        <span className="font-medium">{isButtonDisabled ? "Logging out..." : "Logout"}</span>
      </button>
    </div>
  );
};

export default Logout;
