"use client";
import { RootState } from "@/redux/Store";
import { useSelector } from "react-redux";

export default function AccountPage() {
  const { user } = useSelector((state: RootState) => state.authSlice);

  // This will only render after the layout has verified the user
  // and redirected to the role-specific page if needed
  return (
    <div>
      <h1>Account Overview</h1>
      {/* Your account content here */}
      <p>Welcome, {user?.name}</p>
    </div>
  );
}