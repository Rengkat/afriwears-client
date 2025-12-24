import { FiSearch } from "react-icons/fi";

const FilterAndSearch = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  selectedUsers,
  handleBulkAction,
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
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-4">
          <select
            title="filter status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-[150px]">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="mt-4 flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <span className="text-sm font-medium text-blue-900">
            {selectedUsers.length} user(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction("activate")}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm">
              Activate
            </button>
            <button
              onClick={() => handleBulkAction("suspend")}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm">
              Suspend
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterAndSearch;
