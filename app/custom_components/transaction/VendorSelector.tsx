// components/VendorSelector.tsx
import React, { useState } from "react";

interface VendorData {
  ac_no: string;
  ac_title: string;
  ac_gl: string;
  ac_contact: string;
  ac_addr: string;
  curr_bal: string;
  generalLedger?: {
    gl_desc: string;
  };
}

interface VendorSelectorProps {
  onVendorSelect: (vendorData: VendorData | null) => void;
  fetchVendorApi: (ac_no: string) => Promise<any>;
}

export default function VendorSelector({
  onVendorSelect,
  fetchVendorApi,
}: VendorSelectorProps) {
  const [vendorName, setVendorName] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vendorDetails, setVendorDetails] = useState<VendorData | null>(null);

  const fetchVendor = async (ac_no: string) => {
    if (!ac_no || ac_no.trim() === "") {
      setVendorId("");
      setVendorDetails(null);
      onVendorSelect(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await fetchVendorApi(ac_no);

      if (data.success && data.data) {
        const vendor = data.data;
        setVendorId(vendor.ac_no);
        setVendorName(vendor.ac_title);
        setVendorDetails(vendor);
        onVendorSelect(vendor);
      } else {
        setError("Vendor not found");
        setVendorId("");
        setVendorDetails(null);
        onVendorSelect(null);
      }
    } catch (err) {
      console.error("Error fetching vendor:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch vendor");
      setVendorId("");
      setVendorDetails(null);
      onVendorSelect(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorNameBlur = () => {
    fetchVendor(vendorId);
  };

  const handleVendorIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setVendorId(e.target.value);
  setError(null);
};


  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-2 mb-3">
      <div className="grid grid-cols-12 gap-4 items-start">
        {/* Vendor Name Input */}
        <div className="col-span-6">
          <label className="text-xs font-semibold text-gray-700 mb-2 block">
            Vendor Account Number
          </label>
          <input
            type="text"
            placeholder="Enter vendor account number"
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 focus:outline-none"
            value={vendorId}
            onChange={handleVendorIdChange}
            onBlur={handleVendorNameBlur}
            disabled={loading}
          />

        </div>

        {/* Vendor ID Display */}
        <div className="col-span-3">
          <label className="text-xs font-semibold text-gray-700 mb-2 block">
            Vendor Name
          </label>
          <div className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium min-h-[42px] flex items-center">
            {loading ? (
              <span className="text-gray-400 italic">Loading...</span>
            ) : vendorDetails ? (
              <span className="truncate">{vendorDetails.ac_title}</span>
            ) : (
              <span className="text-gray-400 italic">-</span>
            )}
          </div>
        </div>

        {/* Vendor Contact */}
        <div className="col-span-3">
          <label className="text-xs font-semibold text-gray-700 mb-2 block">
            Contact
          </label>
          <div className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-700 min-h-[42px] flex items-center">
            {vendorDetails?.ac_contact ? (
              <span className="truncate">{vendorDetails.ac_contact}</span>
            ) : (
              <span className="text-gray-400 italic">-</span>
            )}
          </div>
        </div>
      </div>

      {/* Additional Vendor Details - Optional */}
      {vendorDetails && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-12 gap-4 text-xs">
            <div className="col-span-4">
              <span className="text-gray-500">Address:</span>
              <span className="ml-2 text-gray-700 font-medium">
                {vendorDetails.ac_addr || "-"}
              </span>
            </div>
            <div className="col-span-4">
              <span className="text-gray-500">GL Category:</span>
              <span className="ml-2 text-gray-700 font-medium">
                {vendorDetails.generalLedger?.gl_desc || "-"}
              </span>
            </div>
            <div className="col-span-4">
              <span className="text-gray-500">Current Balance:</span>
              <span className="ml-2 text-gray-700 font-medium">
                {Number(vendorDetails.curr_bal).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
          <span className="text-red-500">⚠️</span>
          {error}
        </div>
      )}
    </div>
  );
}