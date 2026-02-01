// @/redux/AppProvider.tsx
"use client";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./Store";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./CartProvider";
import { SocketProvider } from "./SocketContext";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <SocketProvider>
        <CartProvider>{children}</CartProvider>
      </SocketProvider>
      <Toaster position="top-center" />
    </Provider>
  );
};

export default AppProvider;
