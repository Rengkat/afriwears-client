"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import ProfileCard from "./ProfileCard";
import ProfileDetail from "./ProfileDetail";
import VerificationSection from "./VerificationSection";
import PortfolioSection from "./PortfolioSection";
import { toast } from "react-hot-toast";
import {
  useGetMyStylistProfileQuery,
  useUpdateMyStylistProfileMutation,
  useUploadStylistAvatarMutation,
  useUploadStylistBannerMutation,
  useAddPortfolioImageMutation,
  useRemovePortfolioImageMutation,
  useUploadStylistDocumentMutation,
} from "@/redux/services/StylistApiSlice";

// Valid specialty options
const VALID_SPECIALTIES = ["Traditional", "Corporate", "Casual Wear", "Bridal", "Formal Wear"];

const StylistProfilePage = () => {
  const { user: localUser } = useSelector((store: RootState) => store.authSlice);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch stylist profile
  const {
    data: profileData,
    isLoading,
    isError,
    refetch,
  } = useGetMyStylistProfileQuery(undefined, {
    skip: !localUser?.company?.id,
  });

  // Mutations
  const [updateProfile, { isLoading: isUpdating }] = useUpdateMyStylistProfileMutation();
  const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadStylistAvatarMutation();
  const [uploadBanner, { isLoading: isUploadingBanner }] = useUploadStylistBannerMutation();
  const [addPortfolioImage] = useAddPortfolioImageMutation();
  const [removePortfolioImage] = useRemovePortfolioImageMutation();
  const [uploadDocument] = useUploadStylistDocumentMutation();

  // Local state for editing
  const [formData, setFormData] = useState({
    companyName: "",
    description: "",
    specialty: [] as string[], // Changed from string to array
    experience: "",
    services: [] as string[],
    phone: "",
    email: "",
    website: "",
    cacCertificateNumber: "",
    socialMedia: {
      twitter: "",
      facebook: "",
      instagram: "",
      pinterest: "",
    },
    location: {
      state: "",
      lga: "",
      address: "",
      branches: 1,
    },
  });

  // Documents state
  const [documents, setDocuments] = useState({
    cacCertificate: "",
    businessRegistration: "",
    taxCertificate: "",
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profileData?.stylist) {
      const stylist = profileData.stylist;
      setFormData({
        companyName: stylist.companyName || "",
        description: stylist.description || "",
        specialty: Array.isArray(stylist.specialty) ? stylist.specialty : [], // Ensure array
        experience: stylist.experience || "",
        services: stylist.services || [],
        phone: stylist.phone || "",
        email: stylist.email || "",
        website: stylist.website || "",
        cacCertificateNumber: stylist.cacCertificateNumber || "",
        socialMedia: stylist.socialMedia || {
          twitter: "",
          facebook: "",
          instagram: "",
          pinterest: "",
        },
        location: {
          state: stylist.location?.state || "",
          lga: stylist.location?.lga || "",
          address: stylist.location?.address || "",
          branches: stylist.location?.branches || 1,
        },
      });

      // Initialize documents
      setDocuments({
        cacCertificate: stylist.documents?.cacCertificate || "",
        businessRegistration: stylist.documents?.businessRegistration || "",
        taxCertificate: stylist.documents?.taxCertificate || "",
      });
    }
  }, [profileData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle specialty selection (checkbox style)
  const handleSpecialtyChange = (specialty: string) => {
    setFormData((prev) => {
      const currentSpecialties = prev.specialty || [];
      if (currentSpecialties.includes(specialty)) {
        // Remove if already selected
        return {
          ...prev,
          specialty: currentSpecialties.filter((s) => s !== specialty),
        };
      } else {
        // Add if not selected (max 3)
        if (currentSpecialties.length >= 3) {
          toast.error("You can select maximum 3 specialties");
          return prev;
        }
        return {
          ...prev,
          specialty: [...currentSpecialties, specialty],
        };
      }
    });
  };

  const handleServicesChange = (servicesString: string) => {
    setFormData((prev) => ({
      ...prev,
      services: servicesString
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== ""),
    }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }));
  };

  const handleLocationChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      // Validate specialties
      if (formData.specialty.length === 0) {
        toast.error("Please select at least one specialty");
        return;
      }

      const payload = {
        ...formData,
        documents,
      };
      await updateProfile(payload).unwrap();
      toast.success("Profile updated successfully");
      setIsEditing(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  // Rest of the file upload handlers remain the same...
  const handleAvatarUpload = async (file: File) => {
    if (!localUser?.company?.id) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await uploadAvatar({
        id: localUser.company.id,
        formData,
      }).unwrap();
      toast.success("Avatar updated successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to upload avatar");
    }
  };

  const handleBannerUpload = async (file: File) => {
    if (!localUser?.company?.id) return;

    const formData = new FormData();
    formData.append("banner", file);

    try {
      await uploadBanner({
        id: localUser.company.id,
        formData,
      }).unwrap();
      toast.success("Banner updated successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to upload banner");
    }
  };

  const handleAddPortfolioImage = async (file: File, category: string) => {
    if (!localUser?.company?.id) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", category);

    try {
      await addPortfolioImage({
        id: localUser.company.id,
        formData,
      }).unwrap();
      toast.success("Portfolio image added successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add portfolio image");
    }
  };

  const handleRemovePortfolioImage = async (imageId: string) => {
    if (!localUser?.company?.id) return;

    try {
      await removePortfolioImage({
        id: localUser.company.id,
        imageId,
      }).unwrap();
      toast.success("Portfolio image removed successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to remove portfolio image");
    }
  };

  const handleDocumentUpload = async (documentType: string, file: File) => {
    if (!localUser?.company?.id) return;

    const formData = new FormData();
    formData.append("document", file);
    formData.append("documentType", documentType);

    try {
      const result = await uploadDocument({
        id: localUser.company.id,
        formData,
      }).unwrap();

      // Update local documents state
      setDocuments((prev) => ({
        ...prev,
        [documentType]: result.url,
      }));

      toast.success(`${documentType} uploaded successfully`);
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to upload ${documentType}`);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isError || !profileData?.stylist) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">Unable to load your stylist profile.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stylist = profileData.stylist;
  const isUploading = isUploadingAvatar || isUploadingBanner || isUpdating;

  // Format specialties for display when not editing
  const displaySpecialties =
    formData.specialty.length > 0 ? formData.specialty.join(", ") : "No specialties selected";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner with better positioning */}
      <div className="relative h-64 w-full rounded-xl overflow-hidden mb-16">
        {/* ... banner content remains the same ... */}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 -mt-8">
        {/* Profile Card - Pass specialties display */}
        <ProfileCard
          stylist={{
            ...stylist,
            specialty: displaySpecialties, // Pass formatted string for display
          }}
          isEditing={isEditing}
          isUploading={isUploading}
          handleSave={handleSave}
          handleAvatarUpload={handleAvatarUpload}
          setIsEditing={setIsEditing}
        />

        {/* Main content */}
        <div className="flex-1 space-y-6">
          {/* Profile Details - Updated with specialties array */}
          <ProfileDetail
            stylist={stylist}
            formData={formData}
            documents={documents}
            isEditing={isEditing}
            handleInputChange={handleInputChange}
            handleSpecialtyChange={handleSpecialtyChange} // New handler
            handleServicesChange={handleServicesChange}
            handleSocialMediaChange={handleSocialMediaChange}
            handleLocationChange={handleLocationChange}
            handleDocumentUpload={handleDocumentUpload}
            isUploading={isUploading}
            validSpecialties={VALID_SPECIALTIES} // Pass valid options
          />

          {/* Services Section (unchanged) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Services</h3>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={formData.services.join(", ")}
                  onChange={(e) => handleServicesChange(e.target.value)}
                  placeholder="e.g., Hair Styling, Makeup, Nails"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                />
                <p className="text-xs text-gray-500 mt-2">Separate services with commas</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.services.length > 0 ? (
                  formData.services.map((service, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm">
                      {service}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No services listed</p>
                )}
              </div>
            )}
          </div>

          {/* Verification & Documents Section */}
          <VerificationSection
            stylist={stylist}
            formData={formData}
            documents={documents}
            isEditing={isEditing}
            handleInputChange={handleInputChange}
            handleDocumentUpload={handleDocumentUpload}
          />

          {/* Portfolio Section */}
          <PortfolioSection
            stylist={stylist}
            isEditing={isEditing}
            handleAddPortfolioImage={handleAddPortfolioImage}
            handleRemovePortfolioImage={handleRemovePortfolioImage}
            isUploading={isUploading}
          />
        </div>
      </div>
    </div>
  );
};

export default StylistProfilePage;
