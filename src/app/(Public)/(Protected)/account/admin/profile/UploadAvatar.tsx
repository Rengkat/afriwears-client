import React from "react";
import { FiTrash2, FiUpload, FiUser } from "react-icons/fi";

const UploadAvatar = ({
  handleRemoveAvatar,
  handleSaveAvatar,
  admin,
  avatarPreview,
  setAvatarPreview,
  setShowAvatarModal,
  setAvatarFile,
  isUploading,
}: any) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Profile Picture</h3>

          <div className="text-center mb-6">
            <div className="h-32 w-32 mx-auto rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar preview" className="h-32 w-32 object-cover" />
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
  );
};

export default UploadAvatar;
