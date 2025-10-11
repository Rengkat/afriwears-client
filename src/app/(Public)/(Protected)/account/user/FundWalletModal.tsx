"use client";
import { useFundWalletMutation } from "@/redux/services/TransactionApiSlice";
import { useState } from "react";
import { FiX, FiCreditCard, FiLoader } from "react-icons/fi";

const FundWalletModal = ({ onClose }: { onClose: () => void }) => {
  const [amount, setAmount] = useState<number>(100);
  const [description, setDescription] = useState<string>("");
  const [fundWallet, { isLoading }] = useFundWalletMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fundWallet({ amount, description }).unwrap();
      console.log("Payment initialization response:", res);
      window.location.href = res.authorizationUrl;
    } catch (err) {
      console.error("Failed to initialize payment:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FiCreditCard className="text-amber-500" />
            Fund Wallet
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₦)
            </label>
            <input
              type="number"
              id="amount"
              min="100"
              step="100"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Minimum amount: ₦100</p>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="e.g. June wallet funding"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium hover:bg-amber-700 disabled:bg-amber-400 flex items-center gap-2">
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FundWalletModal;
