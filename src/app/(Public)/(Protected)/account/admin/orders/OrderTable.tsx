import React from "react";
import OrderList from "./OrderList";
import { FiShoppingBag } from "react-icons/fi";
import Pagination from "./Pagination";

const OrderTable = ({
  handleSelectAll,
  selectedOrders,
  currentOrders,
  handleSelectOrder,
  handleUpdateStatus,
  handleViewOrder,
  filteredOrders,
  indexOfFirstOrder,
  indexOfLastOrder,
  setCurrentPage,
  currentPage,
  totalPages,
}: any) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    selectedOrders.length === currentOrders.length && currentOrders.length > 0
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.map((order) => {
              return (
                <OrderList
                  key={order?._id}
                  order={order}
                  selectedOrders={selectedOrders}
                  handleSelectOrder={handleSelectOrder}
                  handleUpdateStatus={handleUpdateStatus}
                  handleViewOrder={handleViewOrder}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {currentOrders.length === 0 && (
        <div className="text-center py-12">
          <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filteredOrders.length === 0
              ? "No orders match your current filters."
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          indexOfFirstOrder={indexOfFirstOrder}
          indexOfLastOrder={indexOfLastOrder}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          filteredOrders={filteredOrders}
        />
      )}
    </div>
  );
};

export default OrderTable;
