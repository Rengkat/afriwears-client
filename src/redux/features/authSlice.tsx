import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// authSlice.ts
interface UserType {
  _id: string;
  id?: string;
  firstName: string;
  surname: string;
  role: string;
  company?: {
    id: string;
    companyName: string;
  } | null;
  email?: string;
  phone?: string;
  avatar?: string;
}

interface InitialStateType {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

// Get user from localStorage
const loadUserFromStorage = (): UserType | null => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

// Get token from cookies or localStorage
const getTokenFromStorage = (): string | null => {
  if (typeof window !== "undefined") {
    // Try cookies first
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "accessToken") {
        return value;
      }
    }
    // Fallback to localStorage
    return localStorage.getItem("token");
  }
  return null;
};

const initialState: InitialStateType = {
  user: loadUserFromStorage(),
  isAuthenticated: !!loadUserFromStorage(),
  isLoading: false,
  token: getTokenFromStorage(),
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: UserType; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
        // Also set in cookies for socket
        document.cookie = `accessToken=${action.payload.token}; path=/; max-age=86400; SameSite=Lax`;
      }
    },
    setUser: (state, action: PayloadAction<UserType | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;

      if (typeof window !== "undefined") {
        if (action.payload) {
          localStorage.setItem("user", JSON.stringify(action.payload));
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      }
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
});

export const { setCredentials, setUser, logoutUser, setLoading, setToken } = authSlice.actions;
export default authSlice.reducer;
