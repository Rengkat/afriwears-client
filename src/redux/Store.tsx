// @/redux/Store.ts
import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./features/appSlice";
import cartSlice from "./features/cartSlice";
import { authApi } from "./services/AuthApiSlice";
import authReducer from "./features/authSlice";
import { userApiSlice } from "./services/UserApiSlice";
import { productApi } from "./services/ProductApi";
import { transactionApi } from "./services/TransactionApiSlice";
import { orderApi } from "./services/OrderApiSlice";
import { wishlistApi } from "./services/WishlistApiSlice";
import { cartApi } from "./services/CartApiSlice";
import { stylistApi } from "./services/StylistApiSlice";
import { notificationApi } from "./services/NotificationApiSlice";
import { messageApi } from "./services/MessageApiSlice";

export const store = configureStore({
  reducer: {
    shopReducer: appSlice,
    authSlice: authReducer,
    cartSlice: cartSlice,
    [authApi.reducerPath]: authApi.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [stylistApi.reducerPath]: stylistApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApiSlice.middleware)
      .concat(productApi.middleware)
      .concat(transactionApi.middleware)
      .concat(orderApi.middleware)
      .concat(wishlistApi.middleware)
      .concat(cartApi.middleware)
      .concat(stylistApi.middleware)
      .concat(notificationApi.middleware)
      .concat(messageApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
