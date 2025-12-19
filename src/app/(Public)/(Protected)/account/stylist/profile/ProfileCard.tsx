import Image from "next/image";
import React, { useState } from "react";
import { FiEdit, FiFacebook, FiInstagram, FiTwitter, FiUpload, FiUser } from "react-icons/fi";

interface ProfileCardProps {
  stylist: any;
  isEditing: boolean;
  isUploading: boolean;
  handleSave: () => void;
  handleAvatarUpload: (file: File) => void;
  setIsEditing: (editing: boolean) => void;
}

const ProfileCard = ({
  stylist,
  isEditing,
  isUploading,
  handleSave,
  handleAvatarUpload,
  setIsEditing,
}: ProfileCardProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [localAvatarError, setLocalAvatarError] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Reset error state
      setLocalAvatarError(false);

      // Validate file type and size
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image file (JPEG, PNG, GIF, WebP)");
        return;
      }

      if (file.size > maxSize) {
        alert("Image size should be less than 5MB");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      handleAvatarUpload(file);
    }
  };

  const handleAvatarError = () => {
    setLocalAvatarError(true);
  };

  const displayAvatar = () => {
    // Use preview if available during upload
    if (avatarPreview) {
      return avatarPreview;
    }

    // If there's an avatar URL but it failed to load, show placeholder
    if (stylist.avatar && !localAvatarError) {
      return stylist.avatar;
    }

    // Return null to show placeholder
    return null;
  };

  const avatarUrl = displayAvatar();

  return (
    <div className="w-full lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 relative">
        {/* Avatar Container - Positioned absolutely to overlap the top */}
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-20">
          <div className="relative h-36 w-36 rounded-full overflow-hidden border-4 border-white shadow-xl group">
            {/* Avatar Image with Fallback */}
            {avatarUrl ? (
              <div className="relative w-full h-full">
                <Image
                  src={avatarUrl}
                  alt={stylist.companyName || "Stylist"}
                  fill
                  className="object-cover"
                  style={{
                    // This positions the image to show more of the top
                    objectPosition: "center 25%",
                  }}
                  onError={handleAvatarError}
                  priority={true}
                  sizes="144px"
                />
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                {stylist.companyName ? (
                  <span className="text-amber-600 text-4xl font-bold">
                    {stylist.companyName.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <FiUser className="text-amber-600 text-4xl" />
                )}
              </div>
            )}
            {/* Upload Overlay */}
            {isEditing && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer text-white text-center p-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={isUploading}
                  />
                  <div className="flex flex-col items-center">
                    <FiUpload size={24} className="mx-auto mb-1" />
                    <span className="text-xs font-medium">
                      {isUploading ? "Uploading..." : "Change Photo"}
                    </span>
                    {isUploading && (
                      <div className="mt-1">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>
        {/* Main content area - Add padding top to make room for avatar */}
        <div className="pt-20 pb-6 px-6 text-center">
          <h2 className="text-xl font-bold text-gray-900">
            {stylist.companyName || "No Company Name"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {stylist.specialty || "No specialty specified"}
          </p>

          {/* Rating */}
          <div className="mt-3 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-lg ${
                  i < Math.floor(stylist.rating || 0) ? "text-amber-500" : "text-gray-300"
                }`}>
                ★
              </span>
            ))}
            <span className="text-sm text-gray-600 ml-1">
              ({stylist.rating?.toFixed(1) || "0.0"})
            </span>
          </div>

          {/* Reviews */}
          <p className="text-xs text-gray-500 mt-1">
            {stylist.reviews || 0} {stylist.reviews === 1 ? "review" : "reviews"}
          </p>

          {/* Social Media */}
          <div className="mt-4 flex justify-center gap-3">
            {stylist.socialMedia?.twitter && (
              <a
                title="twitter"
                href={`https://twitter.com/${stylist.socialMedia.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors">
                <FiTwitter size={18} />
              </a>
            )}
            {stylist.socialMedia?.facebook && (
              <a
                title="facebook"
                href={`https://facebook.com/${stylist.socialMedia.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors">
                <FiFacebook size={18} />
              </a>
            )}
            {stylist.socialMedia?.instagram && (
              <a
                title="instagram"
                href={`https://instagram.com/${stylist.socialMedia.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-600 transition-colors">
                <FiInstagram size={18} />
              </a>
            )}
          </div>
        </div>
        <div className="border-t border-gray-100 p-4">
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed transition-colors">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <FiEdit size={16} />
                {isEditing ? "Save Changes" : "Edit Profile"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
