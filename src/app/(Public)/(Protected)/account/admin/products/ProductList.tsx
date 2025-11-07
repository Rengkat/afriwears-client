import {
  formatCurrency,
  formatDate,
  getCategoryColor,
  getStatusColor,
  getStatusIcon,
} from "@/utils";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiPackage,
  FiUser,
  FiDollarSign,
  FiTag,
  FiShoppingBag,
  FiAlertCircle,
} from "react-icons/fi";

const ProductList = ({
  product,
  selectedProducts,
  handleSelectProduct,
  handleViewProduct,
  handleApproveProduct,
  handleRejectProduct,
}: any) => {
  return (
    <tr key={product._id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={selectedProducts.includes(product._id)}
          onChange={(e) => handleSelectProduct(product._id, e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="h-12 w-12 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center">
            {product.mainImage ? (
              <img
                className="h-12 w-12 rounded-lg object-cover"
                src={product.mainImage}
                alt={product.name}
              />
            ) : (
              <FiPackage className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
              {product.name}
            </div>
            <div className="text-sm text-gray-500">{product.sku}</div>
            <div className="text-xs text-gray-400 capitalize">{product.type}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-8 w-8 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
            <FiUser className="h-4 w-4 text-gray-400" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{product.stylist.name}</div>
            <div className="text-xs text-gray-500">{product.stylist.company}</div>
            <div
              className={`text-xs px-1 rounded ${
                product.stylist.verificationStatus === "verified"
                  ? "bg-green-100 text-green-800"
                  : "bg-amber-100 text-amber-800"
              }`}>
              {product.stylist.verificationStatus}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getCategoryColor(
            product.category
          )}`}>
          {product.category}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{formatCurrency(product.price)}</div>
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="text-xs text-gray-500 line-through">
            {formatCurrency(product.originalPrice)}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {getStatusIcon(product.status)}
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
              product.status
            )}`}>
            {product.status}
          </span>
        </div>
        {product.rejectionReason && (
          <div
            className="text-xs text-gray-500 mt-1 max-w-xs truncate"
            title={product.rejectionReason}>
            {product.rejectionReason}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(product.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewProduct(product)}
            className="text-blue-600 hover:text-blue-900 transition-colors"
            title="View Details">
            <FiEye size={16} />
          </button>
          {product.status === "pending" && (
            <>
              <button
                onClick={() => handleApproveProduct(product._id)}
                className="text-green-600 hover:text-green-900 transition-colors"
                title="Approve Product">
                <FiCheckCircle size={16} />
              </button>
              <button
                onClick={() => handleRejectProduct(product)}
                className="text-red-600 hover:text-red-900 transition-colors"
                title="Reject Product">
                <FiXCircle size={16} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ProductList;
