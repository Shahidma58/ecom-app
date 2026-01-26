"use client";

import React, { useEffect, useState } from "react";
import { usePurchaseStore } from "../../../zu_store/purch_store";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { calc_dayofyear } from "@/app/lib/udfs";
import TransactionHeader from "@/app/custom_components/transaction/TransactionHeader";
import VendorSelector from "@/app/custom_components/transaction/VendorSelector";
import TranInputForm from "./tran_inp";
import TranItemsTable from "./tran_table";
import Tran_Footer from "./tran_footer";

//import { Toaster } from "react-hot-toast"; // Add this if using toast

const get_str_date = () => new Date().toISOString().split("T")[0];

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

export default function Purchase01() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const wStr_Dt = get_str_date();
  const [selectedVendor, setSelectedVendor] = useState<VendorData | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/pos/login");
    }
  }, [user, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect if no user (safety check)
  if (!user) {
    return null;
  }

  const handleVendorSelect = (vendorData: VendorData | null) => {
    setSelectedVendor(vendorData);
    if (!vendorData) {
      setError("Vendor not found or invalid");
    } else {
      setError("");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col text-gray-800">
        <TransactionHeader
          title="AmieEMI - Purchases"
          branchCode={user?.branch_code}
          userName={user?.name}
          dateString={wStr_Dt}
          transactionType="purchase"
        />
        <div className="min-h-screen mt-2  px-4 pb-3 flex-1 flex flex-col">
          <VendorSelector onVendorSelect={handleVendorSelect} />
          <TranInputForm />
          <TranItemsTable />
          <Tran_Footer />
          {error && (
            <div className="mt-3 bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
