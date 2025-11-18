"use client";

import { useState } from "react";
import * as Yup from "yup";

export default function Upd_Prices() {
  const [prd_cd, setPrdCd] = useState("");
  const [pur_prc, setPurPrc] = useState("");
  const [min_rsp, setMinRsp] = useState("");
  const [max_rsp, setMaxRsp] = useState("");
  const [tax_amt, setTaxAmt] = useState("");
  const [prd_desc, setPrdDesc] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  // 🔍 Yup Validation Schema
  const schema = Yup.object().shape({
    prd_cd: Yup.string().required("Product code is required"),
    pur_prc: Yup.number().typeError("Invalid").min(0).required("Required"),
    min_rsp: Yup.number().typeError("Invalid").min(0),
    max_rsp: Yup.number().typeError("Invalid").min(0).required("Required"),
  });

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
      setMessage("⚠️ Failed to fetch product.");
    }
  };

  // 🔧 Update Product Prices
  const handleUpdate = async () => {
    // ✔ Validate before proceeding
    try {
      await schema.validate(
        { prd_cd, pur_prc, min_rsp, max_rsp },
        { abortEarly: false }
      );
      setErrors({});
    } catch (validationError) {
      const fieldErrors = {};
      validationError.inner.forEach((e) => {
        fieldErrors[e.path] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      const resp = await fetch("/api/pos/prods/upd_prices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prd_cd, pur_prc, min_rsp, max_rsp, tax_amt }),
      });

      const data = await resp.json();

      if (data.success) {
        setMessage(`Product ${prd_cd} updated successfully!`);
        setShowPopup(true); // show popup
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setMessage("⚠️ Something went wrong.");
    }
  };

  return (
    <>
      {/* ===================== FORM CARD ===================== */}
      <div className="max-w-lg mx-auto mt-10 p-0 rounded-xl shadow-lg overflow-hidden border">

        {/* Header */}
        <div className="bg-emerald-600 text-white p-4 text-center text-xl font-bold">
          Update Product Prices
        </div>

        <div className="p-6 space-y-4">

          {/* Product Code */}
          <div>
            <label className="font-medium">Product Code</label>
            <input
              type="number"
              value={prd_cd}
              onChange={(e) => setPrdCd(e.target.value)}
              onBlur={fetchProduct}
              className="w-full border px-3 py-2 rounded mt-1"
            />
            {errors.prd_cd && (
              <p className="text-red-600 text-sm">{errors.prd_cd}</p>
            )}
          </div>

          {/* Product Desc */}
          <div>
            <label className="font-medium">Description</label>
            <input
              type="text"
              readOnly
              value={prd_desc}
              className="w-full border px-3 py-2 rounded mt-1 bg-gray-100"
            />
          </div>

          {/* Purchase Price */}
          <div>
            <label className="font-medium">Purchase Price</label>
            <input
              type="number"
              value={pur_prc}
              onChange={(e) => setPurPrc(e.target.value)}
              className="w-full border px-3 py-2 rounded mt-1"
            />
            {errors.pur_prc && (
              <p className="text-red-600 text-sm">{errors.pur_prc}</p>
            )}
          </div>

          {/* Min RSP */}
          <div>
            <label className="font-medium">Min Sale Price</label>
            <input
              type="number"
              value={min_rsp}
              onChange={(e) => setMinRsp(e.target.value)}
              className="w-full border px-3 py-2 rounded mt-1"
            />
            {errors.min_rsp && (
              <p className="text-red-600 text-sm">{errors.min_rsp}</p>
            )}
          </div>

          {/* Max RSP */}
          <div>
            <label className="font-medium">Max RSP</label>
            <input
              type="number"
              value={max_rsp}
              onChange={(e) => setMaxRsp(e.target.value)}
              className="w-full border px-3 py-2 rounded mt-1"
            />
            {errors.max_rsp && (
              <p className="text-red-600 text-sm">{errors.max_rsp}</p>
            )}
          </div>

          {/* Tax Amount */}
          <div>
            <label className="font-medium">Tax Amount</label>
            <input
              type="number"
              readOnly
              value={tax_amt}
              className="w-full border px-3 py-2 rounded mt-1 bg-gray-100"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleUpdate}
            className="w-full bg-emerald-600 text-white py-2 rounded font-semibold 
                       hover:bg-emerald-700 active:scale-95 transition-all"
          >
            Update Product
          </button>

          {message && (
            <div className="text-center text-sm mt-2 text-gray-700">{message}</div>
          )}
        </div>
      </div>

      {/* ===================== POPUP MODAL ===================== */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80 text-center">
            <h3 className="text-lg font-bold text-emerald-600">Success</h3>
            <p className="mt-2">{message}</p>

            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 active:scale-95 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
