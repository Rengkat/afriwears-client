import React from "react";
import { FiImage, FiPlus, FiX, FiUploadCloud } from "react-icons/fi";

const RightColumn = ({
  handleSubImagesChange,
  handleMainImageChange,
  imagePreview,
  setImagePreview,
  setFormData,
  subImagePreviews,
  removeSubImage,
  removeMainImage,
  isUploading = false,
}: any) => {
  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Main Image *</label>
        {imagePreview ? (
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Main product preview"
              className="h-48 w-full object-cover rounded-lg border border-gray-300"
            />
            <button
              title="Remove main image"
              type="button"
              onClick={removeMainImage}
              disabled={isUploading}
              className="absolute top-2 right-2 bg-white rounded-full p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <FiX size={18} />
            </button>
          </div>
        ) : (
          <label
            className={`flex flex-col items-center justify-center h-48 w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mb-3"></div>
                  <p className="mb-2 text-sm text-gray-500">Uploading...</p>
                </>
              ) : (
                <>
                  <FiImage className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">Click to upload main image</p>
                  <p className="text-xs text-gray-500">PNG, JPG (Max 5MB)</p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleMainImageChange}
              disabled={isUploading}
              required
            />
          </label>
        )}
      </div>

      {/* Sub Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Additional Images (Optional)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {subImagePreviews.map((preview: string, index: number) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Product preview ${index + 1}`}
                className="h-24 w-full object-cover rounded-lg border border-gray-300"
              />
              <button
                title="Remove image"
                type="button"
                onClick={() => removeSubImage(index)}
                disabled={isUploading}
                className="absolute top-1 right-1 bg-white rounded-full p-0.5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <FiX size={14} />
              </button>
            </div>
          ))}

          {/* Uploading indicator for sub images */}
          {isUploading && subImagePreviews.length < 6 && (
            <div className="flex items-center justify-center h-24 w-full border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center p-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600 mx-auto mb-1"></div>
                <p className="text-xs text-gray-500">Uploading...</p>
              </div>
            </div>
          )}

          {!isUploading && subImagePreviews.length < 6 && (
            <label className="flex items-center justify-center h-24 w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
              <div className="text-center p-2">
                <FiPlus className="mx-auto text-gray-400" />
                <p className="text-xs text-gray-500 mt-1">Add image</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleSubImagesChange}
                multiple
              />
            </label>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">{subImagePreviews.length}/6 images added</p>
      </div>

      {/* Upload Status */}
      {isUploading && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-amber-800 text-sm">
            <FiUploadCloud className="animate-pulse" />
            <span>Images are being uploaded to the server...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightColumn;
