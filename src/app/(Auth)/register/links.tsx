"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ReactNode } from "react";
interface Props {
  href: string;
  children: ReactNode;
}
const NavLink = ({ href, children }: Props) => {
  const route = usePathname();
  const active = href === `${route}`;
  return (
    <Link
      className={`flex-1 py-4 px-6 text-center font-medium text-gray-700 hover:text-amber-600 transition-colors flex items-center justify-center gap-2 ${
        active ? "bg-amber-500 text-white" : ""
      }`}
      href={href}>
      {children}
    </Link>
  );
};

export default NavLink;
