import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserType {
  firstName: string;
  surname: string;
  role: string;
  company?: string;
}

interface InitialStateType {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Load user from localStorage on initial state
const loadUserFromStorage = (): UserType | null => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

const initialState: InitialStateType = {
  user: loadUserFromStorage(),
  isAuthenticated: !!loadUserFromStorage(),
  isLoading: false,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;

      if (typeof window !== "undefined") {
        if (action.payload) {
          localStorage.setItem("user", JSON.stringify(action.payload));
        } else {
          localStorage.removeItem("user");
        }
      }
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, logoutUser, setLoading } = authSlice.actions;

export default authSlice.reducer;
