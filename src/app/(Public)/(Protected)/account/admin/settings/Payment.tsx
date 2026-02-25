import React from "react";

const Payment = ({ handleSubmit, formData, handlePaymentSettingChange }: any) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Settings</h2>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="platformCommission"
            className="block text-sm font-medium text-gray-700 mb-1">
            Platform Commission (%)
          </label>
          <input
            type="number"
            id="platformCommission"
            value={formData.paymentSettings.platformCommission}
            onChange={(e) =>
              handlePaymentSettingChange("platformCommission", parseFloat(e.target.value))
            }
            min="0"
            max="50"
            step="0.5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">Percentage taken by platform from each sale</p>
        </div>

        <div>
          <label htmlFor="minimumPayout" className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Payout Amount (₦)
          </label>
          <input
            type="number"
            id="minimumPayout"
            value={formData.paymentSettings.minimumPayout}
            onChange={(e) =>
              handlePaymentSettingChange("minimumPayout", parseFloat(e.target.value))
            }
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="payoutSchedule" className="block text-sm font-medium text-gray-700 mb-1">
            Payout Schedule
          </label>
          <select
            id="payoutSchedule"
            value={formData.paymentSettings.payoutSchedule}
            onChange={(e) => handlePaymentSettingChange("payoutSchedule", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Auto-approve Payments</h3>
            <p className="text-sm text-gray-500">
              Automatically approve successful payments without manual review
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              title="autoApprove"
              type="checkbox"
              checked={formData.paymentSettings.autoApprovePayments}
              onChange={() =>
                handlePaymentSettingChange(
                  "autoApprovePayments",
                  !formData.paymentSettings.autoApprovePayments,
                )
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors">
            Save Payment Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
