import React from "react";
import { FiAlertTriangle, FiTrash2, FiCheckCircle, FiXCircle } from "react-icons/fi";

interface ConfirmationModalProps {
  config: {
    title: string;
    message: string;
    type: "delete" | "activate" | "suspend";
  };
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ config, onClose, onConfirm }) => {
  const getIcon = () => {
    switch (config.type) {
      case "delete":
        return <FiTrash2 className="h-6 w-6 text-red-600" />;
      case "activate":
        return <FiCheckCircle className="h-6 w-6 text-green-600" />;
      case "suspend":
        return <FiXCircle className="h-6 w-6 text-amber-600" />;
      default:
        return <FiAlertTriangle className="h-6 w-6 text-red-600" />;
    }
  };

  const getButtonColor = () => {
    switch (config.type) {
      case "delete":
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
      case "activate":
        return "bg-green-600 hover:bg-green-700 focus:ring-green-500";
      case "suspend":
        return "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500";
      default:
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-fade-in">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-2 rounded-full ${
                config.type === "delete"
                  ? "bg-red-100"
                  : config.type === "activate"
                  ? "bg-green-100"
                  : "bg-amber-100"
              }`}>
              {getIcon()}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
          </div>

          <p className="text-gray-600 mb-6">{config.message}</p>

          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 ${getButtonColor()} text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2`}>
              Confirm
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
