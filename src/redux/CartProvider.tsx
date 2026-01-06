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

  const [hasValidAuth, setHasValidAuth] = useState(false);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
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
  }, [user, token]);

  const { isLoading, data, error } = useGetCartProductsQuery(undefined, {
    skip: !hasValidAuth || hasFetchedRef.current,
  });

  useEffect(() => {
    if (data && hasValidAuth) {
      hasFetchedRef.current = true;
    }

    console.log("CartProvider:", {
      hasValidAuth,
      isLoading,
      hasData: !!data,
      itemsCount: data?.data?.items?.length || 0,
    });
  }, [hasValidAuth, isLoading, data]);

  useEffect(() => {
    dispatch(setCartLoading(isLoading));
  }, [isLoading, dispatch]);

  return <>{children}</>;
};
