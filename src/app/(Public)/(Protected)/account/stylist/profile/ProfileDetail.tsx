import React, { useState } from "react";
import { FaPinterest } from "react-icons/fa";
import {
  FiFacebook,
  FiGlobe,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiPhone,
  FiTwitter,
  FiFileText,
} from "react-icons/fi";

const ProfileDetail = ({
  stylist,
  isEditing,
  formData,
  documents,
  handleSocialMediaChange,
  handleInputChange,
  handleLocationChange,
  handleDocumentUpload,
  isUploading,
}: any) => {
  const [documentUploading, setDocumentUploading] = useState<string | null>(null);

  const handleDocumentChange = async (documentType: string, file: File) => {
    setDocumentUploading(documentType);
    await handleDocumentUpload(documentType, file);
    setDocumentUploading(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-lg text-gray-800">Profile Information</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* About Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">About</h3>
          {isEditing ? (
            <textarea
              title="description"
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="Describe your company and services..."
            />
          ) : (
            <p className="text-gray-700">{formData.description || "No description provided"}</p>
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
                value={formData.specialty || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g., Bridal Makeup, Hair Coloring"
              />
            ) : (
              <p className="text-gray-700">{formData.specialty || "Not specified"}</p>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Experience</h3>
            {isEditing ? (
              <input
                title="experience"
                type="text"
                name="experience"
                value={formData.experience || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g., 5 years"
              />
            ) : (
              <p className="text-gray-700">{formData.experience || "Not specified"}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FiMail className="text-gray-400 flex-shrink-0" />
              {isEditing ? (
                <input
                  title="email"
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                  placeholder="company@email.com"
                />
              ) : (
                <p className="text-gray-700">{formData.email || "Not provided"}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <FiPhone className="text-gray-400 flex-shrink-0" />
              {isEditing ? (
                <input
                  title="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                  placeholder="+234 800 000 0000"
                />
              ) : (
                <p className="text-gray-700">{formData.phone || "Not provided"}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <FiGlobe className="text-gray-400 flex-shrink-0" />
              {isEditing ? (
                <input
                  title="website"
                  type="url"
                  name="website"
                  value={formData.website || ""}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                  placeholder="https://example.com"
                />
              ) : (
                <p className="text-gray-700">
                  {formData.website ? (
                    <a
                      href={formData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:text-amber-700 underline">
                      {formData.website}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">Location</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FiMapPin className="text-gray-400 mt-2 flex-shrink-0" />
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">State</label>
                    <input
                      type="text"
                      value={formData.location?.state || ""}
                      onChange={(e) => handleLocationChange("state", e.target.value)}
                      placeholder="State"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">LGA</label>
                    <input
                      type="text"
                      value={formData.location?.lga || ""}
                      onChange={(e) => handleLocationChange("lga", e.target.value)}
                      placeholder="Local Government Area"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Address</label>
                    <input
                      type="text"
                      value={formData.location?.address || ""}
                      onChange={(e) => handleLocationChange("address", e.target.value)}
                      placeholder="Full address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Branches</label>
                    <input
                      title="location"
                      type="number"
                      min="1"
                      value={formData.location?.branches || 1}
                      onChange={(e) => handleLocationChange("branches", parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <p className="text-gray-700">
                    {[formData.location?.address, formData.location?.lga, formData.location?.state]
                      .filter(Boolean)
                      .join(", ") || "Location not specified"}
                  </p>
                  {formData.location?.branches > 1 && (
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.location.branches} branch
                      {formData.location.branches > 1 ? "es" : ""}
                    </p>
                  )}
                </div>
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
                <FiTwitter className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={formData.socialMedia?.twitter || ""}
                  onChange={(e) => handleSocialMediaChange("twitter", e.target.value)}
                  placeholder="@username"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <FiFacebook className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={formData.socialMedia?.facebook || ""}
                  onChange={(e) => handleSocialMediaChange("facebook", e.target.value)}
                  placeholder="username or page"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <FiInstagram className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={formData.socialMedia?.instagram || ""}
                  onChange={(e) => handleSocialMediaChange("instagram", e.target.value)}
                  placeholder="@username"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <FaPinterest className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={formData.socialMedia?.pinterest || ""}
                  onChange={(e) => handleSocialMediaChange("pinterest", e.target.value)}
                  placeholder="username"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* CAC Information - Only show if editing or has CAC number */}
        {(isEditing || formData.cacCertificateNumber) && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Business Registration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">CAC Certificate Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="cacCertificateNumber"
                    value={formData.cacCertificateNumber || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    placeholder="RC-123456"
                  />
                ) : (
                  <p className="text-gray-700">{formData.cacCertificateNumber || "Not provided"}</p>
                )}
              </div>

              {/* Document Uploads */}
              {isEditing && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">CAC Certificate</label>
                    <div className="flex items-center gap-3">
                      <FiFileText className="text-gray-400" />
                      <input
                        title="document"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleDocumentChange("cacCertificate", file);
                        }}
                        className="flex-1"
                        disabled={isUploading || documentUploading === "cacCertificate"}
                      />
                      {documentUploading === "cacCertificate" && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Business Registration
                    </label>
                    <div className="flex items-center gap-3">
                      <FiFileText className="text-gray-400" />
                      <input
                        title="registration doc"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleDocumentChange("businessRegistration", file);
                        }}
                        className="flex-1"
                        disabled={isUploading || documentUploading === "businessRegistration"}
                      />
                      {documentUploading === "businessRegistration" && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Tax Certificate</label>
                    <div className="flex items-center gap-3">
                      <FiFileText className="text-gray-400" />
                      <input
                        title="tax certificate"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleDocumentChange("taxCertificate", file);
                        }}
                        className="flex-1"
                        disabled={isUploading || documentUploading === "taxCertificate"}
                      />
                      {documentUploading === "taxCertificate" && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetail;
