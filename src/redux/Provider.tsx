"use client";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./Store";
import { Toaster } from "react-hot-toast";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      {children}
      <Toaster position="top-center" />
    </Provider>
  );
};

export default AppProvider;
