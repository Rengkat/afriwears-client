// // utils/cartSync.ts
// import { store } from "@/redux/Store";
// import { clearCart, setCartItems } from "@/redux/features/cartSlice";
// import { cartApi } from "@/redux/services/CartApiSlice";

// export const syncCartWithServer = async (userId: string) => {
//   if (!userId || typeof window === "undefined") {
//     return;
//   }

//   const state = store.getState();
//   // Check if user is actually authenticated
//   if (!state.authSlice.user || !state.authSlice.token) {
//     console.log("User not authenticated, skipping cart sync");
//     return;
//   }

//   try {
//     // Get local cart from localStorage
//     const localCart = localStorage.getItem("cart");
//     if (!localCart) {
//       return;
//     }

//     const parsedCart = JSON.parse(localCart);
//     const localItems = parsedCart.items || [];

//     if (localItems.length === 0) {
//       return;
//     }

//     // Get server cart
//     const serverCartResponse = await store.dispatch(cartApi.endpoints.getCartProducts.initiate(""));

//     const serverCart = serverCartResponse.data?.cart;
//     const serverItems = serverCart?.items || [];

//     // Merge carts: server items take precedence
//     const mergedItems = mergeCarts(localItems, serverItems);

//     // Update server cart with merged items
//     for (const item of mergedItems) {
//       const existingServerItem = serverItems.find(
//         (serverItem: any) =>
//           serverItem.product?._id === item.product || serverItem.product === item.product
//       );

//       if (!existingServerItem) {
//         // Add missing items to server cart
//         await store.dispatch(
//           cartApi.endpoints.addToCart.initiate({
//             productId: item.product,
//             quantity: item.quantity,
//             selectedSize: item.selectedSize,
//             selectedColor: item.selectedColor,
//           })
//         );
//       } else if (existingServerItem.quantity !== item.quantity) {
//         // Update quantity if different
//         await store.dispatch(
//           cartApi.endpoints.updateCart.initiate({
//             productId: item.product,
//             quantity: item.quantity,
//           })
//         );
//       }
//     }

//     // Clear local cart after successful sync
//     localStorage.removeItem("cart");
//     store.dispatch(clearCart());

//     console.log("Cart synchronized successfully");
//   } catch (error) {
//     console.error("Error syncing cart:", error);
//   }
// };

// export const mergeCarts = (localItems: any[], serverItems: any[]) => {
//   const mergedMap = new Map();

//   // Add all server items first
//   serverItems.forEach((item: any) => {
//     const productId = item.product?._id || item.product;
//     mergedMap.set(productId, {
//       ...item,
//       _id: item._id,
//       product: productId,
//     });
//   });

//   // Merge or add local items
//   localItems.forEach((localItem) => {
//     const productId = localItem.product?._id || localItem.product;
//     const existingItem = mergedMap.get(productId);

//     if (existingItem) {
//       // Use the higher quantity
//       mergedMap.set(productId, {
//         ...existingItem,
//         quantity: Math.max(existingItem.quantity, localItem.quantity),
//       });
//     } else {
//       mergedMap.set(productId, {
//         ...localItem,
//         product: productId,
//       });
//     }
//   });

//   return Array.from(mergedMap.values());
// };

// // Utility to handle cart state after login
// export const handleCartAfterLogin = async (userId: string) => {
//   if (typeof window === "undefined") return;

//   const localCart = localStorage.getItem("cart");

//   if (localCart) {
//     // Sync local cart with server
//     await syncCartWithServer(userId);
//   } else {
//     // Just fetch server cart
//     await store.dispatch(cartApi.endpoints.getCartProducts.initiate(""));
//   }
// };
