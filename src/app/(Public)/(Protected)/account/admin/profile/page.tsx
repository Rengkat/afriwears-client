"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import Image from "next/image";
import {
  FiUser,
  FiMail,
  FiLock,
  FiBell,
  FiShield,
  FiCamera,
  FiSave,
  FiEdit,
  FiX,
  FiCheck,
  FiUpload,
  FiTrash2,
} from "react-icons/fi";

// Mock admin data
const mockAdmin = {
  _id: "admin1",
  name: "Admin User",
  email: "admin@fashionapp.com",
  avatar: "/admin-avatar.jpg",
  role: "Super Administrator",
  phone: "+2348012345678",
  department: "Platform Management",
  joinDate: "2023-01-15T00:00:00Z",
  lastLogin: "2024-03-20T14:25:00Z",
  isEmailVerified: true,
  isPhoneVerified: true,
  notifications: {
    email: {
      securityAlerts: true,
      systemUpdates: true,
      newUsers: true,
      orderAlerts: false,
    },
    push: {
      criticalAlerts: true,
      systemMaintenance: true,
    },
  },
  security: {
    twoFactorEnabled: true,
    lastPasswordChange: "2024-02-15T00:00:00Z",
    loginHistory: [
      {
        id: 1,
        device: "Chrome on Windows",
        location: "Lagos, Nigeria",
        ip: "192.168.1.1",
        time: "2024-03-20T14:25:00Z",
        status: "success",
      },
      {
        id: 2,
        device: "Safari on iPhone",
        location: "Lagos, Nigeria",
        ip: "192.168.1.2",
        time: "2024-03-19T09:15:00Z",
        status: "success",
      },
    ],
  },
};

