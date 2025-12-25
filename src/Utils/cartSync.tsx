// utils/cartSync.ts
export const syncLocalCartToServer = async (userId: string) => {
  if (typeof window === "undefined") return;

  const localCart = localStorage.getItem("cart");
  if (!localCart) return;

  const parsedCart = JSON.parse(localCart);

  // For each local item, post to server
  for (const item of parsedCart.items) {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.product,
          quantity: item.quantity,
        }),
      });

      if (!response.ok) {
        console.error(`Failed to sync item: ${item.product}`);
      }
    } catch (error) {
      console.error("Sync error:", error);
    }
  }

  // Clear local storage after successful sync
  localStorage.removeItem("cart");
};
