"use client";

import React, { useEffect } from "react";
import { usePurchaseStore } from "../../../zu_store/purch_store";
import { api, setAccessToken } from "../../../lib/apiClient";
import router from "next/router";
import { useAuth } from "@/app/context/AuthContext";
                                
export default function TranInputForm() {
  const { user, accessToken, isLoading } = useAuth();
  const {
    currentItem,
    setCurrentItem,
    addItem,
    resetCurrentItem,
  } = usePurchaseStore();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentItem(
      name as any,
      name === "itm_cd" ? value : Number(value)
    );
  };

  const handleEnter = () => {
    if (!currentItem.itm_cd) return;

    addItem(currentItem);
    resetCurrentItem();
  };
  const fetchProduct = async (prd_cd: number | string) => {
    if (!prd_cd || prd_cd === "" || prd_cd === "0") return;

//    console.log(prd_cd)

    try {
    //   setLoading(true);
    //   setError(null);

    //   const data = await fetchProductApi(prd_cd);
      const resp = await api.get(`/api/pos/get_prod?prd_cd=${prd_cd}`);

      const data = await resp.json();
//console.log('aaaaaaaaaaaaaaaa BLUR oooooo');
//      console.log(data.data);

      if (data.success) {
        // const itemRsp = Number(data.data.max_rsp);
        // const itemQty = Number(currentItem.itm_qty);
        // const discountAmt = Number(data.data.discount_amt) || 0;
        // const netPrice = itemRsp - discountAmt;
        // const itemAmt = netPrice * itemQty;

//        setCurrentItem(itemRsp,data.data.itm_rsp);

        setCurrentItem("itm_desc"   ,data.data.prd_desc);
        setCurrentItem("cur_rsp"   ,data.data.max_rsp);
        setCurrentItem("cur_pur_prc"   ,data.data.pur_prc);
//        setCurrentItem("new_rsp"   ,data.data.max_rsp);
        
//   itm_rsp: number;
//   itm_qty: number;
//   itm_disc: number;
//   itm_net_price: number;
//   itm_amt: number;
//   itm_cost: number;
//   itm_tax?: number;

        //   ...form,
        //   itm_desc: data.data.prd_desc,
        //   itm_rsp: itemRsp,
        //   itm_disc: discountAmt,
        //   itm_net_price: netPrice,
        //   itm_cost: Number(data.data.pur_prc),
        //   itm_amt: itemAmt,
        // });
      }
    } catch (error) {
      console.error("Error fetching Product:", error);
    //   setError(
    //     error instanceof Error ? error.message : "Failed to fetch Product"
    //   );
    //   setForm((prev) => ({
    //     ...prev,
    //     itm_desc: "",
    //     itm_disc: 0,
    //     itm_net_price: 0,
    //   }));
    } finally {
//      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-1 mb-1">
      <div className="flex items-end gap-2">
{/* // CURRENT ITEM ---change this--------- */}
        {/* CODE */}
        <div className="w-32">
          <label className="text-xs">Product Code</label>
          <input
            name="itm_cd"
            value={currentItem.itm_cd || ""}
            onChange={handleChange}
            onBlur={() => fetchProduct(currentItem.itm_cd)}
            onKeyDown={(e) => e.key === "Enter" && handleEnter()}
            className="w-full p-1 border rounded"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="flex-1">
          <label className="text-xs">Description</label>
          <input
            value={currentItem.itm_desc}
            readOnly
            className="w-full p-1 border rounded bg-gray-50"
          />
        </div>

        {/* QTY */}
        <div className="w-15">
          <label className="text-xs">Qty</label>
          <input
            name="itm_qty"
            type="number"
            value={currentItem.itm_qty}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && handleEnter()}
            className="w-full p-1 border rounded"
          />
        </div>

        {/* PRICE */}
        <div className="w-24">
          <label className="text-xs">Pur Price</label>
          <input
            name="itm_prc"
            type="number"
            value={currentItem.itm_prc}
            onChange={handleChange}
            className="w-full p-1 border rounded"
          />
        </div>

        {/* NEW RSP */}
        <div className="w-24">
          <label className="text-xs">New RSP</label>
          <input
            name="itm_rsp"
            type="number"
            value={currentItem.itm_rsp}
            onChange={handleChange}
            className="w-full p-1 border rounded"
          />
        </div>

        {/* NET */}
        <div className="w-24">
          <label className="text-xs">Curr. RSP:</label>
          <input
            value={currentItem.cur_rsp}
            readOnly
            className="w-full p-1 border rounded bg-gray-50"
          />
        </div>

        {/* TOTAL */}
        <div className="w-28">
          <label className="text-xs">Total</label>
          <input
            value={currentItem.itm_tot_amt}
            readOnly
            className="w-full p-1 border rounded bg-gray-50"
          />
        </div>

        {/* {labels.returnButton && (
          <div className="flex-none w-16">
          <label className="text-xs font-medium text-gray-600 mb-1 block opacity-0">
            Action
          </label>
          <button
            className={`w-full px-2 py-1.5 text-sm font-semibold rounded-md border-none cursor-pointer transition-all ${
              returnMode
                ? "bg-red-600 text-white shadow-md shadow-red-600/40"
                : "bg-amber-500 text-white hover:bg-amber-600"
            }`}
            onClick={onReturnToggle}
            type="button"
          >
            {defaultLabels.returnButton}
          </button>
        </div>)} */}

      </div>
    </div>
  );
}
