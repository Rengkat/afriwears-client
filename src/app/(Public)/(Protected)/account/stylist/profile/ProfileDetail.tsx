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
  FiCheck,
} from "react-icons/fi";

interface ProfileDetailProps {
  stylist: any;
  isEditing: boolean;
  formData: {
    specialty: string[];
    description: string;
    experience: string;
    services: string[];
    phone: string;
    email: string;
    website: string;
    cacCertificateNumber: string;
    socialMedia: {
      twitter: string;
      facebook: string;
      instagram: string;
      pinterest: string;
    };
    location: {
      state: string;
      lga: string;
      address: string;
      branches: number;
    };
  };
  documents: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSpecialtyChange: (specialty: string) => void;
  handleServicesChange: (servicesString: string) => void;
  handleSocialMediaChange: (platform: string, value: string) => void;
  handleLocationChange: (field: string, value: string | number) => void;
  handleDocumentUpload: (documentType: string, file: File) => void;
  isUploading: boolean;
  validSpecialties: string[];
}

const ProfileDetail = ({
  stylist,
  isEditing,
  formData,
  documents,
  handleSpecialtyChange,
  handleSocialMediaChange,
  handleInputChange,
  handleLocationChange,
  handleDocumentUpload,
  isUploading,
  validSpecialties = ["Traditional", "Corporate", "Casual Wear", "Bridal", "Formal Wear"],
}: ProfileDetailProps) => {
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

        {/* Specialty - Updated for Array */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Specialties</h3>
          {isEditing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {validSpecialties.map((specialty) => (
                  <div key={specialty} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`specialty-${specialty}`}
                      checked={formData.specialty?.includes(specialty) || false}
                      onChange={() => handleSpecialtyChange(specialty)}
                      disabled={isUploading}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`specialty-${specialty}`}
                      className="ml-2 text-sm text-gray-700 cursor-pointer">
                      {specialty}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Selected: {formData.specialty?.length || 0}/3 specialties
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {formData.specialty && formData.specialty.length > 0 ? (
                formData.specialty.map((spec, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                    {spec}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No specialties selected</p>
              )}
            </div>
          )}
        </div>

        {/* Experience */}
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

        {/* Social Media - Only show in edit mode */}
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
