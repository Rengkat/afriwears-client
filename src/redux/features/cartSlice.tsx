import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  _id: string;
  product: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  price?: number;
  isBuyNow?: boolean;
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  lastUpdated: number;
  isLoading: boolean;
}

const loadCartFromStorage = (): CartState => {
  if (typeof window === "undefined") {
    return {
      items: [],
      itemCount: 0,
      totalPrice: 0,
      lastUpdated: Date.now(),
      isLoading: false,
    };
  }

  try {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      const normalizedItems =
        parsedCart.items?.map((item: any) => ({
          ...item,
          product: item.product?._id || item.product,
        })) || [];

      return {
        items: normalizedItems,
        itemCount: normalizedItems.reduce(
          (total: number, item: CartItem) => total + item.quantity,
          0
        ),
        totalPrice: normalizedItems.reduce(
          (total: number, item: CartItem) => total + (item.price || 0) * item.quantity,
          0
        ),
        lastUpdated: parsedCart.lastUpdated || Date.now(),
        isLoading: false,
      };
    }
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
  }

  return {
    items: [],
    itemCount: 0,
    totalPrice: 0,
    lastUpdated: Date.now(),
    isLoading: false,
  };
};

const initialState: CartState = loadCartFromStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.itemCount = action.payload.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = action.payload.reduce(
        (total, item) => total + (item.price || 0) * item.quantity,
        0
      );
      state.lastUpdated = Date.now();

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },

    addCartItem: (state, action: PayloadAction<CartItem>) => {
      const productId = action.payload.product;
      const existingItemIndex = state.items.findIndex((item) => item.product === productId);

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex] = {
          ...state.items[existingItemIndex],
          ...action.payload,
          quantity: action.payload.quantity,
        };
      } else {
        state.items.push({
          ...action.payload,
          product: productId,
        });
      }

      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce(
        (total, item) => total + (item.price || 0) * item.quantity,
        0
      );
      state.lastUpdated = Date.now();

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },

    removeCartItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload && item.product !== action.payload
      );

      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce(
        (total, item) => total + (item.price || 0) * item.quantity,
        0
      );
      state.lastUpdated = Date.now();

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },

    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.product === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
        state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalPrice = state.items.reduce(
          (total, item) => total + (item.price || 0) * item.quantity,
          0
        );
        state.lastUpdated = Date.now();

        if (typeof window !== "undefined") {
          localStorage.setItem("cart", JSON.stringify(state));
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.totalPrice = 0;
      state.lastUpdated = Date.now();

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },

    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setCartItems,
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
  clearCart,
  setCartLoading,
} = cartSlice.actions;

export default cartSlice.reducer;
