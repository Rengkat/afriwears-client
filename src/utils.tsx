import { FiTruck, FiUser } from "react-icons/fi";
import { RiHeartLine, RiShoppingBagLine } from "react-icons/ri";

// Navigation items
export const navItems = [
  { id: "account", label: "My Account", icon: <FiUser size={20} />, path: "/account/user" },
  {
    id: "orders",
    label: "My Orders",
    icon: <RiShoppingBagLine size={20} />,
    path: "/account/user/orders",
  },
  {
    id: "wishlist",
    label: "Wishlist",
    icon: <RiHeartLine size={20} />,
    path: "/account/user/wishlist",
  },
  {
    id: "address",
    label: "Delivery Address",
    icon: <FiTruck size={20} />,
    path: "/account/user/address",
  },
];
