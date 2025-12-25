// cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  _id: string;
  product: string | any;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  price?: number;
  isBuyNow?: boolean;
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  lastUpdated: number;
  isLoading: boolean;
}

// Load initial state from localStorage
const loadCartFromStorage = (): CartState => {
  if (typeof window === "undefined") {
    return {
      items: [],
      itemCount: 0,
      lastUpdated: Date.now(),
      isLoading: false,
    };
  }

  try {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      return {
        items: parsedCart.items || [],
        itemCount: parsedCart.itemCount || 0,
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
      state.lastUpdated = Date.now();

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },

    addCartItem: (state, action: PayloadAction<CartItem>) => {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product?._id === action.payload.product?._id ||
          item.product === action.payload.product
      );

      if (existingItemIndex >= 0) {
        // Update existing item
        state.items[existingItemIndex] = {
          ...state.items[existingItemIndex],
          ...action.payload,
          quantity: action.payload.quantity,
        };
      } else {
        // Add new item
        state.items.push(action.payload);
      }

      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.lastUpdated = Date.now();

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },

    removeCartItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.lastUpdated = Date.now();

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },

    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) =>
          item.product?._id === action.payload.productId ||
          item.product === action.payload.productId
      );
      if (item) {
        item.quantity = action.payload.quantity;
        state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
        state.lastUpdated = Date.now();

        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("cart", JSON.stringify(state));
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.lastUpdated = Date.now();

      // Save to localStorage
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
