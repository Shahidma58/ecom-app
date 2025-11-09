"use client";

import { useState } from "react";

export default function Upd_Prices() {
  const [prd_cd, setPrdCd] = useState("");
  const [max_rsp, setMaxRsp] = useState("");
  const [pur_prc, setPurPrc] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    try {
      const resp = await fetch("/api/pos/prods/upd_prices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prd_cd,
          max_rsp,
          pur_prc,
        }),
      });

      const data = await resp.json();
      if (data.success) {
        setMessage(`✅ Product ${prd_cd} updated successfully!`);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setMessage("⚠️ Something went wrong.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">Update Product (Partial)</h2>

      <input
        type="number"
        placeholder="Product Code"
        value={prd_cd}
        onChange={(e) => setPrdCd(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="number"
        placeholder="Max RSP"
        value={max_rsp}
        onChange={(e) => setMaxRsp(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="number"
        placeholder="Purchase Price"
        value={pur_prc}
        onChange={(e) => setPurPrc(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

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
