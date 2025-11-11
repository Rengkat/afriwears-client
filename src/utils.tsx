import { FiTruck } from "react-icons/fi";
import { RiHeartLine, RiShoppingBagLine } from "react-icons/ri";
import {
  FiLogOut,
  FiMenu,
  FiBriefcase,
  FiSettings,
  FiUsers,
  FiUserCheck,
  FiTrendingUp,
  FiShield,
  FiPackage,
  FiUser,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";

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
export const stylistNavItems = [
  { id: "dashboard", label: "Dashboard", icon: <FiBriefcase size={20} />, path: "/stylist" },
  {
    id: "products",
    label: "My Products",
    icon: <FiPackage size={20} />,
    path: "/account/stylist/products",
  },
  {
    id: "orders",
    label: "Orders",
    icon: <RiShoppingBagLine size={20} />,
    path: "/stylist/orders",
  },
  {
    id: "profile",
    label: "Profile",
    icon: <FiUser size={20} />,
    path: "/account/stylist/profile",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <FiSettings size={20} />,
    path: "/account/stylist/settings",
  },
];
export const adminNavItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <FiTrendingUp size={20} />,
    path: "/account/admin",
  },
  {
    id: "users",
    label: "User Management",
    icon: <FiUsers size={20} />,
    path: "/account/admin/users",
  },
  {
    id: "stylists",
    label: "Stylist Management",
    icon: <FiBriefcase size={20} />,
    path: "/account/admin/stylists",
  },
  {
    id: "products",
    label: "Product Approval",
    icon: <FiPackage size={20} />,
    path: "/account/admin/products",
  },
  {
    id: "orders",
    label: "All Orders",
    icon: <RiShoppingBagLine size={20} />,
    path: "/account/admin/orders",
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: <FiDollarSign size={20} />,
    path: "/account/admin/transactions",
  },
  {
    id: "profile",
    label: "Profile",
    icon: <FiUser size={20} />,
    path: "/account/admin/profile",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <FiSettings size={20} />,
    path: "/account/admin/settings",
  },
];
export const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "suspended":
      return "bg-red-100 text-red-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getVerificationColor = (status: string) => {
  switch (status) {
    case "verified":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <FiCheckCircle className="text-green-500" size={16} />;
    case "pending":
      return <FiClock className="text-amber-500" size={16} />;
    case "rejected":
      return <FiXCircle className="text-red-500" size={16} />;
    default:
      return <FiPackage className="text-gray-500" size={16} />;
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case "men":
      return "bg-blue-100 text-blue-800";
    case "women":
      return "bg-pink-100 text-pink-800";
    case "unisex":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "partially_paid":
      return "bg-amber-100 text-amber-800";
    case "pending":
      return "bg-blue-100 text-blue-800";
    case "failed":
      return "bg-red-100 text-red-800";
    case "refunded":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatCurrency = (amount: number) => {
  return `₦${amount.toLocaleString()}`;
};
export const getVerificationIcon = (status: string) => {
  switch (status) {
    case "verified":
      return <FiCheckCircle className="text-green-500" size={16} />;
    case "pending":
      return <FiClock className="text-amber-500" size={16} />;
    case "rejected":
      return <FiXCircle className="text-red-500" size={16} />;
    default:
      return <FiUserCheck className="text-gray-500" size={16} />;
  }
};
export const settingsDatat = {
  // General Settings
  siteName: "FashionApp",
  siteDescription: "Premium African Fashion Marketplace",
  contactEmail: "admin@fashionapp.com",
  supportPhone: "+2348000000000",

  // Security Settings
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  twoFactorAuth: true,

  // Notification Settings
  notifications: {
    newUsers: true,
    newStylists: true,
    productApprovals: true,
    highValueOrders: true,
    systemAlerts: true,
    securityBreaches: true,
  },

  // Payment Settings
  paymentSettings: {
    platformCommission: 15,
    autoApprovePayments: false,
    minimumPayout: 5000,
    payoutSchedule: "weekly",
  },
};
