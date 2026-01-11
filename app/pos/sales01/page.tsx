"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { api, setAccessToken } from "@/app/lib/apiClient";
import useTransaction from "@/app/hooks/useTransaction";
import TransactionHeader from "@/app/custom_components/transaction/TransactionHeader";
import TransactionInputForm from "@/app/custom_components/transaction/TransactionInputForm";
import TransactionItemsTable from "@/app/custom_components/transaction/TransactionItemsTable";
import TransactionFooter from "@/app/custom_components/transaction/TransactionFooter";


const gVars = { gUser: "Demo User" };

const calc_dayofyear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

const get_str_date = () => new Date().toISOString().split("T")[0];

export default function Sales01() {
  const router = useRouter();
  const { user, accessToken, isLoading } = useAuth();
  const wTrn_Dt = calc_dayofyear();
  const wStr_Dt = get_str_date();

  // Fetch product function for the hook
  // const fetchProductApi = async (prd_cd: number) => {
  //   const resp = await api.get(`/api/pos/get_prod?prd_cd=${prd_cd}`);
  //   const data = await resp.json();
  //   if (!resp.ok) throw new Error(data.error || "Failed to fetch Product");
  //   return data;
  // };

  const {
    form,
    items,
    totals,
    loading,
    error,
    returnMode,
    customerMobile,
    setReturnMode,
    setCustomerMobile,
    setError,
    fetchProduct,
    handleAddItem,
    handleInputChange,
    handleRemoveItem,
    handleQuantityChange,
  } = useTransaction({
    initialUser: gVars.gUser,
    // fetchProductApi,
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

  const handleSaveTran = async () => {
    try {
      setError(null);

      const tranPayload = {
        salTots: totals,
        salItms: items,
        tran_dt: wTrn_Dt,
        isReturn: returnMode,
      };

      const apiResponse = await api.post("/api/pos/save_tran", tranPayload);
      const data = await apiResponse.json();

      if (!apiResponse.ok || !data.success)
        throw new Error(data.message || "Failed to save transaction");

      router.push(`/pos/bill/${data.tran_id}`);
    } catch (error) {
      console.error("Error Updating Transaction:", error);
      setError(
        error instanceof Error ? error.message : "Failed to Update Transaction"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col text-gray-800">
       <TransactionHeader
        title="HerbaGlam - Cosmetics Universe"
        branchCode={user?.branch_code}
        userName={user?.name}
        dateString={wStr_Dt}
        transactionType="sale"
      />

      <div className="max-w-full mt-2 mx-auto px-4 pb-3 flex-1 flex flex-col">
        <TransactionInputForm
          form={form}
          returnMode={returnMode}
          onInputChange={handleInputChange}
          onCodeBlur={() => fetchProduct(form.itm_cd)}
          onEnterPress={handleAddItem}
          onReturnToggle={() => setReturnMode(!returnMode)}
          labels={{
            returnButton: "Return",
          }}
        />

        <TransactionItemsTable
          items={items}
          returnMode={returnMode}
          onQuantityChange={handleQuantityChange}
          onRemoveItem={handleRemoveItem}
        />

        <TransactionFooter
          totals={totals}
          returnMode={returnMode}
          loading={loading}
          customerMobile={customerMobile}
          onMobileChange={setCustomerMobile}
          onSave={handleSaveTran}
          disabled={items.length === 0}
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