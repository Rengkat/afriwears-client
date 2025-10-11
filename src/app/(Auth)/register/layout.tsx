"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiUser, FiScissors } from "react-icons/fi";
import NavLink from "./links";

interface Props {
  children: React.ReactNode;
}

export default function RegisterLayout({ children }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          <NavLink href="/register">
            <FiUser className="text-lg" />
            Customer
          </NavLink>
          <NavLink href="/register/stylist">
            <FiScissors className="text-lg" />
            Stylist
          </NavLink>
        </div>
        <div className="p-6 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
