"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";

import StatCard from "./StatCard";
import FilterAndSearch from "./FilterAndSearch";
import CurrentUsersList from "./CurrentUsersList";
import Pagination from "./Pagination";
import ConfirmationModal from "./ConfirmationModal";
import { useGetAllUsersQuery } from "@/redux/services/UserApiSlice";
import SuspensionModal from "./SuspensionModel";
import UserDetailModal from "./UserDetailModel";

interface User {
  _id: string;
  firstName: string;
  surname: string;
  email: string;
  role: string;
  walletAmount: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  subscribedToNewsLetter?: boolean;
  company?: string | null;
}

const UserManagementPage = () => {
  const { user: currentUser } = useSelector((store: RootState) => store.authSlice);
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSuspensionModal, setShowSuspensionModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationConfig, setConfirmationConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
    type: "delete" as "delete" | "activate" | "suspend",
  });

  const { data, isLoading } = useGetAllUsersQuery({
    page: currentPage,
    limit: usersPerPage,
  });

  useEffect(() => {
    if (data?.users) {
      setUsers(data.users.users || []);
      setTotalUsers(data.users.totalUsers || 0);
      setTotalPages(data.users.pages || 1);
    }
  }, [data]);

  // Simple user data formatting for display
  const formatUserForDisplay = (user: User) => ({
    _id: user._id,
    name: `${user.firstName} ${user.surname}`,
    email: user.email,
    role: user.role,
    status: user.isVerified ? "active" : "inactive",
    walletAmount: user.walletAmount || 0,
    createdAt: user.createdAt,
    avatar: user.avatar,
    isVerified: user.isVerified,
    subscribedToNewsLetter: user.subscribedToNewsLetter,
    company: user.company,
  });

  // Filter users based on search and filters
  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        searchTerm === "" ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isVerified) ||
        (statusFilter === "inactive" && !user.isVerified);

      return matchesSearch && matchesStatus;
    })
    .map(formatUserForDisplay);

  // Handle user actions
  const handleViewUser = (user: any) => {
    const originalUser = users.find((u) => u._id === user._id);
    if (originalUser) {
      setSelectedUser(originalUser);
      setShowUserModal(true);
    }
  };

  const handleEditUser = (user: any) => {
    console.log("Edit user:", user);
  };

  const handleSuspendUser = (user: any) => {
    const originalUser = users.find((u) => u._id === user._id);
    if (originalUser) {
      setSelectedUser(originalUser);
      setShowSuspensionModal(true);
    }
  };

  const handleActivateUser = (userId: string) => {
    setUsers(users.map((u) => (u._id === userId ? { ...u, isVerified: true } : u)));
  };

  const confirmDeleteUser = (userId: string) => {
    setConfirmationConfig({
      title: "Delete User",
      message: "Are you sure you want to delete this user? This action cannot be undone.",
      onConfirm: () => {
        setUsers(users.filter((u) => u._id !== userId));
        setSelectedUsers(selectedUsers.filter((id) => id !== userId));
        setShowConfirmationModal(false);
      },
      type: "delete",
    });
    setShowConfirmationModal(true);
  };

  const confirmBulkDelete = () => {
    setConfirmationConfig({
      title: "Delete Users",
      message: `Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`,
      onConfirm: () => {
        setUsers(users.filter((u) => !selectedUsers.includes(u._id)));
        setSelectedUsers([]);
        setShowConfirmationModal(false);
      },
      type: "delete",
    });
    setShowConfirmationModal(true);
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) return;

    switch (action) {
      case "activate":
        setUsers(
          users.map((u) => (selectedUsers.includes(u._id) ? { ...u, isVerified: true } : u))
        );
        setSelectedUsers([]);
        break;
      case "suspend":
        setShowSuspensionModal(true);
        break;
      case "delete":
        confirmBulkDelete();
        break;
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map((user) => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleSuspendConfirm = (reason: string) => {
    if (selectedUser) {
      setUsers(users.map((u) => (u._id === selectedUser._id ? { ...u, isVerified: false } : u)));
      setShowSuspensionModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage and monitor all platform users</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:-translate-y-0.5">
              Export Users
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatCard users={users} />

      {/* Filters and Search */}
      <FilterAndSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        selectedUsers={selectedUsers}
        handleBulkAction={handleBulkAction}
      />

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-12">
                  <input
                    title="select all"
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedUsers.length === filteredUsers.length && filteredUsers.length > 0
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Wallet Balance
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Newsletter
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <CurrentUsersList
                  key={user._id}
                  user={user}
                  selectedUsers={selectedUsers}
                  handleSelectUser={handleSelectUser}
                  handleViewUser={handleViewUser}
                  handleEditUser={handleEditUser}
                  handleSuspendUser={handleSuspendUser}
                  handleActivateUser={handleActivateUser}
                  handleDeleteUser={confirmDeleteUser}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalUsers}
            itemsPerPage={usersPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Modals */}
      {showUserModal && selectedUser && (
        <UserDetailModal
          userId={selectedUser._id}
          onClose={() => setShowUserModal(false)}
          onEdit={handleEditUser}
          onSuspend={() => {
            const formattedUser = formatUserForDisplay(selectedUser);
            handleSuspendUser(formattedUser);
            setShowUserModal(false);
          }}
          onActivate={() => {
            handleActivateUser(selectedUser._id);
            setShowUserModal(false);
          }}
        />
      )}

      {showSuspensionModal && selectedUser && (
        <SuspensionModal
          user={selectedUser}
          onClose={() => setShowSuspensionModal(false)}
          onConfirm={handleSuspendConfirm}
        />
      )}

      {showConfirmationModal && (
        <ConfirmationModal
          config={confirmationConfig}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={confirmationConfig.onConfirm}
        />
      )}
    </div>
  );
};

export default UserManagementPage;
