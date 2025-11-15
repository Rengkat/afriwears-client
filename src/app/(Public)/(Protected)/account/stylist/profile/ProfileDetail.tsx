import React from "react";
import {
  FiFacebook,
  FiGlobe,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiPhone,
  FiTwitter,
} from "react-icons/fi";

const ProfileDetail = ({
  isEditing,
  profileData,
  handleSocialMediaChange,
  handleInputChange,
  handleLocationChange,
}: any) => {
  return (
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
                  title="description"
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
                    title="specialty"
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
                    title="experiance"
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
                      title="email"
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
                      title="phone"
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
                      title="website"
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
  );
};

export default ProfileDetail;
