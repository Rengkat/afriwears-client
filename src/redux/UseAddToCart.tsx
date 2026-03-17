import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/Store";
import { addCartItem } from "@/redux/features/cartSlice";
import { useAddToCartMutation } from "@/redux/services/CartApiSlice";

interface AddToCartParams {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
  mainImage?: string;
  stock?: number;
  selectedSize?: string;
  selectedColor?: string;
}

export const useAddToCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.authSlice.user);
  const [addToCartDB, { isLoading }] = useAddToCartMutation();

  const addToCart = async (
    params: AddToCartParams,
  ): Promise<{ success: boolean; error?: string }> => {
    const { productId, quantity, price, name, mainImage, stock, selectedSize, selectedColor } =
      params;

    if (user) {
      // ── Logged in → push to DB ──────────────────────────────────────────
      try {
        await addToCartDB({ productId, quantity }).unwrap();
        return { success: true };
      } catch (error: any) {
        const message = error?.data?.message || "Failed to add to cart";
        console.error("❌ Add to cart (DB) failed:", message);
        return { success: false, error: message };
      }
    } else {
      // ── Guest → save to localStorage via Redux ──────────────────────────
      dispatch(
        addCartItem({
          _id: productId,
          product: productId,
          quantity,
          price,
          name,
          mainImage,
          stock,
          selectedSize,
          selectedColor,
        }),
      );
      return { success: true };
    }
  };

  return { addToCart, isLoading };
};
