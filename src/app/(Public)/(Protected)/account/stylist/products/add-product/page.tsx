// Update your AddProductPage component
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiImage, FiX, FiChevronDown } from "react-icons/fi";
import LeftColumn from "./LeftColumn";
import RightColumn from "./RightColumn";
import FormActions from "./FormActions";
import Attributes from "./Attributes";

import { toast } from "react-hot-toast";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "@/redux/services/ProductApi";

const AddProductPage = () => {
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "" as "men" | "women" | "unisex" | "material" | "",
    type: "" as "native" | "corporate" | "casual" | "traditional" | "",
    description: "",
    stock: "",
    attributes: {
      color: "",
      size: "",
      material: "",
    },
    productDetails: "",
    materials: "",
    careInstructions: "",
    deliveryInfo: "",
    mainImage: null as File | null,
    subImages: [] as File[],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [subImagePreviews, setSubImagePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Update categories and types to match backend
  const categories = [
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "unisex", label: "Unisex" },
    { value: "material", label: "Material" },
  ];

  const types = {
    men: ["native", "corporate", "casual", "traditional"],
    women: ["native", "corporate", "casual", "traditional"],
    unisex: ["native", "corporate", "casual", "traditional"],
    material: ["native", "corporate", "casual", "traditional"],
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAttributeChange = (attr: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attr]: value,
      },
    }));
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, mainImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate total files (max 6 including existing)
    if (files.length + formData.subImages.length > 6) {
      toast.error("Maximum 6 additional images allowed");
      return;
    }

    // Validate file sizes
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error("Some images exceed 5MB limit");
      return;
    }

    if (files.length > 0) {
      const newSubImages = [...formData.subImages, ...files];
      setFormData((prev) => ({ ...prev, subImages: newSubImages }));

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSubImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeSubImage = (index: number) => {
    const newSubImages = [...formData.subImages];
    newSubImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, subImages: newSubImages }));

    const newPreviews = [...subImagePreviews];
    newPreviews.splice(index, 1);
    setSubImagePreviews(newPreviews);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await uploadProductImage(formData).unwrap();
      return response.imageUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
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

    try {
      setUploadProgress(10);

      // Upload main image
      const mainImageUrl = await uploadImage(formData.mainImage);
      setUploadProgress(40);

      // Upload sub images
      const subImageUrls: string[] = [];
      for (let i = 0; i < formData.subImages.length; i++) {
        const url = await uploadImage(formData.subImages[i]);
        subImageUrls.push(url);
        setUploadProgress(40 + (i / formData.subImages.length) * 30);
      }

      setUploadProgress(80);

      // Prepare product data
      const productData: CreateProductRequest = {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        type: formData.type,
        description: formData.description,
        stock: Number(formData.stock),
        mainImage: mainImageUrl,
        subImages: subImageUrls,
        attributes: Object.fromEntries(
          Object.entries(formData.attributes).filter(([_, value]) => value.trim() !== "")
        ),
        productDetails: formData.productDetails || undefined,
        materials: formData.materials || undefined,
        careInstructions: formData.careInstructions || undefined,
        deliveryInfo: formData.deliveryInfo || undefined,
      };

      // Create product
      await createProduct(productData).unwrap();
      setUploadProgress(100);

      toast.success("Product created successfully! Awaiting admin approval.");
      router.push("/stylist/products");
    } catch (error: any) {
      console.error("Product creation failed:", error);

      let errorMessage = "Failed to create product";
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.status === "FETCH_ERROR") {
        errorMessage = "Network error. Please check your connection.";
      }

      toast.error(errorMessage);
    } finally {
      setUploadProgress(0);
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

      {/* Upload Progress Bar */}
      {uploadProgress > 0 && (
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Uploading images...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-amber-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}></div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
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
          />
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

        {/* Additional Details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="productDetails"
              className="block text-sm font-medium text-gray-700 mb-1">
              Product Details
            </label>
            <textarea
              id="productDetails"
              name="productDetails"
              value={formData.productDetails}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="Additional product specifications..."
            />
          </div>

          <div>
            <label htmlFor="materials" className="block text-sm font-medium text-gray-700 mb-1">
              Materials
            </label>
            <input
              type="text"
              id="materials"
              name="materials"
              value={formData.materials}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="e.g., 100% Cotton, Silk blend"
            />
          </div>
        </div>

        {/* Care Instructions & Delivery Info */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="careInstructions"
              className="block text-sm font-medium text-gray-700 mb-1">
              Care Instructions
            </label>
            <textarea
              id="careInstructions"
              name="careInstructions"
              value={formData.careInstructions}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="How to care for this product..."
            />
          </div>

          <div>
            <label htmlFor="deliveryInfo" className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Information
            </label>
            <textarea
              id="deliveryInfo"
              name="deliveryInfo"
              value={formData.deliveryInfo}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="Delivery timelines and information..."
            />
          </div>
        </div>

        {/* Attributes */}
        <Attributes formData={formData} handleAttributeChange={handleAttributeChange} />

        {/* Form Actions */}
        <FormActions isSubmitting={isLoading || uploadProgress > 0} />
      </form>
    </div>
  );
};

export default AddProductPage;
