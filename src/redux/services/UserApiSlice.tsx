import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../BaseUrl";

interface Address {
  _id: string;
  user: string;
  country: string;
  state: string;
  city: string;
  street: string;
  postalCode: string;
  homeAddress: string;
  homeAddress2?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  _id: string;
  firstName: string;
  surname: string;
  email: string;
  phone?: string;
  avatar?: string;
  walletAmount: number;
  subscribedToNewsLetter: boolean;
  addresses: Address[];
  fullAddress?: string;
  role?: string;
  company?: string | null;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface AddressResponse {
  success: boolean;
  address: Address;
  message?: string;
}

interface AddressListResponse {
  success: boolean;
  addresses: Address[];
  count: number;
}

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Address"],
  endpoints: (builder) => ({
    // User endpoints
    getCurrentUserDetails: builder.query<ApiResponse<UserProfile>, void>({
      query: () => "/users/me",
      providesTags: (result) => [
        { type: "User", id: result?.data?._id || "CURRENT" },
        ...(result?.data?.addresses?.map((addr) => ({
          type: "Address" as const,
          id: addr._id,
        })) || []),
      ],
    }),

    updateCurrentUser: builder.mutation<ApiResponse<UserProfile>, Partial<UserProfile>>({
      query: (body) => ({
        url: "/users/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),

    uploadAvatar: builder.mutation<ApiResponse<{ avatarUrl: string }>, FormData>({
      query: (formData) => ({
        url: "/users/me/upload-avatar",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),

    getAddresses: builder.query<AddressListResponse, void>({
      query: () => "/addresses",
      providesTags: (result) => [
        { type: "Address" as const, id: "LIST" },
        ...(result?.addresses?.map(({ _id }) => ({
          type: "Address" as const,
          id: _id,
        })) || []),
      ],
    }),

    createAddress: builder.mutation<
      AddressResponse,
      Omit<Address, "_id" | "user" | "createdAt" | "updatedAt">
    >({
      query: (addressData) => ({
        url: "/addresses",
        method: "POST",
        body: addressData,
      }),
      invalidatesTags: [
        { type: "Address", id: "LIST" },
        { type: "User", id: "CURRENT" },
      ],
    }),

    updateAddress: builder.mutation<AddressResponse, { id: string; updates: Partial<Address> }>({
      query: ({ id, updates }) => ({
        url: `/addresses/${id}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Address", id },
        { type: "User", id: "CURRENT" },
      ],
    }),

    setDefaultAddress: builder.mutation<AddressResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/addresses/${id}/default`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Address", id },
        { type: "Address", id: "LIST" },
        { type: "User", id: "CURRENT" },
      ],
    }),

    deleteAddress: builder.mutation<{ success: boolean; message?: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Address", id },
        { type: "Address", id: "LIST" },
        { type: "User", id: "CURRENT" },
      ],
    }),
  }),
});

export const {
  useGetCurrentUserDetailsQuery,
  useUpdateCurrentUserMutation,
  useUploadAvatarMutation,
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useSetDefaultAddressMutation,
  useDeleteAddressMutation,
} = userApiSlice;
