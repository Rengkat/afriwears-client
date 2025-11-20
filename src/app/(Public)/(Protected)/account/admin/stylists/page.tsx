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
import SuspensionModel from "./SuspensionModel";
import StylistDetailModel from "./StylistDetailModel";
import StylistTable from "./StylistTable";
import FilterSearch from "./FilterSearch";
import StatCard from "./StatCard";
import VerificationModel from "./VerificationModel";
import { mockStylists } from "@/Utils/mockData";

// Mock stylist data based on your schema

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
      <StatCard
        stylists={stylists}
        totalStylistsCount={totalStylistsCount}
        verifiedCount={verifiedCount}
        pendingVerificationCount={pendingVerificationCount}
        suspendedCount={suspendedCount}
      />
      {/* Filters and Search */}

      <FilterSearch
        setStatusFilter={setStatusFilter}
        handleBulkAction={handleBulkAction}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        selectedStylists={selectedStylists}
        verificationFilter={verificationFilter}
        setVerificationFilter={setVerificationFilter}
      />
      {/* Stylists Table */}
      <StylistTable
        handleSelectAll={handleSelectAll}
        handleSelectStylist={handleSelectStylist}
        selectedStylists={selectedStylists}
        currentStylists={currentStylists}
        filteredStylists={filteredStylists}
        indexOfLastStylist={indexOfLastStylist}
        indexOfFirstStylist={indexOfFirstStylist}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
        handleViewStylist={handleViewStylist}
        handleDeleteStylist={handleDeleteStylist}
        handleSuspendStylist={handleSuspendStylist}
        handleEditStylist={handleEditStylist}
        handleApproveStylist={handleApproveStylist}
        handleRejectStylist={handleRejectStylist}
        handleActivateStylist={handleActivateStylist}
      />

      {/* Stylist Detail Modal */}
      {showStylistModal && selectedStylist && (
        <StylistDetailModel
          handleVerifyStylist={handleVerifyStylist}
          handleEditStylist={handleEditStylist}
          setShowStylistModal={setShowStylistModal}
          selectedStylist={selectedStylist}
          handleSuspendStylist={handleSuspendStylist}
          handleActivateStylist={handleActivateStylist}
          handleApproveStylist={handleApproveStylist}
        />
      )}

      {/* Suspension Modal */}
      {showSuspensionModal && selectedStylist && (
        <SuspensionModel
          setShowSuspensionModal={setShowSuspensionModal}
          selectedStylist={selectedStylist}
          setStylists={setStylists}
          stylists={stylists}
          suspensionReason={suspensionReason}
          setSuspensionReason={setSuspensionReason}
          setSelectedStylist={setSelectedStylist}
        />
      )}
      {/* Verification Modal */}
      {showVerificationModal && selectedStylist && (
        <VerificationModel
          setShowVerificationModal={setShowVerificationModal}
          setStylists={setStylists}
          stylists={stylists}
          selectedStylist={selectedStylist}
          verificationNotes={verificationNotes}
          setVerificationNotes={setVerificationNotes}
        />
      )}
    </div>
  );
};

export default StylistManagementPage;
