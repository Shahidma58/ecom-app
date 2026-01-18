"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { api, setAccessToken } from "@/app/lib/apiClient";
import useTransaction from "@/app/hooks/useTransaction";
import TransactionHeader from "@/app/custom_components/transaction/TransactionHeader";
import VendorSelector from "@/app/custom_components/transaction/VendorSelector";
import TransactionInputForm from "@/app/custom_components/transaction/TransactionInputForm";
import TransactionFooter from "@/app/custom_components/transaction/TransactionFooter";
import TransactionItemsTable from "@/app/custom_components/transaction/TransactionItemsTable";

const gVars = { gUser: "Demo User" };

const calc_dayofyear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

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
  const { user, accessToken, isLoading } = useAuth();
  const wTrn_Dt = calc_dayofyear();
  const wStr_Dt = get_str_date();
  const [selectedVendor, setSelectedVendor] = useState<VendorData | null>(null);
  const [amountPaid, setAmountPaid] = useState<string>("");

  // Fetch vendor function
  // const fetchVendorApi = async (ac_no: string) => {
  //   const resp = await api.get(`/api/pos/accts/get_acct/${ac_no}`);
  //   const data = await resp.json();
  //   if (!resp.ok) throw new Error(data.error || "Failed to fetch Vendor");
  //   return data;
  // };

  const {
    form,
    items,
    totals,
    loading,
    error,
    returnMode,
    // customerMobile,
    setReturnMode,
    // setCustomerMobile,
    setError,
    fetchProduct,
    handleAddItem,
    handleInputChange,
    handleRemoveItem,
    handleQuantityChange,
  } = useTransaction({
    initialUser: gVars.gUser,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/pos/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
    }
  }, [accessToken]);

  if (!user) {
    return null;
  }

  const handleSavePurchase = async () => {
    // Validate vendor selection
    if (!selectedVendor) {
      setError("Please select a vendor before saving the purchase");
      return;
    }

    // Validate amount paid
    const paidAmount = parseFloat(amountPaid) || 0;
    if (paidAmount < 0) {
      setError("Amount paid cannot be negative");
      return;
    }

    if (paidAmount > totals.sal_amt) {
      setError("Amount paid cannot exceed total purchase amount");
      return;
    }

    try {
      setError(null);

      const tranPayload = {
        purchaseTots: {
          ...totals,
          vendor_ac_no: selectedVendor.ac_no,
          vendor_name: selectedVendor.ac_title,
        },
        purchaseItms: items,
        tran_dt: wTrn_Dt,
        isReturn: returnMode,
        vendor: selectedVendor,
        branchCode: user?.branch_code || 1,
        amountPaid: paidAmount,
      };

      // Different API endpoint for purchases
      const apiResponse = await api.post("/api/pos/save_purchase", tranPayload);
      const data = await apiResponse.json();

      if (!apiResponse.ok || !data.success)
        throw new Error(data.message || "Failed to save purchase");

      router.push(`/pos/purchase-bill/${data.pur_id}`);
    } catch (error) {
      console.error("Error Saving Purchase:", error);
      setError(
        error instanceof Error ? error.message : "Failed to Save Purchase"
      );
    }
  };

  const handleVendorSelect = (vendorData: VendorData | null) => {
    setSelectedVendor(vendorData);
    if (!vendorData) {
      setError("Vendor not found or invalid");
    } else {
      setError(null);
    }
  };

  const handleAmountPaidChange = (value: string) => {
    // Only allow numeric input with up to 2 decimal places
    const regex = /^\d*\.?\d{0,2}$/;
    if (value === "" || regex.test(value)) {
      setAmountPaid(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col text-gray-800">
      <TransactionHeader
        title="HerbaGlam - Purchase Entry"
        branchCode={user?.branch_code}
        userName={user?.name}
        dateString={wStr_Dt}
        transactionType="purchase"
      />

      <div className="max-w-full mt-2 mx-auto px-4 pb-3 flex-1 flex flex-col">
        {/* Vendor Selection Component */}
        <VendorSelector
          onVendorSelect={handleVendorSelect}
//          fetchVendorApi={fetchVendorApi}
        />

        <TransactionInputForm
          form={form}
          returnMode={returnMode}
          onInputChange={handleInputChange}
          onCodeBlur={() => fetchProduct(form.itm_cd)}
          onEnterPress={handleAddItem}
          onReturnToggle={() => setReturnMode(!returnMode)}
          labels={{
            code: "Product Code",
            description: "Supplier Product",
            quantity: "Qty",
            price: "Cost Price",
            discount: "Trade Disc",
            netPrice: "Net Cost",
            total: "Total Cost",
          }}
        />

        <TransactionItemsTable
          items={items}
          returnMode={returnMode}
          onQuantityChange={handleQuantityChange}
          onRemoveItem={handleRemoveItem}
          emptyMessage="No purchase items added yet"
          headers={{
            code: "Code",
            description: "Product Description",
            quantity: "Qty",
            price: "Cost",
            discount: "Trade Disc",
            netPrice: "Net Cost",
            total: "Total Cost",
          }}
        />

        <TransactionFooter
          totals={totals}
          returnMode={returnMode}
          loading={loading}
          customerMobile={amountPaid}
          onMobileChange={handleAmountPaidChange}
          onSave={handleSavePurchase}
          disabled={items.length === 0 || !selectedVendor || amountPaid === "" }
          labels={{
            items: "Items",
            quantity: "Qty",
            discount: "Trade Disc",
            netAmount: "Total Cost",
            mobile: "Amount Paid",
            mobilePlaceholder: "0.00",
            saveButton: "💾 Save Purchase",
            saveReturnButton: "💾 Save Purchase Return",
            loadingText: "Saving...",
          }}
        />

        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}