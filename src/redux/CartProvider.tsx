"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCartLoading } from "@/redux/features/cartSlice";
import { RootState } from "@/redux/Store";
import { useGetCartProductsQuery } from "@/redux/services/CartApiSlice";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.authSlice.user);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // KEY FIX: Only fetch cart for regular customers (role === "user").
  // Stylists and admins hit the cart endpoint and get 403 (route is
  // guarded with authorize("user")), which was incorrectly triggering logout.
  // Guests (no user) use the localStorage-backed Redux cart — no fetch needed.
  const isCustomer = user?.role === "user";

  const { isLoading } = useGetCartProductsQuery(undefined, {
    skip: !mounted || !isCustomer,
  });

  useEffect(() => {
    if (mounted) {
      dispatch(setCartLoading(isLoading));
    }
  }, [isLoading, dispatch, mounted]);

  return <>{children}</>;
};
