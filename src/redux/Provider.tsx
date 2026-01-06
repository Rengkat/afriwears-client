"use client";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./Store";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./CartProvider";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <CartProvider>{children}</CartProvider>
      <Toaster position="top-center" />
    </Provider>
  );
};

export default AppProvider;
