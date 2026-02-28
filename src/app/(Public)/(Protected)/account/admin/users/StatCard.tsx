import { FiUserCheck, FiUserX, FiMail } from "react-icons/fi";

// Define the User interface
interface User {
  _id: string;
  name?: string;
  email?: string;
  status: "active" | "suspended" | "inactive";
  isEmailVerified: boolean;
  // others
}

interface StatCardProps {
  users: User[];
}

const StatCard = ({ users }: StatCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-full">
            <FiUserCheck className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-2xl font-bold text-gray-900">
              {users.filter((u: User) => u.status === "active").length}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-full">
            <FiUserCheck className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Suspended</p>
            <p className="text-2xl font-bold text-gray-900">
              {users.filter((u: User) => u.status === "suspended").length}
            </p>
          </div>
          <div className="bg-red-50 p-3 rounded-full">
            <FiUserX className="text-red-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Pending Verification</p>
            <p className="text-2xl font-bold text-gray-900">
              {users.filter((u: User) => !u.isEmailVerified).length}
            </p>
          </div>
          <div className="bg-amber-50 p-3 rounded-full">
            <FiMail className="text-amber-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
