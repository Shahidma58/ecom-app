// components/VendorSelector.tsx
import React, { useState, useRef, useEffect } from "react";
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
//  fetchVendorApi: (ac_no: string) => Promise<any>;
}

export default function VendorSelector({
  onVendorSelect,
//  fetchVendorApi,
}: VendorSelectorProps) {
  const [vendorName, setVendorName] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vendorDetails, setVendorDetails] = useState<VendorData | null>(null);
  const acNo_Ref = useRef<HTMLInputElement>(null);
// Add this useEffect at the top of your component, after your state declarations
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
//    if (!resp.ok) throw new Error(data.error || "Failed to fetch Vendor");
// console.log('get vendor....');
// console.log(data);
    return data;

  };

//   const fetchVendor = async (ac_no: string) => {
//     if (!ac_no || ac_no.trim() === "") {
//       setVendorId("");
//       setVendorDetails(null);
//       onVendorSelect(null);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const data = await fetchVendorApi(ac_no);
// // console.log('into get vendor....');
// //       console.log(data);
//       if (data.success && data.data) {
//         const vendor = data.data;
//         setVendorId(vendor.ac_no);
//         setVendorName(vendor.ac_title);
//         setVendorDetails(vendor);
//         onVendorSelect(vendor);
//       } else {
// //        setVendorName(data.error);
//         setError("Vendor not found");
//         setVendorId("");
//         setVendorDetails(null);
//         onVendorSelect(null);
//         if (acNo_Ref.current) {
//           acNo_Ref.current.focus();
//           acNo_Ref.current.select(); 
//         }      
//       }
//     } catch (err) {
//       console.error("Error fetching vendor:", err);
//       setError(err instanceof Error ? err.message : "Failed to fetch vendor");
//       setVendorId("");
//       setVendorDetails(null);
//       onVendorSelect(null);
//     } finally {
//       setLoading(false);
//     }
//   };

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
//       toast.error("Vendor not found")
      setError("Vendor not found");
//      setVendorId("");
      setVendorDetails(null);
      onVendorSelect(null);
    }
  } catch (err) {
    console.error("Error fetching vendor:", err);
//    toast.error(err instanceof Error ? err.message : "Failed to fetch vendor");
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-300 pb-1 mb-1">
      <div className="grid grid-cols-12 gap-4 items-start">
        {/* Vendor Name Input */}
        <div className="flex col-span-3 pt-2">
          {/* <label className="text-xs font-semibold text-gray-700 mb-2 block"> */}
            Vendor A/c:
          {/* </label> */}
          <input
            type="text"
            ref={acNo_Ref}
            maxLength={6}
            placeholder="Vendor A/c"
            className="w-25 ml-2 px-1 py-1 text-md border border-gray-300 rounded-lg bg-white transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 focus:outline-none"
            value={vendorId}
            onChange={handleVendorIdChange}
            onBlur={handleVendorNameBlur}
            disabled={loading}
          />

        </div>

        {/* Vendor ID Display */}
        <div className="flex col-span-5 pt-2">
          <div className="flex col-span-3 pt-1">
          {/* <label className="text-xs font-semibold text-gray-700 mb-2 block"> */}
            Title: 
          {/* </label> */}
          </div>
          <div className="ml-2 w-80 min-h-8 px-1 py-1 text-sm border border-gray-300 rounded-lg bg-white text-black-700 font-medium  flex items-center">
            {loading ? (
              <span className="text-gray-400 italic">Loading...</span>
            ) : vendorDetails ? (

              <span 
              // className="w-80 ml-2 px-1 py-1 text-md border border-gray-300 rounded-lg bg-white transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 focus:outline-none"
              >
                {vendorDetails.ac_title}
                </span>

            ) : (
              <span className="text-gray-400 italic">-</span>
            )}
          </div>
        </div>
        
        <div className="flex col-span-4 pt-2">
          <div className="flex col-span-3 pt-1">
              Current Balance: 
              </div>
            <div className="ml-2 w-40 min-h-8 px-1 py-1 text-sm border border-gray-300 rounded-lg bg-white text-black-700 font-medium  flex items-center">
                {/* {Number(vendorDetails?.curr_bal).toFixed(2)} */}
                {vendorDetails?.curr_bal ? Number(vendorDetails.curr_bal).toFixed(2) : " 0.00"}
            </div>

        </div>
        {/* Vendor Contact
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
        </div> */}
      </div>

      {/* Additional Vendor Details - Optional */}
      {/* {vendorDetails && (
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
      )} */}

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