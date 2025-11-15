"use client";
import { useState } from "react";
import Image from "next/image";
import {
  FiEdit,
  FiMapPin,
  FiPhone,
  FiMail,
  FiGlobe,
  FiTwitter,
  FiFacebook,
  FiInstagram,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import ProfileCard from "./ProfileCard";
import ProfileDetail from "./ProfileDetail";

// Mock data for stylist profile
const mockStylist = {
  name: "Amina Couture",
  email: "amina@couture.com",
  phone: "+234 801 234 5678",
  company: "Amina Couture Designs",
  description:
    "Specializing in modern African fashion with a contemporary twist. We create unique, high-quality garments that celebrate African heritage.",
  specialty: "African Fusion Wear",
  experience: "5 years",
  location: {
    address: "25 Fashion Avenue, Victoria Island",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
  },
  socialMedia: {
    twitter: "aminacouture",
    facebook: "aminacouture",
    instagram: "aminacouture",
  },
  website: "www.aminacouture.com",
  avatar: "/stylist-avatar.jpg",
  banner: "/stylist-banner.jpg",
};

const StylistProfilePage = () => {
  const { user } = useSelector((store: RootState) => store.authSlice);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(mockStylist);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setProfileData((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }));
  };

  const handleLocationChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    // In a real app, you would call an API to save the changes
    setIsEditing(false);
    console.log("Profile updated:", profileData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner */}
      <div className="relative h-48 w-full rounded-xl overflow-hidden mb-6">
        <Image src={profileData.banner} alt="Stylist banner" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Profile Card */}
        <ProfileCard
          profileData={profileData}
          isEditing={isEditing}
          handleSave={handleSave}
          setIsEditing={setIsEditing}
        />
        {/* Profile Details */}
        <ProfileDetail
          isEditing={isEditing}
          profileData={profileData}
          handleSocialMediaChange={handleSocialMediaChange}
          handleInputChange={handleInputChange}
          handleLocationChange={handleLocationChange}
        />
      </div>
    </div>
  );
};

export default StylistProfilePage;
