"use client";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink = ({ href, children, className = "" }: Props) => {
  const segments = useSelectedLayoutSegments();
  const active = href === `/${segments[0]}` || href === `/${segments.join("/")}`;

  return (
    <Link
      href={href}
      className={`hover:text-blue-600 transition-colors ${
        active ? "text-blue-600 font-medium border-b-2 border-blue-500" : "text-gray-700"
      } ${className}`}>
      {children}
    </Link>
  );
};

export default NavLink;
