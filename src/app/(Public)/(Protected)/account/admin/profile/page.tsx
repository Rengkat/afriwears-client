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
import SideBar from "./SideBar";
import ProfileInfor from "./ProfileInfor";
import Security from "./Security";
import Notification from "./Notification";
import UploadAvatar from "./UploadAvatar";

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
        <SideBar
          admin={admin}
          handleAvatarChange={handleAvatarChange}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Profile Information Tab */}
            {activeTab === "profile" && (
              <ProfileInfor
                setIsEditing={setIsEditing}
                isEditing={isEditing}
                handleSaveProfile={handleSaveProfile}
                profileForm={profileForm}
                handleProfileChange={handleProfileChange}
                admin={admin}
              />
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <Security
                securityForm={securityForm}
                handleSecurityChange={handleSecurityChange}
                handleUpdatePassword={handleUpdatePassword}
                handleToggle2FA={handleToggle2FA}
                admin={admin}
              />
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <Notification
                notificationForm={notificationForm}
                handleSaveNotifications={handleSaveNotifications}
                handleNotificationChange={handleNotificationChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      {showAvatarModal && (
        <UploadAvatar
          handleRemoveAvatar={handleRemoveAvatar}
          handleSaveAvatar={handleSaveAvatar}
          admin={admin}
          avatarPreview={avatarPreview}
          setAvatarPreview={setAvatarPreview}
          setShowAvatarModal={setShowAvatarModal}
          setAvatarFile={setAvatarFile}
          isUploading={isUploading}
        />
      )}
    </div>
  );
};

export default AdminProfilePage;
