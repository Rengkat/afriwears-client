import Link from "next/link";
import { FiHeart, FiTrash2 } from "react-icons/fi";
interface CartProduct {
  id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    mainImage: string;
    stock: number;
  };
  quantity: number;
  price: number;
}
const CartItem = ({
  product,
  onRemove,
  onUpdateQuantity,
  onMoveToWishlist,
}: {
  product: CartProduct;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onMoveToWishlist: (id: string) => void;
}) => {
  // console.log(product);
  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value);
    onUpdateQuantity(product.product._id, newQuantity);
  };

  return (
    <Link
      href={`/products/${product.product._id}`}
      className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
      <div className="w-full md:w-1/4 lg:w-1/5">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={product.product.mainImage || "/placeholder-product.jpg"}
            alt={product.product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">{product.product.name}</h3>
            <p className="text-sm text-gray-500">Available: {product.product.stock}</p>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-lg font-semibold text-gray-900">
              ₦{product.price.toLocaleString()}
            </span>
            <div className="flex items-center gap-2 mt-2">
              <select
                title="change quantity"
                value={product.quantity}
                onChange={handleQuantityChange}
                className="border border-gray-300 rounded p-1 text-sm"
                disabled={product.product.stock === 0}>
                {Array.from({ length: Math.min(10, product.product.stock) }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => onRemove(product.product._id)}
            className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
            <FiTrash2 /> Remove
          </button>
          <button
            onClick={() => onMoveToWishlist(product.product._id)}
            className="flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors">
            <FiHeart /> Move to Wishlist
          </button>
        </div>
      </div>
    </Link>
  );
};
export default CartItem;
