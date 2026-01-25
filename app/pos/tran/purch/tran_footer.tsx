"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../../lib/apiClient";
import { useRouter } from "next/navigation";

import { usePurchaseStore } from "../../../zu_store/purch_store";
import { gVars } from "@/app/app.config";
import { calc_dayofyear } from 'app/lib/udfs/calc_dayofyear';

export default function Tran_Footer() {
  const {
    totals,
    finalizeSale,
    items,
    updStorePaidAmt,
    setCustomerMobile
  } = usePurchaseStore();
  
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [returnMode, setReturnMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Local state for editable fields
  const [amountPaid, setAmountPaid] = useState<number>(totals.paid_amt || 0);
  const [mobileNumber, setMobileNumber] = useState<string>(totals.bch_mbl || "");


  //====================== SAVE PURCHASE ==========================
  const handleSavePurchase = async () => {
    try {
      setError(null);
      setIsLoading(true);
//=============================== generate tran id ========
      // const trn_dt = 20260116; // YYYYMMDD
      const trn_dt = parseInt(calc_dayofyear());
      console.log(' API next......');
      const apiResp = await api.post("/api/pos/get_next_trnseq", {
        brn_cd: gVars.gBrn_Cd,
        trn_dt: trn_dt,
      });
      console.log(' API after....');
      const pur_idd = await apiResp.json();
      console.log(pur_idd);
      //=============================================================
      const tranPayload = {
        purTots: {    // Changed from pur_Tots to purTots (match API)
          pur_id: pur_idd,
          brn_cd: gVars.gBrn_Cd,
          pur_dt: '2026-01-16',
          vnd_id: 210003,
          tot_itms: totals.bch_items,
          tot_qty: totals.bch_qty,
          tot_amt: totals.bch_amt,
          amt_paid: amountPaid, // Use local state
          amt_cr: totals.bch_amt - amountPaid, // Calculate credit amount
          inp_by: gVars.gUser,
        },
        purchaseItms: items, // Changed from pur_Itms to purchaseItms (match API)
        tran_dt: '2026-01-16',
        branchCode: gVars.gBrn_Cd,
      };

      console.log("Transaction Payload:", tranPayload);

      const apiResponse = await api.post("/api/pos/save_purchase", tranPayload);
      const data = await apiResponse.json();

      if (!apiResponse.ok || !data.success) {
        throw new Error(data.message || "Failed to save purchase");
      }

      router.push(`/pos/purchase-bill/${data.pur_id}`);
      finalizeSale();
    } catch (error) {
      console.error("Error Saving Purchase:", error);
      setError(
        error instanceof Error ? error.message : "Failed to Save Purchase"
      );
    } finally {
      setIsLoading(false);
    }
  };
//=======================================================================
    useEffect(() => {
       console.log("Paid amount updated:", totals.paid_amt);
    }, [totals.paid_amt]);

  // Handle amount paid change
  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAmountPaid(value);
  };
  // onBlur Paid Amount
  const upd_store_paid_amt = () => {
    updStorePaidAmt(amountPaid);
    // console.log('aaaaaaaaaaaaaaaa');
    // console.log(amountPaid);
    // console.log(totals.paid_amt);
  }
  const upd_store_cust_mbl = () => {
    setCustomerMobile(mobileNumber);
  }
  // Handle mobile number change
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    setMobileNumber(value);
  };

  return (
    <>
      <div className="bg-linear-to-r from-emerald-700 to-teal-600 text-white rounded-lg shadow-lg px-1 py-1 sticky bottom-0 mt-auto">
        <div className="flex grid-cols-7 gap-2 items-center">

          {/* ITEMS */}
          <div className="flex flex-col w-22">
            <span className="text-xs opacity-80">Items</span>
            <div className="bg-white/95 rounded-md p-1 text-center">
              <span className="text-emerald-700 text-base">
                {totals.bch_items}
              </span>
            </div>
          </div>

          {/* QTY */}
          <div className="flex flex-col w-22">
            <span className="text-xs opacity-80">Qty</span>
            <div className="bg-white/95 rounded-md p-1 text-center">
              <span className="text-emerald-700 text-base">
                {totals.bch_qty}
              </span>
            </div>
          </div>

          {/* Total Amount */}
          <div className="flex flex-col w-35">
            <span className="text-xs opacity-80">Total Amount</span>
            <div className="bg-white/95 rounded-md p-1 text-center">
              <span className="text-emerald-700 text-base">
                {totals.bch_amt.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Amount Paid - EDITABLE */}
          <div className="flex flex-col w-35">
            <span className="text-xs opacity-80">Amount Paid</span>
            <div className="bg-white/95 rounded-md p-1 text-center">
              <input
                name="amt_paid"
                type="number"
                value={amountPaid}
                onChange={handleAmountPaidChange}
                onBlur={upd_store_paid_amt}
                className="w-full text-emerald-700 text-center text-base"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* NET / Credit Amount */}
          <div className="flex flex-col w-35">
            <span className="text-xs opacity-80">Credit</span>
            <div
              className={`rounded-md p-1 text-center ${
                returnMode ? "bg-red-900" : "bg-white/95"
              }`}
            >
              <span
                className={`text-base ${
                  returnMode ? "text-red-100" : "text-emerald-700"
                }`}
              >
                {(totals.bch_amt - amountPaid).toFixed(2)}
              </span>
            </div>
          </div>

          {/* MOBILE - EDITABLE */}
          <div className="flex flex-col w-40">
            <span className="text-xs opacity-80">Mobile</span>
            <input
              type="text"
              value={mobileNumber}
              maxLength={15}
              onChange={handleMobileChange}
              onBlur={upd_store_cust_mbl}
              placeholder="03XX-XXXXXXX"
              className="w-full p-1 border rounded-md bg-white/95 text-emerald-700 text-center"
            />
          </div>

          {/* SAVE */}
          <div className="flex flex-col justify-end">
            <button
              onClick={handleSavePurchase}
              disabled={isLoading || items.length === 0}
              className="bg-emerald-900 mt-4 text-white px-4 py-1.5 rounded-md font-bold disabled:opacity-40 hover:bg-emerald-800 transition-colors"
            >
              {isLoading
                ? "Processing..."
                : returnMode
                ? "💾 Save Return"
                : "💾 Save"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}
      </div>
    </>
  );
}