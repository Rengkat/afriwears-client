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

export interface UserProfile {
  _id: string;
  firstName: string;
  surname: string;
  email: string;
  phone?: string;
  avatar?: string;
  walletAmount: number;
  subscribedToNewsLetter: boolean;
  addresses?: Address[];
  fullAddress?: string;
  role?: string;
  company?: string | null;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
  verificationTokenExpirationDate: any;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  profile?: T;
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

interface UsersListResponse {
  success: boolean;
  fromCache: boolean;
  count: number;
  totalUsers: number;
  page: number;
  pages: number;
  users: UserProfile[];
}

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Address", "UsersList"],
  endpoints: (builder) => ({
    // User endpoints
    getCurrentUserDetails: builder.query<ApiResponse<UserProfile>, void>({
      query: () => "/users/me",
      providesTags: (result) => [
        { type: "User", id: result?.profile?._id || "CURRENT" },
        ...(result?.profile?.addresses?.map((addr) => ({
          type: "Address" as const,
          id: addr._id,
        })) || []),
      ],
    }),

    // New endpoint to get all users (admin only)
    getAllUsers: builder.query<
      UsersListResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        order?: "asc" | "desc";
      }
    >({
      query: (params = {}) => {
        const { page = 1, limit = 10, search, sortBy, order } = params;
        const queryParams = new URLSearchParams();

        queryParams.append("page", page.toString());
        queryParams.append("limit", limit.toString());

        if (search) queryParams.append("search", search);
        if (sortBy) queryParams.append("sortBy", sortBy);
        if (order) queryParams.append("order", order);

        const queryString = queryParams.toString();
        return `/users${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: (result) => [
        { type: "UsersList", id: "LIST" },
        ...(result?.users?.map((user) => ({
          type: "User" as const,
          id: user._id,
        })) || []),
      ],
    }),

    // UserApiSlice.ts
    getUserById: builder.query<{ success: boolean; user: UserProfile; fromCache: boolean }, string>(
      {
        query: (id) => `/users/${id}`,
        providesTags: (result, error, id) => [
          { type: "User", id },
          ...(result?.user?.addresses?.map((addr) => ({
            type: "Address" as const,
            id: addr._id,
          })) || []),
        ],
      },
    ),

    updateCurrentUser: builder.mutation<ApiResponse<UserProfile>, Partial<UserProfile>>({
      query: (body) => ({
        url: "/users/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),

    // Update user by ID (admin only)
    updateUser: builder.mutation<
      ApiResponse<UserProfile>,
      { id: string; updates: Partial<UserProfile> }
    >({
      query: ({ id, updates }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "UsersList", id: "LIST" },
      ],
    }),

    // Delete user (admin only)
    deleteUser: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "User", id },
        { type: "UsersList", id: "LIST" },
      ],
    }),

    // In UserApiSlice.ts
    uploadAvatar: builder.mutation<{ success: boolean; data: { avatarUrl: string } }, FormData>({
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
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateCurrentUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUploadAvatarMutation,
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useSetDefaultAddressMutation,
  useDeleteAddressMutation,
} = userApiSlice;
