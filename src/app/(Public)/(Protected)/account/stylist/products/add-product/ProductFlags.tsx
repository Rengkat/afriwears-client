import { FiStar, FiAward, FiTrendingUp } from "react-icons/fi";

interface ProductFlagsProps {
  formData: any;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
}

const ProductFlags = ({ formData, handleInputChange }: ProductFlagsProps) => {
  return (
    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Featured */}
        <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-amber-500 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <FiStar className="text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Featured Product</h4>
              <p className="text-sm text-gray-500">Show on homepage featured section</p>
            </div>
          </div>
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleInputChange}
            className="h-5 w-5 text-amber-600 rounded focus:ring-amber-500"
          />
        </label>

        {/* Best Seller */}
        <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-amber-500 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <FiAward className="text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Best Seller</h4>
              <p className="text-sm text-gray-500">Mark as top-selling product</p>
            </div>
          </div>
          <input
            type="checkbox"
            name="isBestSeller"
            checked={formData.isBestSeller}
            onChange={handleInputChange}
            className="h-5 w-5 text-green-600 rounded focus:ring-green-500"
          />
        </label>

        {/* New Product */}
        <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-amber-500 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FiTrendingUp className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">New Arrival</h4>
              <p className="text-sm text-gray-500">Mark as new product</p>
            </div>
          </div>
          <input
            type="checkbox"
            name="isNewProduct"
            checked={formData.isNewProduct}
            onChange={handleInputChange}
            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
          />
        </label>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        These flags help categorize your product in different sections of the store.
      </p>
    </div>
  );
};

export default ProductFlags;
