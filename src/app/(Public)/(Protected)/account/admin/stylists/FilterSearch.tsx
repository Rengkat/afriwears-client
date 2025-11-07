import { FiSearch } from "react-icons/fi";

const FilterSearch = ({
  setStatusFilter,
  handleBulkAction,
  searchTerm,
  setSearchTerm,
  statusFilter,
  selectedStylists,
  verificationFilter,
  setVerificationFilter,
}: any) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search stylists by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            <option value="all">All Verification</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedStylists.length > 0 && (
        <div className="mt-4 flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-blue-900">
            {selectedStylists.length} stylist(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction("verify")}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors">
              Verify
            </button>
            <button
              onClick={() => handleBulkAction("activate")}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors">
              Activate
            </button>
            <button
              onClick={() => handleBulkAction("suspend")}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors">
              Suspend
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded transition-colors">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSearch;
