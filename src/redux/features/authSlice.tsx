import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  // NOTE: token is intentionally removed.
  // Cookies are httpOnly — JS cannot read them.
  // The backend handles token verification via signed cookies.
  // We use `user` presence as the auth signal in the frontend.
}

const loadUserFromStorage = (): UserType | null => {
  if (typeof window !== "undefined") {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
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
    // Called after login/register — sets user from API response
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

    // Called on logout
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("cart");
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, logoutUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
