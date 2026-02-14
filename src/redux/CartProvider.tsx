"use client";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setCartLoading } from "@/redux/features/cartSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { useGetCartProductsQuery } from "./services/CartApiSlice";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.authSlice.user);
  const token = useSelector((store: RootState) => store.authSlice.token);
  
  // Add mounted state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [hasValidAuth, setHasValidAuth] = useState(false);
  const hasFetchedRef = useRef(false);

  // Set mounted after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run auth validation after mount
    if (!mounted) return;
    
    if (user && token) {
      const timer = setTimeout(() => {
        setHasValidAuth(true);
        hasFetchedRef.current = false;
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setHasValidAuth(false);
      hasFetchedRef.current = false;
    }
  }, [user, token, mounted]);

  // Skip API calls during SSR and before auth validation
  const { isLoading, data, error } = useGetCartProductsQuery(undefined, {
    skip: !mounted || !hasValidAuth || hasFetchedRef.current,
  });

  useEffect(() => {
    if (data && hasValidAuth && mounted) {
      hasFetchedRef.current = true;
    }

    console.log("CartProvider:", {
      mounted,
      hasValidAuth,
      isLoading,
      hasData: !!data,
      itemsCount: data?.data?.items?.length || 0,
    });
  }, [hasValidAuth, isLoading, data, mounted]);

  useEffect(() => {
    if (mounted) {
      dispatch(setCartLoading(isLoading));
    }
  }, [isLoading, dispatch, mounted]);

  return <>{children}</>;
};