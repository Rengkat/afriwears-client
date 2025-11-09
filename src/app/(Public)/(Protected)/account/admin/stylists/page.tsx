// "use client";
// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/Store";
// import {
//   FiSearch,
//   FiEdit,
//   FiTrash2,
//   FiEye,
//   FiUserCheck,
//   FiUserX,
//   FiDollarSign,
//   FiCheckCircle,
//   FiClock,
// } from "react-icons/fi";
// import { mockStylists } from "@/mockData";
// import { formatCurrency, getStatusColor, getVerificationColor, getVerificationIcon } from "@/utils";
// import StatCard from "./StatCard";
// import FilterSearch from "./FilterSearch";
// import StylistList from "./StylistList";
// import Pagination from "./Pagination";
// import StylistDetailModel from "./StylistDetailModel";
// import VerificationModel from "./VerificationModel";
// import SuspensionModel from "./SuspensionModel";

// // Mock stylist data based on your schema

// const StylistManagementPage = () => {
//   const { user } = useSelector((store: RootState) => store.authSlice);
//   const [stylists, setStylists] = useState(mockStylists);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [verificationFilter, setVerificationFilter] = useState("all");
//   const [selectedStylists, setSelectedStylists] = useState<string[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [stylistsPerPage] = useState(10);
//   const [showStylistModal, setShowStylistModal] = useState(false);
//   const [selectedStylist, setSelectedStylist] = useState<any>(null);
//   const [showVerificationModal, setShowVerificationModal] = useState(false);
//   const [showSuspensionModal, setShowSuspensionModal] = useState(false);

//   // Filter stylists based on search and filters
//   const filteredStylists = stylists.filter((stylist) => {
//     const matchesSearch =
//       stylist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       stylist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       stylist.company.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus = statusFilter === "all" || stylist.status === statusFilter;
//     const matchesVerification =
//       verificationFilter === "all" || stylist.verificationStatus === verificationFilter;

//     return matchesSearch && matchesStatus && matchesVerification;
//   });

//   // Pagination
//   const indexOfLastStylist = currentPage * stylistsPerPage;
//   const indexOfFirstStylist = indexOfLastStylist - stylistsPerPage;
//   const currentStylists = filteredStylists.slice(indexOfFirstStylist, indexOfLastStylist);
//   const totalPages = Math.ceil(filteredStylists.length / stylistsPerPage);

//   // Handle stylist actions
//   const handleViewStylist = (stylist: any) => {
//     setSelectedStylist(stylist);
//     setShowStylistModal(true);
//   };

//   const handleEditStylist = (stylist: any) => {
//     setSelectedStylist(stylist);
//     // Navigate to edit page or open edit modal
//     console.log("Edit stylist:", stylist);
//   };

//   const handleVerifyStylist = (stylist: any) => {
//     setSelectedStylist(stylist);
//     setShowVerificationModal(true);
//   };

//   const handleSuspendStylist = (stylist: any) => {
//     setSelectedStylist(stylist);
//     setShowSuspensionModal(true);
//   };

//   const handleActivateStylist = (stylistId: string) => {
//     setStylists(
//       stylists.map((s) =>
//         s._id === stylistId ? { ...s, status: "active", suspensionReason: "" } : s
//       )
//     );
//   };

//   const handleDeleteStylist = (stylistId: string) => {
//     if (
//       window.confirm(
//         "Are you sure you want to delete this stylist? This will also remove all their products and orders."
//       )
//     ) {
//       setStylists(stylists.filter((s) => s._id !== stylistId));
//       setSelectedStylists(selectedStylists.filter((id) => id !== stylistId));
//     }
//   };

//   const handleBulkAction = (action: string) => {
//     if (selectedStylists.length === 0) return;

//     switch (action) {
//       case "verify":
//         setStylists(
//           stylists.map((s) =>
//             selectedStylists.includes(s._id)
//               ? {
//                   ...s,
//                   verificationStatus: "verified",
//                   canAddProducts: true,
//                   rejectionReason: "",
//                 }
//               : s
//           )
//         );
//         break;
//       case "suspend":
//         setStylists(
//           stylists.map((s) =>
//             selectedStylists.includes(s._id)
//               ? {
//                   ...s,
//                   status: "suspended",
//                   suspensionReason: "Bulk suspension",
//                 }
//               : s
//           )
//         );
//         break;
//       case "activate":
//         setStylists(
//           stylists.map((s) =>
//             selectedStylists.includes(s._id)
//               ? {
//                   ...s,
//                   status: "active",
//                   suspensionReason: "",
//                 }
//               : s
//           )
//         );
//         break;
//       case "delete":
//         if (
//           window.confirm(
//             `Are you sure you want to delete ${selectedStylists.length} stylists? This action cannot be undone.`
//           )
//         ) {
//           setStylists(stylists.filter((s) => !selectedStylists.includes(s._id)));
//           setSelectedStylists([]);
//         }
//         break;
//     }
//   };

