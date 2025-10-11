"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiImage, FiX, FiChevronDown } from "react-icons/fi";

const AddProductPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    type: "",
    description: "",
    stock: "",
    attributes: {
      color: "",
      size: "",
      material: "",
    },
    mainImage: null,
    subImages: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [subImagePreviews, setSubImagePreviews] = useState([]);

  const categories = ["Clothing", "Accessories", "Footwear", "Bags", "Jewelry"];
  const types = {
    Clothing: ["Dress", "Top", "Bottom", "Outerwear", "Traditional"],
    Accessories: ["Hat", "Scarf", "Belt", "Tie"],
    Footwear: ["Shoes", "Sandals", "Slippers"],
    Bags: ["Handbag", "Backpack", "Clutch"],
    Jewelry: ["Necklace", "Bracelet", "Earrings", "Ring"],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAttributeChange = (attr, value) => {
    setFormData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attr]: value,
      },
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, mainImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newSubImages = [...formData.subImages, ...files];
      setFormData((prev) => ({ ...prev, subImages: newSubImages }));

      const readers = files.map((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSubImagePreviews((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
        return reader;
      });
    }
  };

  const removeSubImage = (index) => {
    const newSubImages = [...formData.subImages];
    newSubImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, subImages: newSubImages }));

    const newPreviews = [...subImagePreviews];
    newPreviews.splice(index, 1);
    setSubImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      !formData.type ||
      !formData.description ||
      !formData.mainImage
    ) {
      alert("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // In a real app, you would upload images and submit the form data to your API
    console.log("Submitting product:", formData);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    router.push("/stylist/products");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FiPlus />
          Add New Product
        </h1>
        <p className="text-gray-600 mt-1">Fill in the details of your new product</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (₦) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 pr-8"
                  required>
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiChevronDown />
                </div>
              </div>
            </div>

            {/* Type */}
            {formData.category && (
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <div className="relative">
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 pr-8"
                    required>
                    <option value="">Select a type</option>
                    {types[formData.category]?.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FiChevronDown />
                  </div>
                </div>
              </div>
            )}

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* Right Column */}
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
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData((prev) => ({ ...prev, mainImage: null }));
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    <FiX size={18} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-48 w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiImage className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">Click to upload main image</p>
                    <p className="text-xs text-gray-500">PNG, JPG (Max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleMainImageChange}
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
                {subImagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Product preview ${index + 1}`}
                      className="h-24 w-full object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeSubImage(index)}
                      className="absolute top-1 right-1 bg-white rounded-full p-0.5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <FiX size={14} />
                    </button>
                  </div>
                ))}

                {subImagePreviews.length < 6 && (
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
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
            required
          />
        </div>

        {/* Attributes */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Attributes (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="color" className="block text-xs font-medium text-gray-500 mb-1">
                Color
              </label>
              <input
                type="text"
                id="color"
                value={formData.attributes.color}
                onChange={(e) => handleAttributeChange("color", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g. Red, Blue"
              />
            </div>

            <div>
              <label htmlFor="size" className="block text-xs font-medium text-gray-500 mb-1">
                Size
              </label>
              <input
                type="text"
                id="size"
                value={formData.attributes.size}
                onChange={(e) => handleAttributeChange("size", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g. S, M, L"
              />
            </div>

            <div>
              <label htmlFor="material" className="block text-xs font-medium text-gray-500 mb-1">
                Material
              </label>
              <input
                type="text"
                id="material"
                value={formData.attributes.material}
                onChange={(e) => handleAttributeChange("material", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g. Cotton, Silk"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/stylist/products")}
            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:bg-amber-400 disabled:cursor-not-allowed flex items-center gap-2">
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
