import React, { useState } from "react";
import Image from "next/image";
import { FiPlus, FiTrash2, FiUpload } from "react-icons/fi";

interface PortfolioSectionProps {
  stylist: any;
  isEditing: boolean;
  handleAddPortfolioImage: (file: File, category: string) => void;
  handleRemovePortfolioImage: (imageId: string) => void;
  isUploading: boolean;
}

const PortfolioSection = ({
  stylist,
  isEditing,
  handleAddPortfolioImage,
  handleRemovePortfolioImage,
  isUploading,
}: PortfolioSectionProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !newCategory.trim()) return;

    setUploadingPortfolio(true);
    try {
      await handleAddPortfolioImage(file, newCategory.trim());
      setShowAddForm(false);
      setNewCategory("");
    } finally {
      setUploadingPortfolio(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Portfolio</h3>
        {isEditing && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors">
            <FiPlus size={16} />
            Add Image
          </button>
        )}
      </div>

      {isEditing && showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g., Bridal Hair, Party Makeup, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <label className="flex items-center gap-3 cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FiUpload className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {uploadingPortfolio ? "Uploading..." : "Choose an image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAddImage}
                  className="hidden"
                  disabled={uploadingPortfolio || !newCategory.trim()}
                />
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewCategory("");
                }}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                disabled={uploadingPortfolio}>
                Cancel
              </button>
              <div className="text-xs text-gray-500">Supported: JPG, PNG, WebP (Max 5MB)</div>
            </div>
          </div>
        </div>
      )}

      {stylist.portfolio && stylist.portfolio.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stylist.portfolio.map((item: any) => (
            <div key={item._id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.category}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <p className="text-sm font-medium truncate">{item.category}</p>
                  {isEditing && (
                    <button
                      onClick={() => handleRemovePortfolioImage(item._id)}
                      className="mt-2 flex items-center gap-1 text-xs text-red-300 hover:text-red-100"
                      disabled={isUploading}>
                      <FiTrash2 size={12} />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-300 text-4xl mb-3">📷</div>
          <p className="text-gray-500">No portfolio images yet</p>
          {isEditing && (
            <p className="text-sm text-gray-400 mt-1">Add images to showcase your work</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PortfolioSection;
