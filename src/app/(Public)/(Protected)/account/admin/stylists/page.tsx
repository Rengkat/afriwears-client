"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { toast } from "react-hot-toast";
import SuspensionModel from "./SuspensionModel";
import StylistDetailModel from "./StylistDetailModel";
import StylistTable from "./StylistTable";
import FilterSearch from "./FilterSearch";
import StatCard from "./StatCard";
import VerificationModel from "./VerificationModel";
import {
  useGetStylistsQuery,
  useVerifyStylistMutation,
  useDeleteStylistMutation,
  useUpdateStylistMutation,
  useSuspendStylistMutation,
} from "@/redux/services/StylistApiSlice";

const StylistManagementPage = () => {
  const { user } = useSelector((store: RootState) => store.authSlice);
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
  const [rejectionReason, setRejectionReason] = useState("");

  // API Queries & Mutations
  const {
    data: stylistsData,
    isLoading,
    refetch,
  } = useGetStylistsQuery({
    page: currentPage,
    limit: stylistsPerPage,
  });

  const [verifyStylist, { isLoading: isVerifying }] = useVerifyStylistMutation();
  const [deleteStylist, { isLoading: isDeleting }] = useDeleteStylistMutation();
  const [updateStylist, { isLoading: isUpdating }] = useUpdateStylistMutation();
  const [suspendStylist, { isLoading: isSuspending }] = useSuspendStylistMutation();
  const stylists = stylistsData?.stylists || [];
  const totalStylists = stylistsData?.total || 0;
  const totalPages = Math.ceil(totalStylists / stylistsPerPage);

  // Filter stylists based on search and filters
  const filteredStylists = stylists.filter((stylist: any) => {
    const matchesSearch =
      stylist.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stylist.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stylist.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || stylist.status === statusFilter;
    const matchesVerification =
      verificationFilter === "all" || stylist.verificationStatus === verificationFilter;

    return matchesSearch && matchesStatus && matchesVerification;
  });

  // Pagination
  const indexOfLastStylist = currentPage * stylistsPerPage;
  const indexOfFirstStylist = indexOfLastStylist - stylistsPerPage;
  const currentStylists = filteredStylists.slice(indexOfFirstStylist, indexOfLastStylist);

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

  const handleApproveStylist = async (stylistId: string) => {
    try {
      await verifyStylist({
        id: stylistId,
        action: "verify",
        rejectionReason: "",
      }).unwrap();
      toast.success("Stylist verified successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to verify stylist");
    }
  };

  const handleRejectStylist = async (stylist: any) => {
    if (!rejectionReason || rejectionReason.trim().length < 10) {
      toast.error("Please provide a rejection reason with at least 10 characters");
      return;
    }

    try {
      await verifyStylist({
        id: stylist._id,
        action: "reject",
        rejectionReason,
      }).unwrap();
      toast.success("Stylist rejected successfully");
      setRejectionReason("");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reject stylist");
    }
  };

  const handleSuspendStylist = (stylist: any) => {
    setSelectedStylist(stylist);
    setShowSuspensionModal(true);
  };

  // Update handleActivateStylist function
  const handleActivateStylist = async (stylistId: string) => {
    try {
      await suspendStylist({
        id: stylistId,
        action: "activate",
        suspensionReason: "",
      }).unwrap();
      toast.success("Stylist activated successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to activate stylist");
    }
  };

  const handleDeleteStylist = async (stylistId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this stylist? This will also remove all their products and orders."
      )
    ) {
      try {
        await deleteStylist(stylistId).unwrap();
        toast.success("Stylist deleted successfully");
        refetch();
        setSelectedStylists(selectedStylists.filter((id) => id !== stylistId));
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete stylist");
      }
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedStylists.length === 0) {
      toast.error("Please select stylists first");
      return;
    }

    try {
      switch (action) {
        case "verify":
          await Promise.all(
            selectedStylists.map(async (id) => {
              await verifyStylist({
                id,
                action: "verify",
                rejectionReason: "",
              }).unwrap();
            })
          );
          toast.success(`${selectedStylists.length} stylist(s) verified`);
          break;
        case "activate":
          await Promise.all(
            selectedStylists.map(async (id) => {
              await updateStylist({
                id,
                data: { status: "active", suspensionReason: "" },
              }).unwrap();
            })
          );
          toast.success(`${selectedStylists.length} stylist(s) activated`);
          break;
        case "suspend":
          await Promise.all(
            selectedStylists.map(async (id) => {
              await updateStylist({
                id,
                data: {
                  status: "suspended",
                  suspensionReason: "Bulk suspension - quality compliance review",
                },
              }).unwrap();
            })
          );
          toast.success(`${selectedStylists.length} stylist(s) suspended`);
          break;
        case "delete":
          if (
            window.confirm(
              `Are you sure you want to delete ${selectedStylists.length} stylists? This action cannot be undone.`
            )
          ) {
            await Promise.all(
              selectedStylists.map(async (id) => {
                await deleteStylist(id).unwrap();
              })
            );
            toast.success(`${selectedStylists.length} stylist(s) deleted`);
          }
          break;
      }
      setSelectedStylists([]);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to perform ${action} action`);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStylists(currentStylists.map((stylist: any) => stylist._id));
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
  const totalStylistsCount = totalStylists;
  const verifiedCount = stylists.filter((s: any) => s.verificationStatus === "verified").length;
  const pendingVerificationCount = stylists.filter(
    (s: any) => s.verificationStatus === "pending"
  ).length;
  const suspendedCount = stylists.filter((s: any) => s.status === "suspended").length;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stylists...</p>
        </div>
      </div>
    );
  }

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
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
              onClick={() => refetch()}>
              Refresh Data
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
        isLoading={isLoading || isVerifying || isDeleting || isUpdating}
      />

      {/* Stylist Detail Modal */}
      {showStylistModal && selectedStylist && (
        <StylistDetailModel
          handleEditStylist={handleEditStylist}
          setShowStylistModal={setShowStylistModal}
          selectedStylist={selectedStylist}
          handleSuspendStylist={handleSuspendStylist}
          handleActivateStylist={handleActivateStylist}
          handleApproveStylist={() => handleApproveStylist(selectedStylist._id)}
          handleRejectStylist={handleRejectStylist}
        />
      )}

      {/* Suspension Modal */}
      {showSuspensionModal && selectedStylist && (
        <SuspensionModel
          setShowSuspensionModal={setShowSuspensionModal}
          selectedStylist={selectedStylist}
          suspendStylist={suspendStylist}
          refetch={refetch}
          suspensionReason={suspensionReason}
          setSuspensionReason={setSuspensionReason}
          setSelectedStylist={setSelectedStylist}
        />
      )}

      {/* Rejection Modal (Modified VerificationModel) */}
      {showVerificationModal && selectedStylist && (
        <VerificationModel
          setShowVerificationModal={setShowVerificationModal}
          selectedStylist={selectedStylist}
          handleRejectStylist={() => handleRejectStylist(selectedStylist)}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
        />
      )}
    </div>
  );
};

export default StylistManagementPage;
