import Image from "next/image";
import React from "react";

const OrderSummary = ({ order }: any) => {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-lg text-gray-800">Order Summary</h2>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-4 py-4 border-b border-gray-100 last:border-0">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-md overflow-hidden relative">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                </div>

                <div className="text-right">
                  <p className="font-medium">₦{item.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">
                    Subtotal: ₦{item.subtotal.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">
                ₦{(order.total - order.shipping).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">₦{order.shipping.toLocaleString()}</span>
            </div>

            <div className="flex justify-between py-2 text-lg font-bold">
              <span>Total</span>
              <span>₦{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-lg text-gray-800">Customer Information</h2>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Customer Name</h3>
              <p className="text-gray-900">{order.customer.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
              <p className="text-gray-900">{order.customer.email}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h3>
              <p className="text-gray-900">{order.customer.phone}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Shipping Address</h3>
              <p className="text-gray-900">{order.customer.address}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h3>
              <p className="text-gray-900">{order.paymentMethod}</p>
            </div>

            {order.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Order Notes</h3>
                <p className="text-gray-900 italic">"{order.notes}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
