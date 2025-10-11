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
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative -mt-16 px-6">
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white mx-auto">
                <Image
                  src={profileData.avatar}
                  alt={profileData.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="p-6 text-center">
              <h2 className="text-xl font-bold text-gray-900">{profileData.name}</h2>
              <p className="text-sm text-gray-500">{profileData.company}</p>

              <div className="mt-4 flex justify-center gap-3">
                {profileData.socialMedia.twitter && (
                  <a
                    href={`https://twitter.com/${profileData.socialMedia.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400">
                    <FiTwitter size={18} />
                  </a>
                )}
                {profileData.socialMedia.facebook && (
                  <a
                    href={`https://facebook.com/${profileData.socialMedia.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600">
                    <FiFacebook size={18} />
                  </a>
                )}
                {profileData.socialMedia.instagram && (
                  <a
                    href={`https://instagram.com/${profileData.socialMedia.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-pink-600">
                    <FiInstagram size={18} />
                  </a>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 p-4">
              <button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700">
                <FiEdit size={16} />
                {isEditing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-lg text-gray-800">Profile Information</h2>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* About Section */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">About</h3>
                  {isEditing ? (
                    <textarea
                      name="description"
                      value={profileData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    />
                  ) : (
                    <p className="text-gray-700">{profileData.description}</p>
                  )}
                </div>

                {/* Specialty & Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Specialty</h3>
                    {isEditing ? (
                      <input
                        type="text"
                        name="specialty"
                        value={profileData.specialty}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                      />
                    ) : (
                      <p className="text-gray-700">{profileData.specialty}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Experience</h3>
                    {isEditing ? (
                      <input
                        type="text"
                        name="experience"
                        value={profileData.experience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                      />
                    ) : (
                      <p className="text-gray-700">{profileData.experience}</p>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FiMail className="text-gray-400" />
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                        />
                      ) : (
                        <p className="text-gray-700">{profileData.email}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <FiPhone className="text-gray-400" />
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                        />
                      ) : (
                        <p className="text-gray-700">{profileData.phone}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <FiGlobe className="text-gray-400" />
                      {isEditing ? (
                        <input
                          type="url"
                          name="website"
                          value={profileData.website}
                          onChange={handleInputChange}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                        />
                      ) : (
                        <p className="text-gray-700">
                          <a
                            href={profileData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-600 hover:text-amber-700">
                            {profileData.website}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Location</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FiMapPin className="text-gray-400" />
                      {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
                          <input
                            type="text"
                            value={profileData.location.address}
                            onChange={(e) => handleLocationChange("address", e.target.value)}
                            placeholder="Address"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                          />
                          <input
                            type="text"
                            value={profileData.location.city}
                            onChange={(e) => handleLocationChange("city", e.target.value)}
                            placeholder="City"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                          />
                          <input
                            type="text"
                            value={profileData.location.state}
                            onChange={(e) => handleLocationChange("state", e.target.value)}
                            placeholder="State"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                      ) : (
                        <p className="text-gray-700">
                          {profileData.location.address}, {profileData.location.city},{" "}
                          {profileData.location.state}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                {isEditing && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Social Media</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <FiTwitter className="text-gray-400" />
                        <input
                          type="text"
                          value={profileData.socialMedia.twitter || ""}
                          onChange={(e) => handleSocialMediaChange("twitter", e.target.value)}
                          placeholder="Twitter username"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <FiFacebook className="text-gray-400" />
                        <input
                          type="text"
                          value={profileData.socialMedia.facebook || ""}
                          onChange={(e) => handleSocialMediaChange("facebook", e.target.value)}
                          placeholder="Facebook username"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <FiInstagram className="text-gray-400" />
                        <input
                          type="text"
                          value={profileData.socialMedia.instagram || ""}
                          onChange={(e) => handleSocialMediaChange("instagram", e.target.value)}
                          placeholder="Instagram username"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StylistProfilePage;
