"use client";
import { RootState } from "@/redux/Store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function AccountRoleLayout({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.authSlice);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      const currentPath = window.location.pathname;
      const correctPath = `/account/${user.role}`;

      if (!currentPath.startsWith(correctPath)) {
        router.push(correctPath);
      } else {
        setIsChecking(false);
      }
    }
  }, [user, router]);

  if (!user || isChecking) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      </div>
    );
  }

  return <div>{children}</div>;
}
