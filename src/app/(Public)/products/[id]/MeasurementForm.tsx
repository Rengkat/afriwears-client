"use client";
import { useState } from "react";
import { FiUpload, FiInfo } from "react-icons/fi";
// import { usePaystackPayment } from "react-paystack";

// Mock data for the product and user
const mockProduct = {
  id: "prod123",
  name: "Premium Ankara Jumpsuit",
  minPrice: 25000,
  maxPrice: 32000,
  stylist: "Amina Couture",
  image: "/product-1.jpg",
};

const mockUser = {
  id: "user123",
  email: "customer@example.com",
  name: "John Doe",
};

const MeasurementsForm = () => {
  // All measurements in a single state object
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

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMeasurements((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Calculate order amounts
  const averagePrice = (mockProduct.minPrice + mockProduct.maxPrice) / 2 + 500;
  const amountPaid = averagePrice * 0.6; // 60% deposit
  const shippingFee = 1500;
  const totalDue = amountPaid + shippingFee;
  const balanceDue = averagePrice - amountPaid;

  // Paystack payment config
  const config = {
    reference: `order_${new Date().getTime()}`,
    email: mockUser.email,
    amount: totalDue * 100, // Paystack expects amount in kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_your_key",
  };

  // const initializePayment = usePaystackPayment(config);

  const onSuccess = () => {
    // In a real app, you would submit the order here
    console.log("Payment successful!", {
      product: mockProduct,
      measurements,
      image: imagePreview,
      amountPaid,
      balanceDue,
    });
    alert("Order placed successfully!");
  };

  const onClose = () => {
    console.log("Payment closed");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!measurements.waist) {
      setError("Please provide at least your waist measurement");
      return;
    }

    // initializePayment(onSuccess, onClose);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Custom Measurements</h2>
      <p className="text-gray-600 mb-6">
        Provide your measurements for a perfect fit. All measurements should be in centimeters.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 flex items-start">
          <FiInfo className="mt-0.5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Collapse/Expand Button */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-amber-600 hover:text-amber-700 text-sm font-medium mb-4">
          {isCollapsed ? "Show All Measurements" : "Hide Measurements"}
        </button>

        {/* Measurements Grid */}
        {!isCollapsed && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Upper Body */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 border-b pb-2">Upper Body</h3>
              <MeasurementInput
                label="Bust/Chest"
                name="bustOrChest"
                value={measurements.bustOrChest}
                onChange={handleInputChange}
              />
              <MeasurementInput
                label="Waist*"
                name="waist"
                value={measurements.waist}
                onChange={handleInputChange}
                required
              />
              <MeasurementInput
                label="Hips"
                name="hips"
                value={measurements.hips}
                onChange={handleInputChange}
              />
              <MeasurementInput
                label="Upper Bust"
                name="upperBust"
                value={measurements.upperBust}
                onChange={handleInputChange}
              />
              <MeasurementInput
                label="Neck"
                name="neck"
                value={measurements.neck}
                onChange={handleInputChange}
              />
            </div>

            {/* Lower Body */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 border-b pb-2">Lower Body</h3>
              <MeasurementInput
                label="Shoulder"
                name="shoulder"
                value={measurements.shoulder}
                onChange={handleInputChange}
              />
              <MeasurementInput
                label="Arm"
                name="arm"
                value={measurements.arm}
                onChange={handleInputChange}
              />
              <MeasurementInput
                label="Wrist"
                name="wrist"
                value={measurements.wrist}
                onChange={handleInputChange}
              />
              <MeasurementInput
                label="Hip to Knee"
                name="hipToKnee"
                value={measurements.hipToKnee}
                onChange={handleInputChange}
              />
              <MeasurementInput
                label="Inside Leg"
                name="insideLegOrInseam"
                value={measurements.insideLegOrInseam}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}

        {/* Material Sample Upload */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-3">Material Sample (Optional)</h3>
          <label className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-amber-500 transition-colors">
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Material sample"
                    className="h-32 object-contain mb-2"
                  />
                  <p className="text-sm text-gray-600">Click to change image</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <FiUpload className="text-gray-400 text-2xl mb-2" />
                  <p className="text-sm text-gray-600">Click to upload material sample</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                </div>
              )}
            </div>
            <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
          </label>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-700 mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Product:</span>
              <span className="font-medium">{mockProduct.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="font-medium">₦{averagePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Deposit (60%):</span>
              <span className="font-medium">₦{amountPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium">₦1,500</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span className="text-gray-800 font-medium">Total Due Now:</span>
              <span className="text-amber-600 font-bold">₦{totalDue.toLocaleString()}</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              *Balance of ₦{balanceDue.toLocaleString()} to be paid before delivery
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          type="submit"
          disabled={loading || !measurements.waist}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-md font-medium disabled:bg-amber-400 transition-colors">
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>

        <div className="mt-4 text-center text-sm text-gray-500">
          Need help with measurements?{" "}
          <button
            type="button"
            className="text-amber-600 hover:underline"
            onClick={() => alert("Measurement guide would open here")}>
            View our measurement guide
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
    <input
      type="number"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
      placeholder={`Enter ${label.toLowerCase()} in cm`}
      required={required}
    />
  </div>
);

export default MeasurementsForm;
