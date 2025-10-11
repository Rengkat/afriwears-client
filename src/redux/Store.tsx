import { configureStore } from "@reduxjs/toolkit";
import appSlice from "../redux/features/appSlice";
import { authApi } from "./services/AuthApiSlice";
import authReducer from "./features/authSlice";
import { userApiSlice } from "./services/UserApiSlice";
import { productApi } from "./services/ProductApi";
import { transactionApi } from "./services/TransactionApiSlice";
import { orderApi } from "./services/OrderApiSlice";
import { wishlistApi } from "./services/WishlistApiSlice";
import { cartApi } from "./services/CartApiSlice";

export const store = configureStore({
  reducer: {
    shopReducer: appSlice,
    authSlice: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApiSlice.middleware)
      .concat(productApi.middleware)
      .concat(transactionApi.middleware)
      .concat(orderApi.middleware)
      .concat(wishlistApi.middleware)
      .concat(cartApi.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
