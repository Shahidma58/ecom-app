import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
//import { toast } from "react-hot-toast";
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
}

export default function VendorSelector({
  onVendorSelect,
}: VendorSelectorProps) {
  const [vendorId, setVendorId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vendorDetails, setVendorDetails] = useState<VendorData | null>(null);
  const acNo_Ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error && acNo_Ref.current) {
      acNo_Ref.current.focus();
      acNo_Ref.current.select();
    }
  }, [error]);

  // Fetch vendor function
  const fetchVendorApi = async (ac_no: string) => {
    const resp = await fetch(`/api/pos/accts/get_acct/${ac_no}`);
    const data = await resp.json();
    return data;
  };

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
        setVendorDetails(vendor);
        onVendorSelect(vendor);
        toast.success("Vendor selected successfully!");
      } else {
        toast.error("Vendor not found");
        setError("Vendor not found");
        //      setVendorId("");
        setVendorDetails(null);
        onVendorSelect(null);
      }
    } catch (err) {
      console.error("Error fetching vendor:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to fetch vendor",
      );
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
    <div className="bg-gray-50 rounded-xl shadow-md border border-gray-200 py-1 px-4 mb-1">
      <div className="flex gap-6 items-center">
        {/* Vendor Account Input */}
        <div className="flex items-center gap-2 w-1/4">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Vendor A/c:
          </label>
          <input
            type="text"
            ref={acNo_Ref}
            maxLength={6}
            placeholder="Enter A/c"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition"
            value={vendorId}
            onChange={handleVendorIdChange}
            onBlur={handleVendorNameBlur}
            disabled={loading}
          />
        </div>

        {/* Vendor Title */}
        <div className="flex items-center gap-2 w-2/4">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Title:
          </label>
          <div className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white flex items-center min-h-[40px]">
            {loading ? (
              <span className="text-gray-400 italic">Loading...</span>
            ) : vendorDetails ? (
              <span className="text-gray-800 font-medium">
                {vendorDetails.ac_title}
              </span>
            ) : (
              <span className="text-gray-400 italic">-</span>
            )}
          </div>
        </div>

        {/* Current Balance */}
        <div className="flex items-center gap-2 w-1/4">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Current Balance:
          </label>
          <div className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white flex items-center min-h-[40px]">
            <span className="text-gray-800 font-medium">
              {vendorDetails?.curr_bal
                ? Number(vendorDetails.curr_bal).toFixed(2)
                : "0.00"}
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
          <span className="text-red-500">⚠️</span>
          {error}
        </div>
      )}
    </div>
  );
}