//   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.checked) {
//       setSelectedStylists(currentStylists.map((stylist) => stylist._id));
//     } else {
//       setSelectedStylists([]);
//     }
//   };

//   const handleSelectStylist = (stylistId: string, checked: boolean) => {
//     if (checked) {
//       setSelectedStylists([...selectedStylists, stylistId]);
//     } else {
//       setSelectedStylists(selectedStylists.filter((id) => id !== stylistId));
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Stylist Management</h1>
//             <p className="text-gray-600 mt-1">Manage and monitor all platform stylists</p>
//           </div>
//           <div className="mt-4 md:mt-0">
//             <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors">
//               Export Stylists
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <StatCard stylists={stylists} />
//       {/* Filters and Search */}
//       <FilterSearch
//         setStatusFilter={setStatusFilter}
//         handleBulkAction={handleBulkAction}
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         statusFilter={statusFilter}
//         selectedStylists={selectedStylists}
//         verificationFilter={verificationFilter}
//         setVerificationFilter={setVerificationFilter}
//       />
//       {/* Stylists Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   <input
//                     type="checkbox"
//                     onChange={handleSelectAll}
//                     checked={
//                       selectedStylists.length === currentStylists.length &&
//                       currentStylists.length > 0
//                     }
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                   />
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Stylist
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Verification
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Products
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Revenue
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Rating
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentStylists.map((stylist) => {
//                 return (
//                   <StylistList
//                     stylist={stylist}
//                     selectedStylists={selectedStylists}
//                     handleSelectStylist={handleSelectStylist}
//                     handleViewStylist={handleViewStylist}
//                     handleEditStylist={handleEditStylist}
//                     handleVerifyStylist={handleVerifyStylist}
//                     handleSuspendStylist={handleSuspendStylist}
//                     handleActivateStylist={handleActivateStylist}
//                     handleDeleteStylist={handleDeleteStylist}
//                   />
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <Pagination
//             filteredStylists={filteredStylists}
//             indexOfLastStylist={indexOfLastStylist}
//             indexOfFirstStylist={indexOfFirstStylist}
//             setCurrentPage={setCurrentPage}
//             currentPage={currentPage}
//             totalPages={totalPages}
//           />
//         )}
//       </div>

//       {/* Stylist Detail Modal */}
//       {showStylistModal && selectedStylist && (
//         <StylistDetailModel
//           handleVerifyStylist={handleVerifyStylist}
//           handleEditStylist={handleEditStylist}
//           setShowStylistModal={setShowStylistModal}
//           selectedStylist={selectedStylist}
//           handleSuspendStylist={handleSuspendStylist}
//           handleActivateStylist={handleActivateStylist}
//         />
//       )}

//       {/* Verification Modal */}
//       {showVerificationModal && selectedStylist && (
//         <VerificationModel
//           setShowVerificationModal={setShowVerificationModal}
//           setStylists={setStylists}
//           stylists={stylists}
//           selectedStylist={selectedStylist}
//         />
//       )}

//       {/* Suspension Modal */}
//       {showSuspensionModal && selectedStylist && (
//         <SuspensionModel
//           setShowSuspensionModal={setShowSuspensionModal}
//           selectedStylist={selectedStylist}
//           setStylists={setStylists}
//           stylists={stylists}
//         />
//       )}
//     </div>
//   );
// };

// export default StylistManagementPage;
"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiUserCheck,
  FiUserX,
  FiMail,
  FiCalendar,
  FiShoppingBag,
  FiPackage,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertCircle,
  FiMapPin,
  FiAward,
} from "react-icons/fi";

// Mock stylist data based on your schema
const mockStylists = [
  {
    _id: "1",
    name: "Amina Couture",
    email: "amina@couture.com",
    avatar: "/stylist-avatar-1.jpg",
    company: "Amina Couture Designs",
    role: "stylist",
    verificationStatus: "verified",
    status: "active",
    totalProducts: 24,
    pendingApproval: 3,
    totalOrders: 128,
    totalRevenue: 1250000,
    rating: 4.8,
    reviewCount: 89,
    joinedDate: "2023-11-15T10:30:00Z",
    lastLogin: "2024-03-20T14:25:00Z",
    isEmailVerified: true,
    canAddProducts: true,
    businessInfo: {
      description:
        "Premium African fashion designs with modern touch. Specializing in traditional and contemporary styles for modern women.",
      location: "Lagos, Nigeria",
      experience: "5 years",
      specialties: ["Traditional", "Corporate", "Casual", "Modern African"],
      website: "https://aminacouture.com",
      phone: "+2348012345678",
    },
    performance: {
      completionRate: 98,
      avgResponseTime: "2 hours",
      customerSatisfaction: 4.9,
    },
  },
  {
    _id: "2",
    name: "John Fashion",
    email: "john@fashion.com",
    avatar: "/stylist-avatar-2.jpg",
    company: "John Fashion House",
    role: "stylist",
    verificationStatus: "pending",
    status: "active",
    totalProducts: 12,
    pendingApproval: 5,
    totalOrders: 45,
    totalRevenue: 450000,
    rating: 4.2,
    reviewCount: 23,
    joinedDate: "2024-01-20T08:15:00Z",
    lastLogin: "2024-03-19T09:45:00Z",
    isEmailVerified: true,
    canAddProducts: false,
    businessInfo: {
      description:
        "Modern and contemporary fashion designs for the sophisticated man. Focus on corporate and casual wear.",
      location: "Abuja, Nigeria",
      experience: "3 years",
      specialties: ["Modern", "Casual", "Corporate"],
      phone: "+2348098765432",
    },
    performance: {
      completionRate: 92,
      avgResponseTime: "4 hours",
      customerSatisfaction: 4.3,
    },
  },
  {
    _id: "3",
    name: "Sarah Styles",
    email: "sarah@styles.com",
    avatar: "/stylist-avatar-3.jpg",
    company: "Sarah Styles Collection",
    role: "stylist",
    verificationStatus: "verified",
    status: "suspended",
    totalProducts: 36,
    pendingApproval: 0,
    totalOrders: 215,
    totalRevenue: 2100000,
    rating: 4.9,
    reviewCount: 156,
    joinedDate: "2023-08-10T16:20:00Z",
    lastLogin: "2024-03-18T11:30:00Z",
    isEmailVerified: true,
    canAddProducts: false,
    suspensionReason: "Multiple customer complaints about delivery delays and quality issues",
    businessInfo: {
      description:
        "Luxury fashion and bespoke tailoring for special occasions. Creating memorable pieces for unforgettable moments.",
      location: "Port Harcourt, Nigeria",
      experience: "7 years",
      specialties: ["Luxury", "Bespoke", "Traditional", "Wedding"],
      website: "https://sarahstyles.com",
      phone: "+2348055555555",
    },
    performance: {
      completionRate: 85,
      avgResponseTime: "6 hours",
      customerSatisfaction: 4.1,
    },
  },
  {
    _id: "4",
    name: "Mike Designs",
    email: "mike@designs.com",
    avatar: "/stylist-avatar-4.jpg",
    company: "Mike Creative Designs",
    role: "stylist",
    verificationStatus: "rejected",
    status: "inactive",
    totalProducts: 8,
    pendingApproval: 8,
    totalOrders: 12,
    totalRevenue: 120000,
    rating: 4.0,
    reviewCount: 8,
    joinedDate: "2024-02-28T12:00:00Z",
    lastLogin: "2024-03-05T12:00:00Z",
    isEmailVerified: true,
    canAddProducts: false,
    rejectionReason: "Incomplete business documentation and unverifiable business address",
    businessInfo: {
      description:
        "Creative and innovative fashion solutions for the youth. Focus on streetwear and contemporary styles.",
      location: "Ibadan, Nigeria",
      experience: "2 years",
      specialties: ["Creative", "Modern", "Streetwear"],
    },
    performance: {
      completionRate: 88,
      avgResponseTime: "8 hours",
      customerSatisfaction: 4.0,
    },
  },
  {
    _id: "5",
    name: "Elegance By Zara",
    email: "zara@elegance.com",
    avatar: "/stylist-avatar-5.jpg",
    company: "Elegance By Zara",
    role: "stylist",
    verificationStatus: "verified",
    status: "active",
    totalProducts: 42,
    pendingApproval: 2,
    totalOrders: 189,
    totalRevenue: 1850000,
    rating: 4.7,
    reviewCount: 134,
    joinedDate: "2023-09-05T09:45:00Z",
    lastLogin: "2024-03-20T16:10:00Z",
    isEmailVerified: true,
    canAddProducts: true,
    businessInfo: {
      description:
        "Elegant and sophisticated fashion for modern women. Specializing in corporate and evening wear.",
      location: "Lagos, Nigeria",
      experience: "6 years",
      specialties: ["Elegant", "Sophisticated", "Corporate", "Evening Wear"],
      website: "https://elegancebyzara.com",
      phone: "+2348033333333",
    },
    performance: {
      completionRate: 96,
      avgResponseTime: "1 hour",
      customerSatisfaction: 4.8,
    },
  },
  {
    _id: "6",
    name: "Traditional Weaves",
    email: "info@traditionalweaves.com",
    avatar: "/stylist-avatar-6.jpg",
    company: "Traditional Weaves NG",
    role: "stylist",
    verificationStatus: "pending",
    status: "active",
    totalProducts: 15,
    pendingApproval: 7,
    totalOrders: 28,
    totalRevenue: 320000,
    rating: 4.5,
    reviewCount: 18,
    joinedDate: "2024-02-15T14:30:00Z",
    lastLogin: "2024-03-20T10:15:00Z",
    isEmailVerified: true,
    canAddProducts: false,
    businessInfo: {
      description:
        "Preserving traditional weaving techniques while creating modern fashion pieces. Authentic African textiles.",
      location: "Kano, Nigeria",
      experience: "4 years",
      specialties: ["Traditional", "Textiles", "Cultural", "Handwoven"],
      phone: "+2348077777777",
    },
    performance: {
      completionRate: 90,
      avgResponseTime: "3 hours",
      customerSatisfaction: 4.6,
    },
  },
];

const StylistManagementPage = () => {
  const { user } = useSelector((store: RootState) => store.authSlice);
  const [stylists, setStylists] = useState(mockStylists);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [selectedStylists, setSelectedStylists] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [stylistsPerPage] = useState(10);
  const [showStylistModal, setShowStylistModal] = useState(false);
  const [selectedStylist, setSelectedStylist] = useState<any>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showSuspensionModal, setShowSuspensionModal] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [verificationNotes, setVerificationNotes] = useState("");

  // Filter stylists based on search and filters
  const filteredStylists = stylists.filter((stylist) => {
    const matchesSearch =
      stylist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stylist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stylist.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || stylist.status === statusFilter;
    const matchesVerification =
      verificationFilter === "all" || stylist.verificationStatus === verificationFilter;

    return matchesSearch && matchesStatus && matchesVerification;
  });

  // Pagination
  const indexOfLastStylist = currentPage * stylistsPerPage;
  const indexOfFirstStylist = indexOfLastStylist - stylistsPerPage;
  const currentStylists = filteredStylists.slice(indexOfFirstStylist, indexOfLastStylist);
  const totalPages = Math.ceil(filteredStylists.length / stylistsPerPage);

  // Handle stylist actions
  const handleViewStylist = (stylist: any) => {
    setSelectedStylist(stylist);
    setShowStylistModal(true);
  };

  const handleEditStylist = (stylist: any) => {
    setSelectedStylist(stylist);
    // Navigate to edit page or open edit modal
    console.log("Edit stylist:", stylist);
  };

  const handleVerifyStylist = (stylist: any) => {
    setSelectedStylist(stylist);
    setShowVerificationModal(true);
  };

  const handleApproveStylist = (stylistId: string) => {
    setStylists(
      stylists.map((s) =>
        s._id === stylistId
          ? {
              ...s,
              verificationStatus: "verified",
              canAddProducts: true,
              rejectionReason: "",
            }
          : s
      )
    );
  };

  const handleRejectStylist = (stylist: any) => {
    setSelectedStylist(stylist);
    // For rejection, we'd typically show a modal similar to suspension
    // For now, using a generic reason
    setStylists(
      stylists.map((s) =>
        s._id === stylist._id
          ? {
              ...s,
              verificationStatus: "rejected",
              canAddProducts: false,
              rejectionReason: "Business documentation incomplete",
            }
          : s
      )
    );
  };

  const handleSuspendStylist = (stylist: any) => {
    setSelectedStylist(stylist);
    setShowSuspensionModal(true);
  };

  const handleActivateStylist = (stylistId: string) => {
    setStylists(
      stylists.map((s) =>
        s._id === stylistId
          ? {
              ...s,
              status: "active",
              suspensionReason: "",
            }
          : s
      )
    );
  };

  const handleDeleteStylist = (stylistId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this stylist? This will also remove all their products and orders."
      )
    ) {
      setStylists(stylists.filter((s) => s._id !== stylistId));
      setSelectedStylists(selectedStylists.filter((id) => id !== stylistId));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedStylists.length === 0) return;

    switch (action) {
      case "verify":
        setStylists(
          stylists.map((s) =>
            selectedStylists.includes(s._id)
              ? {
                  ...s,
                  verificationStatus: "verified",
                  canAddProducts: true,
                  rejectionReason: "",
                }
              : s
          )
        );
        setSelectedStylists([]);
        break;
      case "suspend":
        setStylists(
          stylists.map((s) =>
            selectedStylists.includes(s._id)
              ? {
                  ...s,
                  status: "suspended",
                  suspensionReason: "Bulk suspension - quality compliance review",
                }
              : s
          )
        );
        setSelectedStylists([]);
        break;
      case "activate":
        setStylists(
          stylists.map((s) =>
            selectedStylists.includes(s._id)
              ? {
                  ...s,
                  status: "active",
                  suspensionReason: "",
                }
              : s
          )
        );
        setSelectedStylists([]);
        break;
      case "delete":
        if (
          window.confirm(
            `Are you sure you want to delete ${selectedStylists.length} stylists? This action cannot be undone.`
          )
        ) {
          setStylists(stylists.filter((s) => !selectedStylists.includes(s._id)));
          setSelectedStylists([]);
        }
        break;
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStylists(currentStylists.map((stylist) => stylist._id));
    } else {
      setSelectedStylists([]);
    }
  };

  const handleSelectStylist = (stylistId: string, checked: boolean) => {
    if (checked) {
      setSelectedStylists([...selectedStylists, stylistId]);
    } else {
      setSelectedStylists(selectedStylists.filter((id) => id !== stylistId));
    }
  };

  const getStatusColor = (status: string) => {
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

  const getVerificationColor = (status: string) => {
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

  const getVerificationIcon = (status: string) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  // Stats calculations
  const totalStylistsCount = stylists.length;
  const verifiedCount = stylists.filter((s) => s.verificationStatus === "verified").length;
  const pendingVerificationCount = stylists.filter(
    (s) => s.verificationStatus === "pending"
  ).length;
  const suspendedCount = stylists.filter((s) => s.status === "suspended").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Stylist Management</h1>
            <p className="text-gray-600 mt-1">Manage and monitor all platform stylists</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors">
              Export Stylists
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Stylists</p>
              <p className="text-2xl font-bold text-gray-900">{totalStylistsCount}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
              <FiUserCheck className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Verified Stylists</p>
              <p className="text-2xl font-bold text-gray-900">{verifiedCount}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <FiCheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Verification</p>
              <p className="text-2xl font-bold text-gray-900">{pendingVerificationCount}</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-full">
              <FiClock className="text-amber-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Suspended</p>
              <p className="text-2xl font-bold text-gray-900">{suspendedCount}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-full">
              <FiUserX className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search stylists by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Verification</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedStylists.length > 0 && (
          <div className="mt-4 flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-900">
              {selectedStylists.length} stylist(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("verify")}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors">
                Verify All
              </button>
              <button
                onClick={() => handleBulkAction("activate")}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors">
                Activate All
              </button>
              <button
                onClick={() => handleBulkAction("suspend")}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors">
                Suspend All
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded transition-colors">
                Delete All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stylists Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedStylists.length === currentStylists.length &&
                      currentStylists.length > 0
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stylist
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentStylists.map((stylist) => (
                <tr key={stylist._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedStylists.includes(stylist._id)}
                      onChange={(e) => handleSelectStylist(stylist._id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                        {stylist.avatar ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={stylist.avatar}
                            alt={stylist.name}
                          />
                        ) : (
                          <FiUserCheck className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {stylist.name}
                          {stylist.isEmailVerified && (
                            <span className="ml-1 text-green-500" title="Email Verified">
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{stylist.company}</div>
                        <div className="text-xs text-gray-400">{stylist.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getVerificationIcon(stylist.verificationStatus)}
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVerificationColor(
                          stylist.verificationStatus
                        )}`}>
                        {stylist.verificationStatus}
                      </span>
                    </div>
                    {stylist.rejectionReason && (
                      <div
                        className="text-xs text-gray-500 mt-1 max-w-xs truncate"
                        title={stylist.rejectionReason}>
                        {stylist.rejectionReason}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        stylist.status
                      )}`}>
                      {stylist.status}
                    </span>
                    {stylist.suspensionReason && (
                      <div
                        className="text-xs text-gray-500 mt-1 max-w-xs truncate"
                        title={stylist.suspensionReason}>
                        {stylist.suspensionReason}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{stylist.totalProducts}</div>
                    <div className="text-xs text-gray-500">
                      {stylist.pendingApproval > 0 && (
                        <span className="text-amber-600">{stylist.pendingApproval} pending</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(stylist.totalRevenue)}
                    </div>
                    <div className="text-xs text-gray-500">{stylist.totalOrders} orders</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-900">{stylist.rating}</span>
                      <div className="text-amber-500">★</div>
                      <div className="text-xs text-gray-500">({stylist.reviewCount})</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewStylist(stylist)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="View Details">
                        <FiEye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditStylist(stylist)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="Edit Stylist">
                        <FiEdit size={16} />
                      </button>
                      {stylist.verificationStatus === "pending" && (
                        <>
                          <button
                            onClick={() => handleApproveStylist(stylist._id)}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Approve Stylist">
                            <FiCheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleRejectStylist(stylist)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Reject Stylist">
                            <FiXCircle size={16} />
                          </button>
                        </>
                      )}
                      {stylist.status === "active" ? (
                        <button
                          onClick={() => handleSuspendStylist(stylist)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Suspend Stylist">
                          <FiUserX size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivateStylist(stylist._id)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Activate Stylist">
                          <FiUserCheck size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteStylist(stylist._id)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        title="Delete Stylist">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {currentStylists.length === 0 && (
          <div className="text-center py-12">
            <FiUserCheck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No stylists found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filteredStylists.length === 0
                ? "No stylists match your current filters."
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstStylist + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastStylist, filteredStylists.length)}
                </span>{" "}
                of <span className="font-medium">{filteredStylists.length}</span> stylists
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border text-sm font-medium rounded-md ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}>
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stylist Detail Modal */}
      {showStylistModal && selectedStylist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Stylist Details</h3>
                <button
                  onClick={() => setShowStylistModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors">
                  <FiXCircle size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Stylist Header */}
                <div className="flex items-start gap-6">
                  <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    {selectedStylist.avatar ? (
                      <img
                        className="h-24 w-24 rounded-full object-cover"
                        src={selectedStylist.avatar}
                        alt={selectedStylist.name}
                      />
                    ) : (
                      <FiUserCheck className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-semibold text-gray-900">{selectedStylist.name}</h4>
                    <p className="text-gray-600 mt-1">{selectedStylist.company}</p>
                    <p className="text-gray-500">{selectedStylist.email}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getVerificationColor(
                          selectedStylist.verificationStatus
                        )}`}>
                        {selectedStylist.verificationStatus}
                      </span>
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                          selectedStylist.status
                        )}`}>
                        {selectedStylist.status}
                      </span>
                      {selectedStylist.canAddProducts && (
                        <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                          Can Add Products
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h5 className="font-semibold text-gray-900 mb-4">Business Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FiMapPin className="text-gray-400" size={16} />
                          <p className="text-sm font-medium text-gray-900">
                            {selectedStylist.businessInfo.location}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FiAward className="text-gray-400" size={16} />
                          <p className="text-sm font-medium text-gray-900">
                            {selectedStylist.businessInfo.experience}
                          </p>
                        </div>
                      </div>
                      {selectedStylist.businessInfo.phone && (
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedStylist.businessInfo.phone}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedStylist.businessInfo.description}
                      </p>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Specialties</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedStylist.businessInfo.specialties.map(
                        (specialty: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {specialty}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Website */}
                  {selectedStylist.businessInfo.website && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Website</p>
                      <a
                        href={selectedStylist.businessInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 break-all">
                        {selectedStylist.businessInfo.website}
                      </a>
                    </div>
                  )}
                </div>

                {/* Performance Metrics */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-4">Performance Metrics</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedStylist.totalProducts}
                      </div>
                      <p className="text-sm text-gray-600">Products</p>
                      {selectedStylist.pendingApproval > 0 && (
                        <p className="text-xs text-amber-600 mt-1">
                          {selectedStylist.pendingApproval} pending
                        </p>
                      )}
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedStylist.totalOrders}
                      </div>
                      <p className="text-sm text-gray-600">Orders</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(selectedStylist.totalRevenue)}
                      </div>
                      <p className="text-sm text-gray-600">Revenue</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-2xl font-bold text-gray-900">
                          {selectedStylist.rating}
                        </span>
                        <div className="text-amber-500">★</div>
                      </div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="text-xs text-gray-500">
                        ({selectedStylist.reviewCount} reviews)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Performance Details */}
                {selectedStylist.performance && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h5 className="font-semibold text-gray-900 mb-4">Service Performance</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedStylist.performance.completionRate}%
                        </div>
                        <p className="text-sm text-gray-600">Order Completion</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedStylist.performance.avgResponseTime}
                        </div>
                        <p className="text-sm text-gray-600">Avg Response Time</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-600">
                          {selectedStylist.performance.customerSatisfaction}
                        </div>
                        <p className="text-sm text-gray-600">Customer Satisfaction</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rejection/Suspension Reason */}
                {(selectedStylist.rejectionReason || selectedStylist.suspensionReason) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <FiAlertCircle className="text-red-500" size={20} />
                      <h5 className="font-medium text-red-800">
                        {selectedStylist.rejectionReason ? "Rejection Reason" : "Suspension Reason"}
                      </h5>
                    </div>
                    <p className="text-red-700 mt-1">
                      {selectedStylist.rejectionReason || selectedStylist.suspensionReason}
                    </p>
                  </div>
                )}

                {/* Account Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Account Information</h5>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Joined Date</dt>
                        <dd className="text-sm text-gray-900">
                          {formatDate(selectedStylist.joinedDate)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Last Login</dt>
                        <dd className="text-sm text-gray-900">
                          {formatDate(selectedStylist.lastLogin)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Email Verified</dt>
                        <dd className="text-sm">
                          {selectedStylist.isEmailVerified ? (
                            <span className="text-green-600">Verified</span>
                          ) : (
                            <span className="text-amber-600">Pending</span>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEditStylist(selectedStylist)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                    Edit Stylist
                  </button>
                  {selectedStylist.verificationStatus === "pending" && (
                    <button
                      onClick={() => {
                        handleApproveStylist(selectedStylist._id);
                        setShowStylistModal(false);
                      }}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                      Verify Stylist
                    </button>
                  )}
                  {selectedStylist.status === "active" ? (
                    <button
                      onClick={() => {
                        handleSuspendStylist(selectedStylist);
                        setShowStylistModal(false);
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                      Suspend Stylist
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleActivateStylist(selectedStylist._id);
                        setShowStylistModal(false);
                      }}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                      Activate Stylist
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suspension Modal */}
      {showSuspensionModal && selectedStylist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiAlertCircle className="text-red-500" size={24} />
                <h3 className="text-lg font-semibold text-gray-900">Suspend Stylist</h3>
              </div>

              <p className="text-gray-600 mb-4">
                Are you sure you want to suspend <strong>"{selectedStylist.name}"</strong>? Please
                provide a reason for suspension that will be shared with the stylist.
              </p>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="suspensionReason"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Suspension *
                  </label>
                  <textarea
                    id="suspensionReason"
                    rows={4}
                    value={suspensionReason}
                    onChange={(e) => setSuspensionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Explain why this stylist is being suspended. This feedback will help them understand what needs improvement."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 10 characters required</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (!suspensionReason.trim() || suspensionReason.trim().length < 10) {
                        alert("Please provide a suspension reason with at least 10 characters");
                        return;
                      }
                      setStylists(
                        stylists.map((s) =>
                          s._id === selectedStylist._id
                            ? {
                                ...s,
                                status: "suspended",
                                suspensionReason: suspensionReason,
                                canAddProducts: false,
                              }
                            : s
                        )
                      );
                      setShowSuspensionModal(false);
                      setSuspensionReason("");
                      setSelectedStylist(null);
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                    Confirm Suspension
                  </button>
                  <button
                    onClick={() => {
                      setShowSuspensionModal(false);
                      setSuspensionReason("");
                      setSelectedStylist(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StylistManagementPage;
