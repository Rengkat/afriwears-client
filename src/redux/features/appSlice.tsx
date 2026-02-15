import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isProfileOpen: false,
  isMobileMenuOpen: false,
};

const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    openProfileDropdown(state) {
      state.isProfileOpen = !state.isProfileOpen;
    },
    openMobileMenu(state) {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
  },
});

export const { openProfileDropdown, openMobileMenu } = appSlice.actions;
export default appSlice.reducer;