const AdminProfilePage = () => {
  const { user } = useSelector((store: RootState) => store.authSlice);
  const [admin, setAdmin] = useState(mockAdmin);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: admin.name,
    email: admin.email,
    phone: admin.phone,
    department: admin.department,
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: admin.security.twoFactorEnabled,
  });

  const [notificationForm, setNotificationForm] = useState(admin.notifications);

  // Initialize forms when admin data changes
  useEffect(() => {
    setProfileForm({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      department: admin.department,
    });
    setSecurityForm((prev) => ({
      ...prev,
      twoFactorEnabled: admin.security.twoFactorEnabled,
    }));
    setNotificationForm(admin.notifications);
  }, [admin]);

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle security form changes
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle notification changes
  const handleNotificationChange = (category: string, type: string, checked: boolean) => {
    setNotificationForm((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [type]: checked,
      },
    }));
  };

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("Image size should be less than 5MB");
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setShowAvatarModal(true);
    }
  };

  // Save avatar
  const handleSaveAvatar = async () => {
    if (!avatarFile) return;

    setIsUploading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update admin data with new avatar
      setAdmin((prev) => ({
        ...prev,
        avatar: avatarPreview,
      }));

      setShowAvatarModal(false);
      setAvatarFile(null);
      setAvatarPreview("");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Failed to upload avatar. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Remove avatar
  const handleRemoveAvatar = () => {
    setAdmin((prev) => ({
      ...prev,
      avatar: "",
    }));
  };

  // Save profile
  const handleSaveProfile = async () => {
    try {
      // Validate form
      if (!profileForm.name.trim()) {
        alert("Name is required");
        return;
      }

      if (!profileForm.email.trim()) {
        alert("Email is required");
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAdmin((prev) => ({
        ...prev,
        ...profileForm,
      }));

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    try {
      // Validate form
      if (!securityForm.currentPassword) {
        alert("Current password is required");
        return;
      }

      if (!securityForm.newPassword) {
        alert("New password is required");
        return;
      }

      if (securityForm.newPassword.length < 8) {
        alert("New password must be at least 8 characters long");
        return;
      }

      if (securityForm.newPassword !== securityForm.confirmPassword) {
        alert("New passwords do not match");
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSecurityForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        twoFactorEnabled: securityForm.twoFactorEnabled,
      });

      alert("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password. Please try again.");
    }
  };

  // Toggle two-factor authentication
  const handleToggle2FA = async () => {
    try {
      const new2FAStatus = !securityForm.twoFactorEnabled;

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSecurityForm((prev) => ({
        ...prev,
        twoFactorEnabled: new2FAStatus,
      }));

      setAdmin((prev) => ({
        ...prev,
        security: {
          ...prev.security,
          twoFactorEnabled: new2FAStatus,
        },
      }));

      alert(`Two-factor authentication ${new2FAStatus ? "enabled" : "disabled"} successfully!`);
    } catch (error) {
      console.error("Error updating 2FA:", error);
      alert("Failed to update two-factor authentication. Please try again.");
    }
  };

  // Save notifications
  const handleSaveNotifications = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAdmin((prev) => ({
        ...prev,
        notifications: notificationForm,
      }));

      alert("Notification preferences updated successfully!");
    } catch (error) {
      console.error("Error updating notifications:", error);
      alert("Failed to update notification preferences. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Profile Summary */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    {admin.avatar ? (
                      <Image
                        src={admin.avatar}
                        alt={admin.name}
                        width={64}
                        height={64}
                        className="h-16 w-16 object-cover"
                      />
                    ) : (
                      <FiUser className="h-8 w-8 text-blue-600" />
                    )}
                  </div>
                  <button
                    onClick={() => document.getElementById("avatar-upload")?.click()}
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiCamera className="text-white" size={20} />
                  </button>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{admin.name}</h3>
                  <p className="text-blue-600 text-sm font-medium">{admin.role}</p>
                  <p className="text-gray-500 text-sm">{admin.department}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-2">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === "profile"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}>
                    <FiUser
                      className={`${activeTab === "profile" ? "text-blue-500" : "text-gray-400"}`}
                      size={20}
                    />
                    <span className="font-medium">Profile Information</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === "security"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}>
                    <FiShield
                      className={`${activeTab === "security" ? "text-blue-500" : "text-gray-400"}`}
                      size={20}
                    />
                    <span className="font-medium">Security</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("notifications")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === "notifications"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}>
                    <FiBell
                      className={`${
                        activeTab === "notifications" ? "text-blue-500" : "text-gray-400"
                      }`}
                      size={20}
                    />
                    <span className="font-medium">Notifications</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
            <h4 className="font-semibold text-gray-900 mb-4">Account Information</h4>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-500">Member Since</dt>
                <dd className="text-sm font-medium text-gray-900">{formatDate(admin.joinDate)}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Last Login</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {formatDateTime(admin.lastLogin)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Email Verification</dt>
                <dd className="text-sm">
                  {admin.isEmailVerified ? (
                    <span className="text-green-600 font-medium">Verified</span>
                  ) : (
                    <span className="text-amber-600 font-medium">Pending</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Phone Verification</dt>
                <dd className="text-sm">
                  {admin.isPhoneVerified ? (
                    <span className="text-green-600 font-medium">Verified</span>
                  ) : (
                    <span className="text-amber-600 font-medium">Pending</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Profile Information Tab */}
            {activeTab === "profile" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                          <FiX size={16} />
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                          <FiSave size={16} />
                          Save Changes
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                        <FiEdit size={16} />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={profileForm.name}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={profileForm.phone}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="department"
                          className="block text-sm font-medium text-gray-700 mb-2">
                          Department
                        </label>
                        <input
                          type="text"
                          id="department"
                          name="department"
                          value={profileForm.department}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Role Information (Read-only) */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Role Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Role</p>
                          <p className="text-sm font-medium text-gray-900">{admin.role}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Permissions</p>
                          <p className="text-sm font-medium text-gray-900">Full Platform Access</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>

                <div className="space-y-8">
                  {/* Password Update */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label
                          htmlFor="currentPassword"
                          className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password *
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={securityForm.currentPassword}
                          onChange={handleSecurityChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter current password"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="newPassword"
                          className="block text-sm font-medium text-gray-700 mb-2">
                          New Password *
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={securityForm.newPassword}
                          onChange={handleSecurityChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter new password"
                          required
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Password must be at least 8 characters long and include a mix of letters,
                          numbers, and symbols.
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password *
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={securityForm.confirmPassword}
                          onChange={handleSecurityChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Confirm new password"
                          required
                        />
                      </div>

                      <button
                        onClick={handleUpdatePassword}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Two-Factor Authentication
                    </h3>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">
                          {securityForm.twoFactorEnabled
                            ? "Enabled - Extra security for your account"
                            : "Disabled - Add an extra layer of security"}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securityForm.twoFactorEnabled}
                          onChange={handleToggle2FA}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Login History */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Recent Login Activity
                    </h3>
                    <div className="space-y-3">
                      {admin.security.loginHistory.map((login) => (
                        <div
                          key={login.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-2 w-2 rounded-full ${
                                login.status === "success" ? "bg-green-500" : "bg-red-500"
                              }`}></div>
                            <div>
                              <p className="font-medium text-gray-900">{login.device}</p>
                              <p className="text-sm text-gray-600">
                                {login.location} • {login.ip}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {formatDateTime(login.time)}
                            </p>
                            <p
                              className={`text-xs ${
                                login.status === "success" ? "text-green-600" : "text-red-600"
                              }`}>
                              {login.status === "success" ? "Successful" : "Failed"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
                      View Full Login History
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                  <button
                    onClick={handleSaveNotifications}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                    <FiSave size={16} />
                    Save Preferences
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Email Notifications */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Security Alerts</p>
                          <p className="text-sm text-gray-600">
                            Important security notifications and alerts
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationForm.email.securityAlerts}
                            onChange={(e) =>
                              handleNotificationChange("email", "securityAlerts", e.target.checked)
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">System Updates</p>
                          <p className="text-sm text-gray-600">
                            Platform updates and maintenance notices
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationForm.email.systemUpdates}
                            onChange={(e) =>
                              handleNotificationChange("email", "systemUpdates", e.target.checked)
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">New User Registrations</p>
                          <p className="text-sm text-gray-600">
                            Notifications when new users join the platform
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationForm.email.newUsers}
                            onChange={(e) =>
                              handleNotificationChange("email", "newUsers", e.target.checked)
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Order Alerts</p>
                          <p className="text-sm text-gray-600">
                            High-value or problematic order notifications
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationForm.email.orderAlerts}
                            onChange={(e) =>
                              handleNotificationChange("email", "orderAlerts", e.target.checked)
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Critical Alerts</p>
                          <p className="text-sm text-gray-600">
                            Urgent system alerts requiring immediate attention
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationForm.push.criticalAlerts}
                            onChange={(e) =>
                              handleNotificationChange("push", "criticalAlerts", e.target.checked)
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">System Maintenance</p>
                          <p className="text-sm text-gray-600">
                            Notifications about scheduled system maintenance
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationForm.push.systemMaintenance}
                            onChange={(e) =>
                              handleNotificationChange(
                                "push",
                                "systemMaintenance",
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Profile Picture</h3>

              <div className="text-center mb-6">
                <div className="h-32 w-32 mx-auto rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-32 w-32 object-cover"
                    />
                  ) : (
                    <FiUser className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-gray-600">Preview of your new profile picture</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAvatarModal(false);
                    setAvatarFile(null);
                    setAvatarPreview("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isUploading}>
                  Cancel
                </button>
                <button
                  onClick={handleSaveAvatar}
                  disabled={isUploading}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FiUpload size={16} />
                      Upload Picture
                    </>
                  )}
                </button>
              </div>

              {!admin.avatar && (
                <div className="mt-4 text-center">
                  <button
                    onClick={handleRemoveAvatar}
                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1 mx-auto">
                    <FiTrash2 size={14} />
                    Remove current avatar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfilePage;
