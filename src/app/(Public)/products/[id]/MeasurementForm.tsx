"use client";
import { useState } from "react";
import { FiUpload, FiInfo, FiCheck } from "react-icons/fi";

interface MeasurementsFormProps {
  product: any;
}

const MeasurementsForm: React.FC<MeasurementsFormProps> = ({ product }) => {
  const [measurements, setMeasurements] = useState({
    bustOrChest: "",
    waist: "",
    hips: "",
    upperBust: "",
    upperHip: "",
    neck: "",
    shoulder: "",
    tight: "",
    arm: "",
    wrist: "",
    frontBodice: "",
    hipToKnee: "",
    insideLegOrInseam: "",
    hipToAnkle: "",
    biceps: "",
    calf: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showPayment, setShowPayment] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMeasurements((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Calculate order amounts based on product price
  const depositPercentage = 0.6; // 60% deposit
  const shippingFee = 1500;
  const amountPaid = product.price * depositPercentage;
  const totalDue = amountPaid + shippingFee;
  const balanceDue = product.price - amountPaid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!measurements.waist) {
      setError("Please provide at least your waist measurement");
      return;
    }

    setLoading(true);
    // In a real app, you would submit the measurements here
    console.log("Submitting measurements:", {
      productId: product._id,
      productName: product.name,
      measurements,
      amountPaid,
      balanceDue,
    });

    setTimeout(() => {
      setLoading(false);
      setShowPayment(true);
      // Show success message
      alert("Measurements submitted successfully! Proceed to payment.");
    }, 1500);
  };

  const handlePayment = () => {
    // This would trigger actual payment
    console.log("Initiating payment for:", {
      product: product.name,
      totalDue,
    });
    // In a real app, you would integrate with Paystack or other payment gateway here
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Custom Measurements</h3>
          <p className="text-sm text-gray-600 mt-1">
            Provide your measurements for a perfect fit. All measurements should be in centimeters.
          </p>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-amber-600 hover:text-amber-700 text-sm font-medium px-3 py-1 border border-amber-200 rounded-md">
          {isCollapsed ? "Show All" : "Hide"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 flex items-start">
          <FiInfo className="mt-0.5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Essential Measurements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <MeasurementInput
            label="Waist*"
            name="waist"
            value={measurements.waist}
            onChange={handleInputChange}
            required={true}
          />
          <MeasurementInput
            label="Bust/Chest"
            name="bustOrChest"
            value={measurements.bustOrChest}
            onChange={handleInputChange}
          />
          <MeasurementInput
            label="Hips"
            name="hips"
            value={measurements.hips}
            onChange={handleInputChange}
          />
        </div>

        {/* Collapsible Additional Measurements */}
        {!isCollapsed && (
          <div className="mb-6 border-t pt-6">
            <h4 className="font-medium text-gray-700 mb-4">Additional Measurements (Optional)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MeasurementInput
                label="Shoulder"
                name="shoulder"
                value={measurements.shoulder}
                onChange={handleInputChange}
              />
              <MeasurementInput
                label="Arm Length"
                name="arm"
                value={measurements.arm}
                onChange={handleInputChange}
              />
              <MeasurementInput
                label="Neck"
                name="neck"
                value={measurements.neck}
                onChange={handleInputChange}
              />
              <MeasurementInput
                label="Inside Leg"
                name="insideLegOrInseam"
                value={measurements.insideLegOrInseam}
                onChange={handleInputChange}
              />
              <MeasurementInput
                label="Hip to Knee"
                name="hipToKnee"
                value={measurements.hipToKnee}
                onChange={handleInputChange}
              />
              <MeasurementInput
                label="Biceps"
                name="biceps"
                value={measurements.biceps}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}

        {/* Reference Image Upload */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Reference Image (Optional)</h4>
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Reference image"
                    className="h-40 object-contain mb-3 rounded"
                  />
                  <span className="text-sm text-amber-600">Click to change image</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <FiUpload className="text-gray-400 text-2xl mb-3" />
                  <p className="text-sm text-gray-600">Upload a reference photo</p>
                  <p className="text-xs text-gray-500 mt-1">
                    This helps us understand your desired fit
                  </p>
                </div>
              )}
            </div>
            <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
          </label>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Order Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{product.name}</span>
              <span className="font-medium">₦{product.price?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Deposit (60%)</span>
              <span className="font-medium">₦{amountPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">₦1,500</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span className="text-gray-800 font-medium">Total Due Now</span>
              <span className="text-amber-600 font-bold">₦{totalDue.toLocaleString()}</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Balance of ₦{balanceDue.toLocaleString()} to be paid before delivery
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading || !measurements.waist}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-md font-medium disabled:bg-amber-300 transition-colors flex items-center justify-center gap-2">
            {loading ? (
              "Processing..."
            ) : (
              <>
                <FiCheck /> Save Measurements
              </>
            )}
          </button>

          {showPayment && (
            <button
              type="button"
              onClick={handlePayment}
              className="flex-1 bg-gray-900 hover:bg-black text-white py-3 px-4 rounded-md font-medium transition-colors">
              Proceed to Payment
            </button>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-4 text-center text-sm text-gray-500">
          Need help with measurements?{" "}
          <button
            type="button"
            className="text-amber-600 hover:underline"
            onClick={() => alert("Open measurement guide modal")}>
            View measurement guide
          </button>
        </div>
      </form>
    </div>
  );
};

// Reusable measurement input component
const MeasurementInput = ({ label, name, value, onChange, required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 pr-10"
        placeholder="cm"
        required={required}
        min="0"
        step="0.1"
      />
      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
        cm
      </span>
    </div>
  </div>
);

export default MeasurementsForm;
