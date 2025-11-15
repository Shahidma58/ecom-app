"use client";

import { useState } from "react";

export default function Upd_Prices() {
  const [prd_cd, setPrdCd] = useState("");
  const [pur_prc, setPurPrc] = useState("");
  const [min_rsp, setMinRsp] = useState("");
  const [max_rsp, setMaxRsp] = useState("");
  const [tax_amt, setTaxAmt] = useState("");
  const [prd_desc, setPrdDesc] = useState("");
  const [message, setMessage] = useState("");

  // 🔍 Fetch product details onBlur
  const fetchProduct = async () => {
    if (!prd_cd.trim()) return;

    try {
      const resp = await fetch(`/api/pos/prods/get_prices/${prd_cd}`);
      const data = await resp.json();

      if (data.success && data.data) {
        const p = data.data;
        setPrdDesc(p.prd_desc ?? "");
        setPurPrc(p.pur_prc ?? "");
        setMinRsp(p.min_rsp ?? "");
        setMaxRsp(p.max_rsp ?? "");
        setTaxAmt(p.tax_amt ?? "");
        setMessage("");
      } else {
        setMessage("❌ Product not found or inactive.");
        setPrdDesc("");
        setPurPrc("");
        setMinRsp("");
        setMaxRsp("");
        setTaxAmt("");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Failed to fetch product.");
    }
  };

  // 🔧 Update Product Prices
  const handleUpdate = async () => {
    try {
      const resp = await fetch("/api/pos/prods/upd_prices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prd_cd, pur_prc,min_rsp, max_rsp, tax_amt}),
      });

      const data = await resp.json();

      if (data.success) {
        setMessage(`✅ Product ${prd_cd} updated successfully!`);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Something went wrong.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">Update Product Prices</h2>

      {/* Use a grid to put labels on the left */}
      <div className="space-y-4">

        {/* Product Code */}
        <div className="grid grid-cols-3 gap-2 items-center">
          <label className="font-medium">Product Code</label>
          <input
            type="number"
            value={prd_cd}
            onChange={(e) => setPrdCd(e.target.value)}
            onBlur={fetchProduct}   // ⬅️ FETCH ON BLUR
            className="col-span-2 border px-3 py-2 rounded"
          />
        </div>

        {/* Product Desc */}
        <div className="grid grid-cols-3 gap-2 items-center">
          <label className="font-medium">Description</label>
          <input
            type="text"
            readOnly
            value={prd_desc}
            className="col-span-2 border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        {/* Purchase Price */}
        <div className="grid grid-cols-3 gap-2 items-center">
          <label className="font-medium">Purchase Price</label>
          <input
            type="number"
            value={pur_prc}
            onChange={(e) => setPurPrc(e.target.value)}
            className="col-span-2 border px-3 py-2 rounded"
          />
        </div>

        {/* Min RSP */}
        <div className="grid grid-cols-3 gap-2 items-center">
          <label className="font-medium">Min Sale Price</label>
          <input
            type="number"
            value={min_rsp}
            onChange={(e) => setMinRsp(e.target.value)}
            className="col-span-2 border px-3 py-2 rounded"
          />
        </div>

        {/* Max RSP */}
        <div className="grid grid-cols-3 gap-2 items-center">
          <label className="font-medium">Max RSP</label>
          <input
            type="number"
            value={max_rsp}
            onChange={(e) => setMaxRsp(e.target.value)}
            className="col-span-2 border px-3 py-2 rounded"
          />
        </div>

        {/* Tax Amount */}
        <div className="grid grid-cols-3 gap-2 items-center">
          <label className="font-medium">Tax Amount</label>
          <input
            type="number"
            readOnly
            value={tax_amt}
            onChange={(e) => setTaxAmt(e.target.value)}
            className="col-span-2 border px-3 py-2 rounded bg-gray-100"
          />
        </div>
      </div>

      <button
        onClick={handleUpdate}
        className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition"
      >
        Update Product
      </button>

      {message && (
        <div className="text-center text-sm text-gray-700 mt-2">{message}</div>
      )}
    </div>
  );
}
