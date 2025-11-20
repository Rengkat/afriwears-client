"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";

import { mockUsers } from "@/Utils/mockData";
import StatCard from "./StatCard";
import FilterAndSearch from "./FilterAndSearch";
import CurrentUsersList from "./CurrentUsersList";
import Pagination from "./Pagination";
import UserDetailModel from "./UserDetailModel";
import SuspensionModel from "./SuspensionModel";

// Mock user data based on your user schema

const UserManagementPage = () => {
  const { user } = useSelector((store: RootState) => store.authSlice);
  const [users, setUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showSuspensionModal, setShowSuspensionModal] = useState(false);

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handle user actions
  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    // Navigate to edit page or open edit modal
    console.log("Edit user:", user);
  };

  const handleSuspendUser = (user: any) => {
    setSelectedUser(user);
    setShowSuspensionModal(true);
  };

  const handleActivateUser = (userId: string) => {
    setUsers(
      users.map((u) => (u._id === userId ? { ...u, status: "active", suspensionReason: "" } : u))
    );
  };

  const handleDeleteUser = (userId: string) => {
    if (
      window.confirm("Are you sure you want to delete this user? This action cannot be undone.")
    ) {
      setUsers(users.filter((u) => u._id !== userId));
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) return;

    switch (action) {
      case "activate":
        setUsers(
          users.map((u) =>
            selectedUsers.includes(u._id) ? { ...u, status: "active", suspensionReason: "" } : u
          )
        );
        break;
      case "suspend":
        // In a real app, you'd show a modal for suspension reason
        setUsers(
          users.map((u) =>
            selectedUsers.includes(u._id)
              ? { ...u, status: "suspended", suspensionReason: "Bulk suspension" }
              : u
          )
        );
        break;
      case "delete":
        if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
          setUsers(users.filter((u) => !selectedUsers.includes(u._id)));
          setSelectedUsers([]);
        }
        break;
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(currentUsers.map((user) => user._id));
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
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors">
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
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        selectedUsers={selectedUsers}
        handleBulkAction={handleBulkAction}
      />
      {/* Users Table */}
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
                      selectedUsers.length === currentUsers.length && currentUsers.length > 0
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wallet Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => {
                return (
                  <CurrentUsersList
                    key={user._id}
                    user={user}
                    selectedUsers={selectedUsers}
                    handleSelectUser={handleSelectUser}
                    handleViewUser={handleViewUser}
                    handleEditUser={handleEditUser}
                    handleSuspendUser={handleSuspendUser}
                    handleActivateUser={handleActivateUser}
                    handleDeleteUser={handleDeleteUser}
                  />
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            indexOfFirstUser={indexOfFirstUser}
            indexOfLastUser={indexOfLastUser}
            filteredUsers={filteredUsers}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        )}
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <UserDetailModel
          setShowUserModal={setShowUserModal}
          selectedUser={selectedUser}
          handleEditUser={handleEditUser}
          handleSuspendUser={handleSuspendUser}
          handleActivateUser={handleActivateUser}
        />
      )}

      {/* Suspension Modal */}
      {showSuspensionModal && selectedUser && (
        <SuspensionModel
          setShowSuspensionModal={setShowSuspensionModal}
          selectedUser={selectedUser}
        />
      )}
    </div>
  );
};

export default UserManagementPage;
