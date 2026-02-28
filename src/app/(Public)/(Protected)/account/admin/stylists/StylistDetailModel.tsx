import { useGetStylistDetailQuery } from "@/redux/services/StylistApiSlice";
import { formatCurrency, formatDate, getStatusColor, getVerificationColor } from "@/Utils/utils";
import {
  FiAlertCircle,
  FiAward,
  FiMapPin,
  FiUserCheck,
  FiUserX,
  FiXCircle,
  FiPhone,
  FiMail,
  FiGlobe,
  FiPackage,
  FiDollarSign,
  FiStar,
  FiLoader,
  FiFileText,
  FiTag,
} from "react-icons/fi";
interface StylistDetailModelProps {
  handleEditStylist: (stylist: any) => void;
  setShowStylistModal: (show: boolean) => void;
  selectedStylist: any;
  handleSuspendStylist: (stylist: any) => void;
  handleActivateStylist: (stylistId: string) => void;
  handleApproveStylist: (stylistId: string) => void;
  setShowVerificationModal?: (show: boolean) => void;
  setSelectedStylist?: (stylist: any) => void;
}

const StylistDetailModel = ({
  handleEditStylist,
  setShowStylistModal,
  selectedStylist,
  handleSuspendStylist,
  handleActivateStylist,
  handleApproveStylist,
  setShowVerificationModal,
  setSelectedStylist,
}: StylistDetailModelProps) => {
  // Fetch detailed stylist data
  const {
    data: detailData,
    isLoading,
    error,
  } = useGetStylistDetailQuery(selectedStylist?._id, {
    skip: !selectedStylist?._id,
    refetchOnMountOrArgChange: true,
  });

  // Use detailed data if available, otherwise fall back to selectedStylist
  const stylistData = detailData?.stylist || selectedStylist;

  // Safely access properties with defaults
  const companyName = stylistData?.companyName || stylistData?.company || "No Company Name";
  const avatar = stylistData?.avatar || "";
  const email = stylistData?.email || "";

  // Handle specialty as array
  const specialtyArray = Array.isArray(stylistData?.specialty)
    ? stylistData.specialty
    : stylistData?.specialty
      ? [stylistData.specialty]
      : [];

  const experience = stylistData?.experience || "Not specified";
  const description = stylistData?.description || "No description provided";
  const phone = stylistData?.phone || "Not provided";
  const website = stylistData?.website || "";
  const rating = stylistData?.rating || 0;
  const reviews = stylistData?.reviews || 0;

  // Location with safe defaults
  const location = stylistData?.location || {};
  const address = location?.address || "";
  const state = location?.state || "";
  const lga = location?.lga || "";
  const branches = location?.branches || 1;

  // Social Media
  const socialMedia = stylistData?.socialMedia || {};

  // Services
  const services = stylistData?.services || [];

  // Documents
  const documents = stylistData?.documents || {
    cacCertificate: "",
    businessRegistration: "",
    taxCertificate: "",
  };
  const cacCertificateNumber = stylistData?.cacCertificateNumber || "Not provided";

  // Portfolio
  const portfolio = stylistData?.portfolio || [];

  // Verification and Status
  const verificationStatus = stylistData?.verificationStatus || "pending";
  const isCompanyVerified = stylistData?.isCompanyVerified || false;
  const rejectionReason = stylistData?.rejectionReason || "";
  const status = stylistData?.status || "active";
  const suspensionReason = stylistData?.suspensionReason || "";

  // Dates
  const joinedDate = stylistData?.createdAt || new Date();
  const verificationDate = stylistData?.verificationDate || "";
  const verifiedBy = stylistData?.verifiedBy?.name || stylistData?.verifiedBy || "Not verified yet";

  // Owner info - with detailed population
  const owner = stylistData?.owner || {};
  const ownerName =
    owner?.name || `${owner?.firstName || ""} ${owner?.surname || ""}`.trim() || "Unknown";
  const ownerEmail = owner?.email || "";
  const ownerAvatar = owner?.avatar || "";
  const ownerPhone = owner?.phone || "";

  // Performance metrics
  const totalProducts = stylistData?.totalProducts || 0;
  const totalOrders = stylistData?.totalOrders || 0;
  const totalRevenue = stylistData?.totalRevenue || 0;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center">
                <FiLoader className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600">Loading detailed stylist information...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Stylist Details</h3>
              <button
                title="closeModal"
                onClick={() => setShowStylistModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                <FiXCircle size={24} />
              </button>
            </div>
            <div className="text-center py-8">
              <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Failed to load details</h4>
              <p className="text-gray-600 mb-4">Unable to fetch detailed stylist information.</p>
              <p className="text-sm text-gray-500">Using basic information from the list view.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Stylist Details</h3>
            <button
              title="closeModal"
              onClick={() => setShowStylistModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              <FiXCircle size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Stylist Header */}
            <div className="flex items-start gap-6">
              <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                {avatar ? (
                  <img
                    className="h-24 w-24 rounded-full object-cover"
                    src={avatar}
                    alt={companyName}
                  />
                ) : (
                  <FiUserCheck className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-semibold text-gray-900">{companyName}</h4>

                {/* Specialties display as tags */}
                <div className="mt-2">
                  {specialtyArray.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {specialtyArray.map((spec: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                          <FiTag size={12} />
                          {spec}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No specialties specified</p>
                  )}
                </div>

                <p className="text-gray-500 flex items-center gap-2 mt-3">
                  <FiMail size={14} /> {email}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getVerificationColor(
                      verificationStatus,
                    )}`}>
                    {verificationStatus.toUpperCase()}
                  </span>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                      status,
                    )}`}>
                    {status.toUpperCase()}
                  </span>
                  {isCompanyVerified && (
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                      Can Add Products
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h5 className="font-semibold text-gray-900 mb-4">Business Information</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <div className="flex items-center gap-2 mt-1">
                      <FiMapPin className="text-gray-400" size={16} />
                      <p className="text-sm font-medium text-gray-900">
                        {address ? `${address}, ${lga}, ${state}` : "Location not specified"}
                      </p>
                    </div>
                    {branches > 1 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {branches} branch{branches > 1 ? "es" : ""}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <div className="flex items-center gap-2 mt-1">
                      <FiAward className="text-gray-400" size={16} />
                      <p className="text-sm font-medium text-gray-900">{experience}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <div className="flex items-center gap-2 mt-1">
                      <FiPhone className="text-gray-400" size={16} />
                      <p className="text-sm font-medium text-gray-900">{phone}</p>
                    </div>
                  </div>
                  {website && (
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <div className="flex items-center gap-2 mt-1">
                        <FiGlobe className="text-gray-400" size={16} />
                        <a
                          href={website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 break-all">
                          {website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-sm text-gray-900 mt-1">{description}</p>

                  {/* Specialties summary */}
                  {specialtyArray.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Specialties</p>
                      <p className="text-sm text-gray-900 mt-1">{specialtyArray.join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Services */}
              {services.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Services</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {services.map((service: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CAC Information */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">CAC Certificate Number</p>
                  <p className="text-sm font-medium text-gray-900">{cacCertificateNumber}</p>
                </div>
                {verificationStatus === "verified" && verificationDate && (
                  <div>
                    <p className="text-sm text-gray-500">Verified On</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(verificationDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Documents Section */}
            {(documents.cacCertificate ||
              documents.businessRegistration ||
              documents.taxCertificate) && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h5 className="font-semibold text-gray-900 mb-4">Business Documents</h5>
                <div className="space-y-3">
                  {documents.cacCertificate && (
                    <div className="flex items-center gap-3">
                      <FiFileText className="text-blue-500" size={20} />
                      <a
                        href={documents.cacCertificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View CAC Certificate
                      </a>
                    </div>
                  )}
                  {documents.businessRegistration && (
                    <div className="flex items-center gap-3">
                      <FiFileText className="text-blue-500" size={20} />
                      <a
                        href={documents.businessRegistration}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View Business Registration
                      </a>
                    </div>
                  )}
                  {documents.taxCertificate && (
                    <div className="flex items-center gap-3">
                      <FiFileText className="text-blue-500" size={20} />
                      <a
                        href={documents.taxCertificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View Tax Certificate
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Performance Metrics */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Performance Metrics</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <FiPackage className="text-gray-400" size={16} />
                    <p className="text-sm text-gray-600">Products</p>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{totalOrders}</div>
                  <p className="text-sm text-gray-600">Orders</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <FiDollarSign className="text-gray-400" size={20} />
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(totalRevenue)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-2xl font-bold text-gray-900">{rating.toFixed(1)}</span>
                    <FiStar className="text-amber-500" size={20} />
                  </div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="text-xs text-gray-500">({reviews} reviews)</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            {(socialMedia.twitter ||
              socialMedia.facebook ||
              socialMedia.instagram ||
              socialMedia.pinterest) && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h5 className="font-semibold text-gray-900 mb-4">Social Media</h5>
                <div className="flex flex-wrap gap-4">
                  {socialMedia.twitter && (
                    <a
                      href={`https://twitter.com/${socialMedia.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-600 text-sm flex items-center gap-2">
                      <span>Twitter:</span>{" "}
                      <span className="font-medium">@{socialMedia.twitter}</span>
                    </a>
                  )}
                  {socialMedia.facebook && (
                    <a
                      href={`https://facebook.com/${socialMedia.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-2">
                      <span>Facebook:</span>{" "}
                      <span className="font-medium">{socialMedia.facebook}</span>
                    </a>
                  )}
                  {socialMedia.instagram && (
                    <a
                      href={`https://instagram.com/${socialMedia.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-800 text-sm flex items-center gap-2">
                      <span>Instagram:</span>{" "}
                      <span className="font-medium">@{socialMedia.instagram}</span>
                    </a>
                  )}
                  {socialMedia.pinterest && (
                    <a
                      href={`https://pinterest.com/${socialMedia.pinterest}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-800 text-sm flex items-center gap-2">
                      <span>Pinterest:</span>{" "}
                      <span className="font-medium">{socialMedia.pinterest}</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Owner Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h5 className="font-semibold text-gray-900 mb-4">Account Owner</h5>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {ownerAvatar ? (
                    <img
                      src={ownerAvatar}
                      alt={ownerName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <FiUserCheck className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{ownerName}</p>
                  <p className="text-sm text-gray-600">{ownerEmail}</p>
                  {ownerPhone && (
                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <FiPhone size={12} /> {ownerPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Rejection/Suspension Reason */}
            {(rejectionReason || suspensionReason) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <FiAlertCircle className="text-red-500" size={20} />
                  <h5 className="font-medium text-red-800">
                    {rejectionReason ? "Rejection Reason" : "Suspension Reason"}
                  </h5>
                </div>
                <p className="text-red-700 mt-1">{rejectionReason || suspensionReason}</p>
              </div>
            )}

            {/* Account Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Account Information</h5>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Joined Date</dt>
                    <dd className="text-sm text-gray-900">{formatDate(joinedDate)}</dd>
                  </div>
                  {verificationStatus === "verified" && verificationDate && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Verified Date</dt>
                      <dd className="text-sm text-gray-900">{formatDate(verificationDate)}</dd>
                    </div>
                  )}
                  {verificationStatus === "verified" && verifiedBy && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Verified By</dt>
                      <dd className="text-sm text-gray-900">{verifiedBy}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Last Updated</dt>
                    <dd className="text-sm text-gray-900">
                      {formatDate(stylistData?.updatedAt || joinedDate)}
                    </dd>
                  </div>
                </dl>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Business Documents</h5>
                <div className="space-y-2">
                  {documents.cacCertificate ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">CAC Certificate</span>
                      <a
                        href={documents.cacCertificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800">
                        View
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">CAC Certificate</span>
                      <span className="text-sm text-gray-500">Not uploaded</span>
                    </div>
                  )}

                  {documents.businessRegistration ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Business Registration</span>
                      <a
                        href={documents.businessRegistration}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800">
                        View
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Business Registration</span>
                      <span className="text-sm text-gray-500">Not uploaded</span>
                    </div>
                  )}

                  {documents.taxCertificate ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Tax Certificate</span>
                      <a
                        href={documents.taxCertificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800">
                        View
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Tax Certificate</span>
                      <span className="text-sm text-gray-500">Not uploaded</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Portfolio Preview */}
            {portfolio.length > 0 && (
              <div>
                <h5 className="font-semibold text-gray-900 mb-4">Portfolio ({portfolio.length})</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {portfolio.slice(0, 4).map((item: any, index: number) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden group">
                      <img
                        src={item.image}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {item.category && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 truncate">
                          {item.category}
                        </div>
                      )}
                    </div>
                  ))}
                  {portfolio.length > 4 && (
                    <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-500">+{portfolio.length - 4} more</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleEditStylist(stylistData)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Edit Stylist
              </button>

              {verificationStatus === "pending" && (
                <button
                  onClick={() => {
                    if (setShowVerificationModal && setSelectedStylist) {
                      // Open verification modal for detailed review
                      setSelectedStylist(stylistData);
                      setShowVerificationModal(true);
                      setShowStylistModal(false);
                    } else {
                      // Fallback to direct approval if modal props not provided
                      handleApproveStylist(stylistData._id);
                      setShowStylistModal(false);
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors">
                  {setShowVerificationModal ? "Review & Verify" : "Quick Approve"}
                </button>
              )}

              {status === "active" || !status ? (
                <button
                  onClick={() => {
                    handleSuspendStylist(stylistData);
                    setShowStylistModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                  Suspend Stylist
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleActivateStylist(stylistData._id);
                    setShowStylistModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                  Activate Stylist
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StylistDetailModel;
