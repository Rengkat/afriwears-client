import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiUserCheck,
  FiUserX,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

const StatCard = ({ stylists }: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Stylists</p>
            <p className="text-2xl font-bold text-gray-900">{stylists.length}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-full">
            <FiUserCheck className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Verified Stylists</p>
            <p className="text-2xl font-bold text-gray-900">
              {stylists.filter((s) => s.verificationStatus === "verified").length}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-full">
            <FiCheckCircle className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Pending Verification</p>
            <p className="text-2xl font-bold text-gray-900">
              {stylists.filter((s) => s.verificationStatus === "pending").length}
            </p>
          </div>
          <div className="bg-amber-50 p-3 rounded-full">
            <FiClock className="text-amber-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              ₦{stylists.reduce((sum, s) => sum + s.totalRevenue, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-full">
            <FiDollarSign className="text-purple-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
