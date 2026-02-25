"use client";

import { RootState } from "@/redux/Store";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function AccountRoleLayout({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.authSlice);

  const router = useRouter();
  const pathname = usePathname();

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (user === undefined) return;

    // Not logged in → go to login
    if (!user) {
      router.replace("/login");
      return;
    }

    const correctBasePath = `/account/${user.role}`;

    // Logged in but wrong role route → redirect
    if (!pathname.startsWith(correctBasePath)) {
      router.replace(correctBasePath);
      return;
    }

    // Access allowed
    setIsChecking(false);
  }, [user, pathname, router]);

  // Show loader while checking auth/role
  if (isChecking) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
