"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePurchaseStore } from "../../../zu_store/purch_store";
import { api, setAccessToken } from "../../../lib/apiClient";
import router from "next/router";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
//import { boolean } from "yup";
import UpdatePricePopup from "./upd_prc_comp";                                
export default function TranInputForm() {
  const { user, accessToken, isLoading } = useAuth();
//  const {returnMode, setReturnMode} = useState(false);
  const prodRef = useRef<HTMLInputElement>(null);
  const qtyRef = useRef<HTMLInputElement>(null);
//  const purPrcRef = useRef<HTMLInputElement>(null);
//  const newRspRef = useRef<HTMLInputElement>(null);
  const {
    currentItem,
    setCurrentItem,
    addItem,
    resetCurrentItem,
    returnMode
  } = usePurchaseStore();
//=======================  POP UP ================
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

//======================================================
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
    if (name === "itm_qty" && value.length > 3) {
      return; // Stop the update
    }
    if (name === "itm_rsp" && value.length > 6) {
      return; // Stop the update
    }

    setCurrentItem(
      name as any,
      name === "itm_cd" ? value : Number(value)
    );
  };

  const handleProdEnter = (prd_cd: number | string) => {
    if (!prd_cd || prd_cd === "" || prd_cd === "0") {
      toast.error("Input Product Code sdsd ", {
        duration:1000,
        closeButton: true, 
        className: "border border-red-300 bg-gray-500 text-red-800 shadow-lg rounded-lg"
      });
      prodRef.current?.focus();
      return;
    } else { qtyRef.current?.focus();}
  };

  const handleQtyEnter = (prd_cd: number | string) => {
    if (!prd_cd || prd_cd === "" || prd_cd === "0") {
      qtyRef.current?.focus();
      return;
    } else { 
//      purPrcRef.current?.focus();    
      addItem(currentItem);
      resetCurrentItem();

    }
  };

  // const handlePrcEnter = (prd_cd: number | string) => {
  //   if (!prd_cd || prd_cd === "" || prd_cd === "0") {
  //     purPrcRef.current?.focus();
  //     return;
  //   } else { newRspRef.current?.focus();}
  // };
  // const handleNewRspEnter = (itm_rsp: number | string) => {
  //   if (!itm_rsp|| itm_rsp === "" || itm_rsp === "0") {
  //     newRspRef.current?.focus();
  //     return;
  //   }
  //   if (Number(itm_rsp) <= currentItem.itm_prc) {
  //     newRspRef.current?.focus();
  //     return;
  //   }

  //   addItem(currentItem);
  //   resetCurrentItem();
  // };
//====================================================================  
  const fetchProduct = async (prd_cd: number | string) => {
    if (!prd_cd || prd_cd === "" || prd_cd === "0") {
      prodRef.current?.focus();
      return;
    }
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
      qtyRef.current?.focus();
      qtyRef.current?.select();
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
  // useEffect(() => {
  //   ProdRef.current?.focus();
  // }, []);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-1 mb-1">
      <div className="flex items-end gap-1 text-sm">
{/* // CURRENT ITEM ---change this--------- */}
        {/* CODE */}
        <div className="w-32">
          <label className="text-xs">Product Code</label>
          <input
            name="itm_cd"
            value={currentItem.itm_cd || ""}
            onChange={handleChange}
            onBlur={() => fetchProduct(currentItem.itm_cd)}
            onKeyDown={(e) => e.key === "Enter" && handleProdEnter(currentItem.itm_cd)}
            className="w-full p-1 border rounded"
            ref={prodRef}
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

        {/* PRICE */}
        <div className="w-24">
          <label className="text-xs">Pur Price</label>
          <input
            name="itm_prc"
            type="number"
            value={currentItem.cur_pur_prc}
            onChange={handleChange}
            className="w-full p-1 border rounded"
            readOnly
            // onKeyDown={(e) => e.key === "Enter" && handlePrcEnter(currentItem.itm_prc)}
            // ref={purPrcRef}
          />
        </div>

        {/* NEW RSP */}
        {/* <div className="w-24">
          <label className="text-xs">New RSP</label>
          <input
            name="itm_rsp"
            type="number"
            value={currentItem.itm_rsp}
            onChange={handleChange}
            className="w-full p-1 border rounded"
            onKeyDown={(e) => e.key === "Enter" && handleNewRspEnter(currentItem.itm_rsp)}
            ref={newRspRef}
          />
        </div> */}

        {/* NET */}
        <div className="w-24">
          <label className="text-xs">Max RSP:</label>
          <input
            value={currentItem.cur_rsp}
            readOnly
            className="w-full p-1 border rounded bg-gray-50"
          />
        </div>


        <div className="flex-none w-20 max-h20">
        <button
          onClick={() => setIsPopupOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-sm text-white py-1.5 px-2 
          rounded-md shadow-md font-semibold"
        >
        Upd Price
        </button>        </div>
{/* =================================================== */}
        {/* QTY */}
        <div className="w-15">
          <label className="text-xs">Qty</label>
          <input
            name="itm_qty"
            type="number"
            value={currentItem.itm_qty}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && handleQtyEnter(currentItem.itm_qty)}
            className="w-full p-1 border rounded"
            ref={qtyRef}
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

        <div className="flex-none w-16">
          {/* <label className="text-xs font-medium text-gray-600 mb-1 block opacity-0">
            Action
          </label> */}
          <button
            className={`w-full px-2 py-1.5 text-sm font-semibold rounded-md border-none cursor-pointer transition-all ${
              returnMode
                ? "bg-red-600 text-white shadow-md shadow-red-600/40"
                : "bg-amber-500 text-white hover:bg-amber-600"
            }`}
//            onClick={""}
            type="button"
          >
            Return
          </button>
        </div>
      </div>
{/* //=========================================================== */}
      {/* Popup Component - appears on top right */}
      <UpdatePricePopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)}
        initialData={{
          bar_cd: "123456",
          prd_desc: "Sample Product",
          pur_prc: "100",
          min_rsp: "120",
          max_rsp: "150",
        }}
      />
{/* //========================================================= */}

    </div>
  );
}
