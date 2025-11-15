import Image from "next/image";
import React from "react";
import { FiEdit, FiFacebook, FiInstagram, FiTwitter } from "react-icons/fi";

const ProfileCard = ({ profileData, isEditing, handleSave, setIsEditing }: any) => {
  return (
    <div className="w-full lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="relative -mt-16 px-6">
          <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white mx-auto">
            <Image src={profileData.avatar} alt={profileData.name} fill className="object-cover" />
          </div>
        </div>

        <div className="p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900">{profileData.name}</h2>
          <p className="text-sm text-gray-500">{profileData.company}</p>

          <div className="mt-4 flex justify-center gap-3">
            {profileData.socialMedia.twitter && (
              <a
                title="twitter"
                href={`https://twitter.com/${profileData.socialMedia.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400">
                <FiTwitter size={18} />
              </a>
            )}
            {profileData.socialMedia.facebook && (
              <a
                title="facebook"
                href={`https://facebook.com/${profileData.socialMedia.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600">
                <FiFacebook size={18} />
              </a>
            )}
            {profileData.socialMedia.instagram && (
              <a
                title="instagram"
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
  );
};

export default ProfileCard;
