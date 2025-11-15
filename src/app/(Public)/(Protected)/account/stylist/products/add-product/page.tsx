"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiImage, FiX, FiChevronDown } from "react-icons/fi";
import LeftColumn from "./LeftColumn";
import RightColumn from "./RightColumn";
import FormActions from "./FormActions";
import Attributes from "./Attributes";

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
            required
          />
        </div>

        {/* Attributes */}
        <Attributes formData={formData} handleAttributeChange={handleAttributeChange} />
        {/* Form Actions */}
        <FormActions isSubmitting={isSubmitting} />
      </form>
    </div>
  );
};

export default AddProductPage;
