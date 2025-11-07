import { formatCurrency, getCategoryColor, getStatusColor } from "@/utils";
import { FiXCircle, FiPackage, FiUser, FiAlertCircle } from "react-icons/fi";

const ProductDetailModel = ({
  setShowProductModal,
  selectedProduct,
  handleRejectProduct,
  handleApproveProduct,
}: any) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Product Details</h3>
            <button
              onClick={() => setShowProductModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              <FiXCircle size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Product Header */}
            <div className="flex items-start gap-6">
              <div className="h-32 w-32 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                {selectedProduct.mainImage ? (
                  <img
                    className="h-32 w-32 rounded-lg object-cover"
                    src={selectedProduct.mainImage}
                    alt={selectedProduct.name}
                  />
                ) : (
                  <FiPackage className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900">{selectedProduct.name}</h4>
                <p className="text-gray-600 mt-1">{selectedProduct.sku}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(
                      selectedProduct.category
                    )}`}>
                    {selectedProduct.category}
                  </span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                    {selectedProduct.type}
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedProduct.status
                    )}`}>
                    {selectedProduct.status}
                  </span>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(selectedProduct.price)}
                  </span>
                  {selectedProduct.originalPrice &&
                    selectedProduct.originalPrice > selectedProduct.price && (
                      <span className="ml-2 text-lg text-gray-500 line-through">
                        {formatCurrency(selectedProduct.originalPrice)}
                      </span>
                    )}
                </div>
              </div>
            </div>

            {/* Stylist Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Stylist Information</h5>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedProduct.stylist.name}</p>
                  <p className="text-sm text-gray-600">{selectedProduct.stylist.company}</p>
                  <p className="text-xs text-gray-500">
                    {selectedProduct.stylist.verificationStatus} stylist
                  </p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Product Information</h5>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-gray-500">Description</dt>
                    <dd className="text-sm text-gray-900 mt-1">{selectedProduct.description}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Materials</dt>
                    <dd className="text-sm text-gray-900 mt-1">{selectedProduct.materials}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Care Instructions</dt>
                    <dd className="text-sm text-gray-900 mt-1">
                      {selectedProduct.careInstructions}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Delivery Info</dt>
                    <dd className="text-sm text-gray-900 mt-1">{selectedProduct.deliveryInfo}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-3">Inventory & Attributes</h5>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-gray-500">Stock Available</dt>
                    <dd className="text-sm font-medium text-gray-900 mt-1">
                      {selectedProduct.stock} units
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Sizes</dt>
                    <dd className="text-sm text-gray-900 mt-1">
                      <div className="flex flex-wrap gap-1">
                        {selectedProduct.sizes.map((size: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                            {size}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Colors</dt>
                    <dd className="text-sm text-gray-900 mt-1">
                      <div className="flex flex-wrap gap-1">
                        {selectedProduct.colors.map((color: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                            {color}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </div>
                  {selectedProduct.attributes &&
                    Object.keys(selectedProduct.attributes).length > 0 && (
                      <div>
                        <dt className="text-sm text-gray-500">Additional Attributes</dt>
                        <dd className="text-sm text-gray-900 mt-1">
                          <div className="space-y-1">
                            {Object.entries(selectedProduct.attributes).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-600">{key}:</span>
                                <span className="text-gray-900">{value as string}</span>
                              </div>
                            ))}
                          </div>
                        </dd>
                      </div>
                    )}
                </dl>
              </div>
            </div>

            {/* Additional Images */}
            {selectedProduct.subImages && selectedProduct.subImages.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Additional Images</h5>
                <div className="flex gap-4 overflow-x-auto">
                  {selectedProduct.subImages.map((image: string, index: number) => (
                    <div
                      key={index}
                      className="h-24 w-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <img
                        className="h-24 w-24 rounded-lg object-cover"
                        src={image}
                        alt={`${selectedProduct.name} - Image ${index + 2}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rejection Reason (if rejected) */}
            {selectedProduct.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <FiAlertCircle className="text-red-500" size={20} />
                  <h5 className="font-medium text-red-800">Rejection Reason</h5>
                </div>
                <p className="text-red-700 mt-1">{selectedProduct.rejectionReason}</p>
              </div>
            )}

            {/* Approval Actions */}
            {selectedProduct.status === "pending" && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleApproveProduct(selectedProduct._id);
                    setShowProductModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                  Approve Product
                </button>
                <button
                  onClick={() => {
                    setShowProductModal(false);
                    handleRejectProduct(selectedProduct);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                  Reject Product
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModel;
