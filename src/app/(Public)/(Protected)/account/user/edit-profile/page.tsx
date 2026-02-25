"use client";
import { useState, useEffect } from "react";
import { useGetCurrentUserQuery } from "@/redux/services/AuthApiSlice";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCamera,
  FiArrowLeft,
  FiX,
  FiUpload,
  FiCheck,
} from "react-icons/fi";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  useGetCurrentUserDetailsQuery,
  useUpdateCurrentUserMutation,
  useUploadAvatarMutation,
} from "@/redux/services/UserApiSlice";

type FormData = {
  firstName: string;
  surname: string;
  phone: string;
  avatar: string | File;
};

const EditProfilePage = () => {
  const { user: localUser } = useSelector((store: RootState) => store.authSlice);
  const { data, isLoading: isUserLoading } = useGetCurrentUserDetailsQuery();
  const [updateProfile] = useUpdateCurrentUserMutation();
  const [uploadAvatar] = useUploadAvatarMutation();
  const router = useRouter();

  const user = data?.data || localUser;
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    surname: "",
    phone: "",
    avatar: "/avatar.jpg",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string | null>(null);

  // Pre-fill form with user data when loaded
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        surname: user.surname || "",
        phone: user.phone || "",
        avatar: user.avatar || "avatar.jpg",
      });
      setAvatarPreview(user.avatar || "/avatar.jpg");
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.surname.trim()) newErrors.surname = "Surname is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsUpdating(true);

    try {
      const formPayload = new FormData();
      formPayload.append("firstName", formData.firstName);
      formPayload.append("surname", formData.surname);
      formPayload.append("phone", formData.phone);

      if (tempAvatarUrl) {
        formPayload.append("avatar", tempAvatarUrl);
      }

      // Debugging
      for (let [key, value] of formPayload.entries()) {
        console.log(key, value);
      }

      await updateProfile({
        firstName: formData.firstName,
        surname: formData.surname,
        phone: formData.phone,
        ...(tempAvatarUrl && { avatar: tempAvatarUrl }),
      }).unwrap();
      toast.success("Profile updated successfully!");
      router.push("/account");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      // Set preview
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
      setSelectedFile(file);
      setTempAvatarUrl(null);
    }
  };
  const handleUploadAvatar = async () => {
    if (!selectedFile) return;
    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const uploadResponse = await uploadAvatar(formData).unwrap();
      setTempAvatarUrl(uploadResponse.data.avatarUrl);
      toast.success("Image uploaded successfully!");
      setAvatarPreview(uploadResponse.data.avatarUrl);
    } catch (error: any) {
      console.error("Failed to upload avatar:", error);
      toast.error(error.data?.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const cancelAvatarUpload = () => {
    // Revert to the original avatar
    if (user?.avatar) {
      setAvatarPreview(user.avatar);
    } else {
      setAvatarPreview("/avatar.jpg");
    }
    setSelectedFile(null);
    setTempAvatarUrl(null);
  };

  if (isUserLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error loading profile</h3>
          <p className="text-red-600 mt-1">
            Please try refreshing the page or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/account"
          className="flex items-center text-amber-600 hover:text-amber-700 mb-4 transition-colors duration-200">
          <FiArrowLeft className="mr-2" /> Back to Account
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-gray-600 mt-1">Update your personal information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Upload */}
        <div className="flex items-start gap-6">
          <div className="relative group">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-amber-500">
              <Image
                src={avatarPreview}
                alt={`${formData.firstName} ${formData.surname}`}
                fill
                className="object-cover"
                sizes="96px"
              />
              {selectedFile && !tempAvatarUrl && (
                <button
                  type="button"
                  onClick={cancelAvatarUpload}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2 hover:bg-red-600 transition-colors"
                  title="Cancel upload">
                  <FiX className="w-3 h-3" />
                </button>
              )}
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
              <FiCamera className="w-5 h-5 text-white" />
              <input
                title="Upload new profile picture"
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Profile Photo</h3>
            <p className="text-sm text-gray-500 mt-1">JPG, GIF or PNG. Max size: 2MB</p>

            {selectedFile && !tempAvatarUrl && (
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={handleUploadAvatar}
                  disabled={isUploadingAvatar}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-amber-600 text-white rounded hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed">
                  {isUploadingAvatar ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
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
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FiUpload className="w-4 h-4" />
                      Upload Image
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelAvatarUpload}
                  className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200">
                  Cancel
                </button>
              </div>
            )}

            {tempAvatarUrl && (
              <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                <FiCheck className="w-4 h-4" />
                <span>Image ready to save with profile</span>
              </div>
            )}
          </div>
        </div>

        {/* Rest of your form fields... */}
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <FiUser className="text-gray-400" />
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm border py-2 px-3 focus:outline-none sm:text-sm ${
              errors.firstName
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-amber-500 focus:border-amber-500"
            }`}
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
        </div>

        {/* Surname */}
        <div>
          <label
            htmlFor="surname"
            className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <FiUser className="text-gray-400" />
            Surname
          </label>
          <input
            id="surname"
            name="surname"
            type="text"
            value={formData.surname}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm border py-2 px-3 focus:outline-none sm:text-sm ${
              errors.surname
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-amber-500 focus:border-amber-500"
            }`}
          />
          {errors.surname && <p className="mt-1 text-sm text-red-600">{errors.surname}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <FiPhone className="text-gray-400" />
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 border py-2 px-3 focus:outline-none sm:text-sm"
            placeholder="+234 800 000 0000"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push("/account")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUpdating}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-amber-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center min-w-[120px]">
            {isUpdating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
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
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
