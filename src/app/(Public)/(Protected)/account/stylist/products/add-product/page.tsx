"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiImage, FiX, FiChevronDown, FiStar, FiAward, FiTrendingUp } from "react-icons/fi";
import LeftColumn from "./LeftColumn";
import RightColumn from "./RightColumn";
import FormActions from "./FormActions";
import CareAndInstruction from "./CareAndInstruction";
import AdditionalDetails from "./AdditionalDetails";
import { categories, types } from "@/Utils/utils";
import { toast } from "react-hot-toast";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductImageMutation,
} from "@/redux/services/ProductApi";
import { CreateProductRequest } from "@/Utils/Types";
import { useSelector } from "react-redux";
import ProductFlags from "./ProductFlags";
import { colorPalette, materialOptions, sizeOptions } from "@/Utils/colorPilatte";

const AddProductPage = () => {
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [uploadProductImage, { isLoading: isUploading }] = useUploadProductImageMutation();
  const [deleteProductImage] = useDeleteProductImageMutation();
  const { user: localUser } = useSelector((store: any) => store.authSlice);

  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    minPrice: "",
    maxPrice: "",
    category: "" as "men" | "women" | "unisex" | "material" | "",
    type: "" as "native" | "corporate" | "casual" | "traditional" | "",
    description: "",
    stock: "",

    // Product flags
    featured: false,
    isBestSeller: false,
    isNewProduct: false,

    attributes: {
      colors: [] as Array<{ name: string; hexCode: string }>,
      sizes: [] as string[],
      material: "",
    },

    // Other details
    productDetails: "",
    careInstructions: "",
    deliveryInfo: "",

    // Images
    mainImage: "",
    subImages: [] as string[],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [subImagePreviews, setSubImagePreviews] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState<string[]>([]);
  const [colorSearch, setColorSearch] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [showMaterialPicker, setShowMaterialPicker] = useState(false);
  const [customSize, setCustomSize] = useState("");
  const [customMaterial, setCustomMaterial] = useState("");

  const filteredColors = colorPalette.filter(
    (color) =>
      color.name.toLowerCase().includes(colorSearch.toLowerCase()) ||
      color.hexCode.toLowerCase().includes(colorSearch.toLowerCase()),
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle multiple color selection
  const handleColorSelect = (color: { name: string; hexCode: string }) => {
    const isSelected = formData.attributes.colors.some((c) => c.hexCode === color.hexCode);

    if (isSelected) {
      // Remove color if already selected
      setFormData((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          colors: prev.attributes.colors.filter((c) => c.hexCode !== color.hexCode),
        },
      }));
    } else {
      // Add color if not selected
      setFormData((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          colors: [...prev.attributes.colors, color],
        },
      }));
    }
  };

  const handleAddCustomColor = (hexCode: string) => {
    if (/^#[0-9A-F]{6}$/i.test(hexCode)) {
      const customColor = { name: "Custom", hexCode };
      const isSelected = formData.attributes.colors.some((c) => c.hexCode === hexCode);

      if (!isSelected) {
        setFormData((prev) => ({
          ...prev,
          attributes: {
            ...prev.attributes,
            colors: [...prev.attributes.colors, customColor],
          },
        }));
      }
      setShowColorPicker(false);
    }
  };

  const removeColor = (hexCode: string) => {
    setFormData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        colors: prev.attributes.colors.filter((c) => c.hexCode !== hexCode),
      },
    }));
  };

  // Handle multiple size selection
  const handleSizeSelect = (size: string) => {
    const isSelected = formData.attributes.sizes.includes(size);

    if (isSelected) {
      // Remove size if already selected
      setFormData((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          sizes: prev.attributes.sizes.filter((s) => s !== size),
        },
      }));
    } else {
      // Add size if not selected
      setFormData((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          sizes: [...prev.attributes.sizes, size],
        },
      }));
    }
  };

  const addCustomSize = () => {
    if (customSize.trim() && !formData.attributes.sizes.includes(customSize.trim())) {
      setFormData((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          sizes: [...prev.attributes.sizes, customSize.trim()],
        },
      }));
      setCustomSize("");
    }
  };

  const removeSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        sizes: prev.attributes.sizes.filter((s) => s !== size),
      },
    }));
  };

  // Handle single material selection
  const handleMaterialSelect = (material: string) => {
    setFormData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        material: material,
      },
    }));
    setShowMaterialPicker(false);
  };

  const addCustomMaterial = () => {
    if (customMaterial.trim()) {
      setFormData((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          material: customMaterial.trim(),
        },
      }));
      setCustomMaterial("");
      setShowMaterialPicker(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const response = await uploadProductImage(file).unwrap();
      return response.imageUrl;
    } catch (error: any) {
      console.error("Image upload failed:", error);
      throw new Error(error?.data?.message || "Failed to upload image");
    }
  };

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        setUploadingImages((prev) => [...prev, "mainImage"]);
        const imageUrl = await uploadImage(file);
        setFormData((prev) => ({ ...prev, mainImage: imageUrl }));
        toast.success("Main image uploaded successfully");
      } catch (error) {
        toast.error("Failed to upload main image");
        setImagePreview(null);
      } finally {
        setUploadingImages((prev) => prev.filter((img) => img !== "mainImage"));
      }
    }
  };

  const handleSubImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + formData.subImages.length > 6) {
      toast.error("Maximum 6 additional images allowed");
      return;
    }

    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error("Some images exceed 5MB limit");
      return;
    }

    if (files.length > 0) {
      const newPreviews: string[] = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          setSubImagePreviews((prev) => [...prev, ...newPreviews]);
        };
        reader.readAsDataURL(file);
      });

      try {
        setUploadingImages((prev) => [...prev, ...files.map((_, index) => `subImage-${index}`)]);

        const uploadPromises = files.map((file) => uploadImage(file));
        const uploadedUrls = await Promise.all(uploadPromises);

        setFormData((prev) => ({
          ...prev,
          subImages: [...prev.subImages, ...uploadedUrls],
        }));

        toast.success(`${files.length} images uploaded successfully`);
      } catch (error) {
        toast.error("Failed to upload some images");
        setSubImagePreviews((prev) => prev.slice(0, -files.length));
      } finally {
        setUploadingImages((prev) => prev.filter((img) => !img.startsWith("subImage-")));
      }
    }
  };

  const removeSubImage = async (index: number) => {
    const imageUrlToDelete = formData.subImages[index];

    const newPreviews = [...subImagePreviews];
    newPreviews.splice(index, 1);
    setSubImagePreviews(newPreviews);

    const newSubImages = [...formData.subImages];
    newSubImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, subImages: newSubImages }));

    if (imageUrlToDelete && imageUrlToDelete.includes("cdn.sanity.io")) {
      try {
        await deleteProductImage(imageUrlToDelete).unwrap();
      } catch (error) {
        console.error("Failed to delete image from Sanity:", error);
      }
    }
  };

  const removeMainImage = async () => {
    const imageUrlToDelete = formData.mainImage;
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, mainImage: "" }));

    if (imageUrlToDelete && imageUrlToDelete.includes("cdn.sanity.io")) {
      try {
        await deleteProductImage(imageUrlToDelete).unwrap();
      } catch (error) {
        console.error("Failed to delete main image from Sanity:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      !formData.type ||
      !formData.description ||
      !formData.stock ||
      !formData.mainImage
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (uploadingImages.length > 0) {
      toast.error("Please wait for all images to finish uploading");
      return;
    }

    try {
      const productData: CreateProductRequest = {
        name: formData.name,
        price: Number(formData.price),
        minPrice: formData.minPrice ? Number(formData.minPrice) : Number(formData.price),
        maxPrice: formData.maxPrice ? Number(formData.maxPrice) : Number(formData.price),
        category: formData.category,
        type: formData.type,
        description: formData.description,
        stock: Number(formData.stock),

        // Include the flags
        featured: formData.featured,
        isBestSeller: formData.isBestSeller,
        isNewProduct: formData.isNewProduct,

        // Include attributes
        attributes: {
          colors: formData.attributes.colors.length > 0 ? formData.attributes.colors : undefined,
          sizes: formData.attributes.sizes.length > 0 ? formData.attributes.sizes : undefined,
          material: formData.attributes.material || undefined,
        },

        mainImage: formData.mainImage,
        subImages: formData.subImages,
        productDetails: formData.productDetails || undefined,
        careInstructions: formData.careInstructions || undefined,
        deliveryInfo: formData.deliveryInfo || undefined,
        status: "draft",

        ...(localUser?.company?.id && { stylist: localUser.company.id }),
        ...(localUser?.company?.companyName && { stylistName: localUser.company.companyName }),
      };

      if (
        !productData.attributes?.colors?.length &&
        !productData.attributes?.sizes?.length &&
        !productData.attributes?.material
      ) {
        delete productData.attributes;
      }

      await createProduct(productData).unwrap();

      toast.success("Product created successfully! Awaiting admin approval.");
      router.push("/account/stylist/products");
    } catch (error: any) {
      console.error("Product creation failed:", error);
      let errorMessage = "Failed to create product";
      if (error?.data?.message) {
        errorMessage = error.data.message;
      }
      toast.error(errorMessage);
    }
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

      {uploadingImages.length > 0 && (
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
            <span>Uploading {uploadingImages.length} image(s)...</span>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
        {/* PRODUCT FLAGS */}
        <ProductFlags formData={formData} handleInputChange={handleInputChange} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <LeftColumn
            formData={formData}
            handleInputChange={handleInputChange}
            categories={categories}
            types={types}
          />

          {/* Right Column */}
          <RightColumn
            handleSubImagesChange={handleSubImagesChange}
            handleMainImageChange={handleMainImageChange}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            setFormData={setFormData}
            subImagePreviews={subImagePreviews}
            removeSubImage={removeSubImage}
            removeMainImage={removeMainImage}
            isUploading={uploadingImages.length > 0}
          />
        </div>

        {/* ATTRIBUTES SECTION */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Attributes (Optional)</h3>

          {/* Multiple Colors Selection */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Available Colors (Select multiple)
              </label>
              <span className="text-xs text-gray-500">
                {formData.attributes.colors.length} selected
              </span>
            </div>

            {/* Selected Colors Display */}
            {formData.attributes.colors.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.attributes.colors.map((color, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.hexCode }}
                      />
                      <span className="text-sm text-gray-700">{color.name}</span>
                      <button
                        title="remove color"
                        type="button"
                        onClick={() => removeColor(color.hexCode)}
                        className="text-gray-400 hover:text-red-600">
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left bg-white hover:border-amber-500 transition-colors flex items-center justify-between">
                <span className="text-gray-500">
                  {formData.attributes.colors.length > 0
                    ? "Add more colors..."
                    : "Click to select colors"}
                </span>
                <FiChevronDown
                  className={`transition-transform ${showColorPicker ? "rotate-180" : ""}`}
                />
              </button>

              {showColorPicker && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Search colors..."
                      value={colorSearch}
                      onChange={(e) => setColorSearch(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-6 gap-2 max-h-60 overflow-y-auto">
                    {filteredColors.map((color, index) => {
                      const isSelected = formData.attributes.colors.some(
                        (c) => c.hexCode === color.hexCode,
                      );
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleColorSelect(color)}
                          className={`flex flex-col items-center p-1 rounded ${
                            isSelected ? "bg-amber-50 ring-1 ring-amber-500" : "hover:bg-gray-100"
                          }`}
                          title={`${color.name} - ${color.hexCode}`}>
                          <div
                            className={`w-8 h-8 rounded-full border ${
                              isSelected ? "border-amber-500" : "border-gray-300"
                            }`}
                            style={{ backgroundColor: color.hexCode }}
                          />
                          <span className="text-xs mt-1 truncate w-full text-center">
                            {color.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Color Input */}
                  <div className="mt-4 pt-4 border-t">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Add custom color:
                    </label>
                    <div className="flex gap-2">
                      <input
                        title="color"
                        type="color"
                        className="w-10 h-10 cursor-pointer rounded"
                        onChange={(e) => handleAddCustomColor(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="#FFFFFF"
                        pattern="^#[0-9A-F]{6}$"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                        onBlur={(e) => {
                          if (e.target.value && /^#[0-9A-F]{6}$/i.test(e.target.value)) {
                            handleAddCustomColor(e.target.value);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sizes and Material */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Multiple Sizes Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Sizes (Select multiple)
              </label>

              {/* Selected Sizes Display */}
              {formData.attributes.sizes.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.attributes.sizes.map((sizeValue, index) => {
                      // Find the size object to get the label
                      const sizeObj = sizeOptions.find((s) => s.value === sizeValue);
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-200">
                          <span className="text-sm font-medium">
                            {sizeObj ? sizeObj.label : sizeValue}
                          </span>
                          <button
                            title="remove size"
                            type="button"
                            onClick={() => removeSize(sizeValue)}
                            className="text-amber-600 hover:text-amber-800">
                            <FiX size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSizePicker(!showSizePicker)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left bg-white hover:border-amber-500 transition-colors flex items-center justify-between">
                  <span className="text-gray-500">
                    {formData.attributes.sizes.length > 0
                      ? "Add more sizes..."
                      : "Click to select sizes"}
                  </span>
                  <FiChevronDown
                    className={`transition-transform ${showSizePicker ? "rotate-180" : ""}`}
                  />
                </button>

                {showSizePicker && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {sizeOptions.map((size, index) => {
                        const isSelected = formData.attributes.sizes.includes(size.value);
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleSizeSelect(size.value)}
                            className={`px-3 py-2 text-sm rounded border ${
                              isSelected
                                ? "bg-amber-600 text-white border-amber-600"
                                : "bg-white text-gray-700 border-gray-300 hover:border-amber-500"
                            }`}>
                            {size.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Size Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Custom size (e.g., 10, 12)"
                        value={customSize}
                        onChange={(e) => setCustomSize(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={addCustomSize}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Material Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>

              {/* Selected Material Display */}
              {formData.attributes.material && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200">
                    <span className="text-sm font-medium">{formData.attributes.material}</span>
                    <button
                      title="materialBtn"
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          attributes: { ...prev.attributes, material: "" },
                        }))
                      }
                      className="text-green-600 hover:text-green-800">
                      <FiX size={14} />
                    </button>
                  </div>
                </div>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMaterialPicker(!showMaterialPicker)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left bg-white hover:border-amber-500 transition-colors flex items-center justify-between">
                  <span className="text-gray-500">
                    {formData.attributes.material || "Select material"}
                  </span>
                  <FiChevronDown
                    className={`transition-transform ${showMaterialPicker ? "rotate-180" : ""}`}
                  />
                </button>

                {showMaterialPicker && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {materialOptions.map((material, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleMaterialSelect(material)}
                          className={`px-3 py-2 text-sm rounded border ${
                            formData.attributes.material === material
                              ? "bg-amber-600 text-white border-amber-600"
                              : "bg-white text-gray-700 border-gray-300 hover:border-amber-500"
                          }`}>
                          {material}
                        </button>
                      ))}
                    </div>

                    {/* Custom Material Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Custom material"
                        value={customMaterial}
                        onChange={(e) => setCustomMaterial(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={addCustomMaterial}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                        Add
                      </button>
                    </div>
                  </div>
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
            placeholder="Describe your product in detail..."
            required
          />
        </div>

        {/* Additional Details - REMOVED materials field from here */}
        <AdditionalDetails formData={formData} handleInputChange={handleInputChange} />

        {/* Care Instructions & Delivery Info */}
        <CareAndInstruction formData={formData} handleInputChange={handleInputChange} />

        {/* Form Actions */}
        <FormActions
          isSubmitting={isLoading || uploadingImages.length > 0}
          submitText={uploadingImages.length > 0 ? "Uploading Images..." : "Create Product"}
        />
      </form>
    </div>
  );
};

export default AddProductPage;
