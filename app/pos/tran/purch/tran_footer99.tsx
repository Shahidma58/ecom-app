"use client";

import React, { useState } from "react";
import { api } from "../../../lib/apiClient";
import { useRouter } from "next/navigation";

import { usePurchaseStore } from "../../../zu_store/purch_store";
import { gVars } from "@/app/app.config";
import { calc_dayofyear } from "app/lib/udfs/calc_dayofyear";

export default function Tran_Footer() {
  const { totals, finalizeSale, items } = usePurchaseStore();
  const router = useRouter();

  //  const disabled = items.length === 0;
  const [error, setError] = useState<string | null>(null);
  const [returnMode, setReturnMode] = useState(false);
  const [isLoading, seIsLoading] = useState(false);
  //====================================================================
  const wTrn_Dt = calc_dayofyear();
  //====================== SAVE PURCHASE ==========================
  const handleSavePurchase = async () => {
    try {
      setError(null);

      const tranPayload = {
        pur_Tots: {
          pur_id: "0012601160001",
          brn_cd: gVars.gBrn_Cd,
          pur_dt: "2026-01-16", //wTrn_Dt,
          vnd_id: 210003, //totals.vnd_ac_no,
          tot_itms: totals.bch_items,
          tot_qty: totals.bch_qty,
          tot_amt: totals.bch_amt,
          amt_paid: totals.paid_amt,
          amt_cr: totals.net_amt,
          inp_by: gVars.gUser,
        },
        pur_Itms: items,
        //        tran_dt:  '2026-01-16T00:00:00.000Z',
        tran_dt: "2026-01-16",
        branchCode: gVars.gBrn_Cd,
      };
      //        YYYY-MM-DDThh:mm:ss.sssZ  ISO date

      console.log("tran     Payload");

      console.log(tranPayload.pur_Tots);

      // Different API endpoint for purchases
      const apiResponse = await api.post("/api/pos/save_purchase", tranPayload);
      const data = await apiResponse.json();

      if (!apiResponse.ok || !data.success)
        throw new Error(data.message || "Failed to save purchase");

      router.push(`/pos/purchase-bill/${data.pur_id}`);
      finalizeSale;
    } catch (error) {
      console.error("Error Saving Purchase:", error);
      setError(
        error instanceof Error ? error.message : "Failed to Save Purchase",
      );
    }
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setCurrentItem(
  //     name as any,
  //     name === "itm_cd" ? value : Number(value)
  //   );
  // };

  //====================================================================
  return (
    <>
      <div className="bg-linear-to-r from-emerald-700 to-teal-600 text-white rounded-lg shadow-lg px-1 py-1 sticky bottom-0 mt-auto animate-slideUp">
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

          {/* NET */}
          <div className="flex flex-col w-35">
            <span className="text-xs opacity-80">Net</span>
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
                {totals.bch_amt.toFixed(2)}
              </span>
            </div>
          </div>

          {/* MOBILE */}
          <div className="flex flex-col w-40">
            <span className="text-xs opacity-80">Mobile</span>
            <input
              type="text"
              value={totals.bch_mbl}
              maxLength={15}
              onChange={(e) =>
                (totals.bch_mbl = e.target.value.replace(/\D/g, ""))
              }
              placeholder="03XX-XXXXXXX"
              //className="p-1 rounded-md bg-white/95 text-emerald-700 text-center"
              className="w-full p-1 border rounded-md bg-white/95 text-black"
            />
          </div>

          {/* SAVE */}
          <div className="flex flex-col justify-end">
            <button
              onClick={handleSavePurchase}
              disabled={isLoading}
              className="bg-emerald-900 mt-4 text-white px-4 py-1.5 rounded-md font-bold disabled:opacity-40"
            >
              {isLoading
                ? "Processing..."
                : returnMode
                  ? "💾 Save Return"
                  : "💾 Save"}
            </button>
          </div>
        </div>
      </div>

      {/* <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style> */}
    </>
  );
}
