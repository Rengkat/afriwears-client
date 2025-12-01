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
  useDeleteProductImageMutation,
} from "@/redux/services/ProductApi";
import { CreateProductRequest } from "@/Utils/Types";
import CareAndInstruction from "./CareAndInstruction";
import AdditionalDetails from "./AdditionalDetails";
import { categories, types } from "@/Utils/utils";
import { useSelector } from "react-redux";

const AddProductPage = () => {
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [uploadProductImage, { isLoading: isUploading }] = useUploadProductImageMutation();
  const [deleteProductImage] = useDeleteProductImageMutation();
  const { user: localUser } = useSelector((store: RootState) => store.authSlice);
  // console.log(localUser);

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
    attributes: {
      color: "",
      size: "",
      material: "",
    },
    productDetails: "",
    materials: "",
    careInstructions: "",
    deliveryInfo: "",
    mainImage: "",
    subImages: [] as string[],
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [subImagePreviews, setSubImagePreviews] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState<string[]>([]); // Track uploading images

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
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload image immediately
      try {
        setUploadingImages((prev) => [...prev, "mainImage"]);
        const imageUrl = await uploadImage(file);

        // Update formData with the URL
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
      // Create previews first
      const newPreviews: string[] = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          setSubImagePreviews((prev) => [...prev, ...newPreviews]);
        };
        reader.readAsDataURL(file);
      });

      // Upload all images
      try {
        setUploadingImages((prev) => [...prev, ...files.map((_, index) => `subImage-${index}`)]);

        const uploadPromises = files.map((file) => uploadImage(file));
        const uploadedUrls = await Promise.all(uploadPromises);

        // Update formData with all URLs
        setFormData((prev) => ({
          ...prev,
          subImages: [...prev.subImages, ...uploadedUrls],
        }));

        toast.success(`${files.length} images uploaded successfully`);
      } catch (error) {
        toast.error("Failed to upload some images");
        // Remove the previews if upload failed
        setSubImagePreviews((prev) => prev.slice(0, -files.length));
      } finally {
        setUploadingImages((prev) => prev.filter((img) => !img.startsWith("subImage-")));
      }
    }
  };

  const removeSubImage = async (index: number) => {
    const imageUrlToDelete = formData.subImages[index];

    // Remove from previews immediately
    const newPreviews = [...subImagePreviews];
    newPreviews.splice(index, 1);
    setSubImagePreviews(newPreviews);

    // Remove from formData immediately
    const newSubImages = [...formData.subImages];
    newSubImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, subImages: newSubImages }));

    // Delete from Sanity in background
    if (imageUrlToDelete && imageUrlToDelete.includes("cdn.sanity.io")) {
      try {
        await deleteProductImage(imageUrlToDelete).unwrap();
        console.log("Image deleted from Sanity:", imageUrlToDelete);
      } catch (error) {
        console.error("Failed to delete image from Sanity:", error);
        // Don't show error to user since we've already removed it locally
      }
    }
  };

  const removeMainImage = async () => {
    const imageUrlToDelete = formData.mainImage;

    // Remove immediately
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, mainImage: "" }));

    // Delete from Sanity in background
    if (imageUrlToDelete && imageUrlToDelete.includes("cdn.sanity.io")) {
      try {
        await deleteProductImage(imageUrlToDelete).unwrap();
        console.log("Main image deleted from Sanity:", imageUrlToDelete);
      } catch (error) {
        console.error("Failed to delete main image from Sanity:", error);
      }
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

    // Check if any images are still uploading
    if (uploadingImages.length > 0) {
      toast.error("Please wait for all images to finish uploading");
      return;
    }

    try {
      // Prepare product data - images are already URLs
      const productData: CreateProductRequest = {
        name: formData.name,
        price: Number(formData.price),
        minPrice: Number(formData.price),
        maxPrice: Number(formData.price),
        category: formData.category,
        type: formData.type,
        description: formData.description,
        stock: Number(formData.stock),
        mainImage: formData.mainImage,
        subImages: formData.subImages,
        attributes: Object.fromEntries(
          Object.entries(formData.attributes).filter(([_, value]) => value.trim() !== "")
        ),
        productDetails: formData.productDetails || undefined,
        materials: formData.materials || undefined,
        careInstructions: formData.careInstructions || undefined,
        deliveryInfo: formData.deliveryInfo || undefined,
        status: "draft",

        ...(localUser?.company?.id && { stylist: localUser.company.id }),
        ...(localUser?.company?.companyName && { stylistName: localUser.company.companyName }),
      };
      // Remove empty optional fields
      Object.keys(productData).forEach((key) => {
        if (productData[key as keyof CreateProductRequest] === undefined) {
          delete productData[key as keyof CreateProductRequest];
        }
      });

      // console.log("Submitting product:", productData);
      await createProduct(productData).unwrap();

      toast.success("Product created successfully! Awaiting admin approval.");
      router.push("/account/stylist/products");
    } catch (error: any) {
      console.error("Product creation failed:", error);

      let errorMessage = "Failed to create product";
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.status === "FETCH_ERROR") {
        errorMessage = "Network error. Please check your connection.";
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

      {/* Uploading Status */}
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
        <AdditionalDetails formData={formData} handleInputChange={handleInputChange} />
        {/* Care Instructions & Delivery Info */}
        <CareAndInstruction formData={formData} handleInputChange={handleInputChange} />
        {/* Attributes */}
        <Attributes formData={formData} handleAttributeChange={handleAttributeChange} />

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
