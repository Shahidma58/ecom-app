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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);

  // Shared styling
  const inputClass =
    "w-full border-1 border-black rounded-lg px-2 py-2.5 text-sm bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all";
  const inputErrorClass = "border-red-500 focus:ring-red-400 focus:border-red-400";
  const inputDisabledClass = "bg-gray-100 cursor-not-allowed";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  // 🔍 Yup Validation Schema
  const schema = Yup.object().shape({
    prd_cd: Yup.string().required("Product code is required"),
    pur_prc: Yup.number()
      .typeError("Must be a valid number")
      .min(0, "Cannot be negative")
      .required("Purchase price is required"),
    min_rsp: Yup.number()
      .typeError("Must be a valid number")
      .min(0, "Cannot be negative")
      .test(
        "less-than-max",
        "Min price must be less than max price",
        function (value) {
          const { max_rsp } = this.parent;
          if (!value || !max_rsp) return true;
          return parseFloat(value) <= parseFloat(max_rsp);
        }
      ),
    max_rsp: Yup.number()
      .typeError("Must be a valid number")
      .min(0, "Cannot be negative")
      .required("Max price is required"),
  });

  // 🔍 Fetch product details onBlur
  const fetchProduct = async () => {
    if (!prd_cd.trim()) return;

    try {
      setFetchingProduct(true);
      setMessage("");
      setErrors({});

      const resp = await fetch(`/api/pos/prods/get_prices/${prd_cd}`);
      const data = await resp.json();

      if (data.success && data.data) {
        const p = data.data;
        setPrdDesc(p.prd_desc ?? "");
        setPurPrc(p.pur_prc ?? "");
        setMinRsp(p.min_rsp ?? "");
        setMaxRsp(p.max_rsp ?? "");
        setTaxAmt(p.tax_amt ?? "");
        setMessage("✓ Product loaded successfully");
      } else {
        setMessage("❌ Product not found or inactive");
        setPrdDesc("");
        setPurPrc("");
        setMinRsp("");
        setMaxRsp("");
        setTaxAmt("");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("⚠️ Failed to fetch product");
    } finally {
      setFetchingProduct(false);
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
    } catch (validationError: any) {
      const fieldErrors: Record<string, string> = {};
      validationError.inner.forEach((e: any) => {
        fieldErrors[e.path] = e.message;
      });
      setErrors(fieldErrors);
      setMessage("⚠️ Please fix the errors before submitting");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const resp = await fetch("/api/pos/prods/upd_prices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prd_cd,
          pur_prc: parseFloat(pur_prc),
          min_rsp: parseFloat(min_rsp || "0"),
          max_rsp: parseFloat(max_rsp),
          tax_amt: parseFloat(tax_amt || "0"),
        }),
      });

      const data = await resp.json();

      if (data.success) {
        setMessage(`✓ Product ${prd_cd} updated successfully!`);
        setShowPopup(true);
      } else {
        setMessage(`❌ Error: ${data.error || "Update failed"}`);
      }
    } catch (err) {
      console.error("Update error:", err);
      setMessage("⚠️ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Clear form
  const handleClear = () => {
    setPrdCd("");
    setPrdDesc("");
    setPurPrc("");
    setMinRsp("");
    setMaxRsp("");
    setTaxAmt("");
    setMessage("");
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* ===================== HEADER ===================== */}
        <div
          className="mb-2 rounded-xl shadow-lg p-2 text-center"
          style={{
            background:
              "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
          }}
        >
          <h1 className="text-2xl font-bold text-white mb-2">
            Update Product Prices
          </h1>
          {/* <p className="text-green-100 text-sm">
            Manage product pricing information
          </p> */}
        </div>

        {/* ===================== MESSAGE ALERT ===================== */}
        {message && (
          <div
            className={`mb-2 rounded-lg px-2 py-2 shadow-sm border-l-4 ${
              message.includes("✓")
                ? "bg-green-50 border-green-500 text-green-800"
                : message.includes("❌")
                ? "bg-red-50 border-red-500 text-red-800"
                : "bg-yellow-50 border-yellow-500 text-yellow-800"
            }`}
          >
            <p className="font-medium">{message}</p>
          </div>
        )}

        {/* ===================== FORM CARD ===================== */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8 space-y-6">
            {/* Product Code & Description */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>
                  Product Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={prd_cd}
                  onChange={(e) => setPrdCd(e.target.value)}
                  onBlur={fetchProduct}
                  className={`${inputClass} ${
                    errors.prd_cd ? inputErrorClass : ""
                  }`}
                  placeholder="Enter product code"
                  disabled={fetchingProduct}
                />
                {errors.prd_cd && (
                  <p className="text-red-500 text-xs mt-1">{errors.prd_cd}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Product Description</label>
                <input
                  type="text"
                  readOnly
                  value={prd_desc}
                  className={`${inputClass} ${inputDisabledClass}`}
                  placeholder="Description will appear here"
                />
              </div>
            </div>

            {/* Purchase Price & Tax Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  Purchase Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={pur_prc}
                  onChange={(e) => setPurPrc(e.target.value)}
                  className={`${inputClass} ${
                    errors.pur_prc ? inputErrorClass : ""
                  }`}
                  placeholder="0.00"
                />
                {errors.pur_prc && (
                  <p className="text-red-500 text-xs mt-1">{errors.pur_prc}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Tax Amount</label>
                <input
                  type="number"
                  step="0.01"
                  readOnly
                  value={tax_amt}
                  className={`${inputClass} ${inputDisabledClass}`}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Min & Max Sale Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Minimum Sale Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={min_rsp}
                  onChange={(e) => setMinRsp(e.target.value)}
                  className={`${inputClass} ${
                    errors.min_rsp ? inputErrorClass : ""
                  }`}
                  placeholder="0.00"
                />
                {errors.min_rsp && (
                  <p className="text-red-500 text-xs mt-1">{errors.min_rsp}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Maximum Sale Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={max_rsp}
                  onChange={(e) => setMaxRsp(e.target.value)}
                  className={`${inputClass} ${
                    errors.max_rsp ? inputErrorClass : ""
                  }`}
                  placeholder="0.00"
                />
                {errors.max_rsp && (
                  <p className="text-red-500 text-xs mt-1">{errors.max_rsp}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleUpdate}
                disabled={loading || fetchingProduct || !prd_desc}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transform hover:scale-[1.02] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Product"
                )}
              </button>

              <button
                onClick={handleClear}
                disabled={loading || fetchingProduct}
                className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear Form
              </button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            💡 <strong>Tip:</strong> Enter product code and press Tab to load
            existing prices
          </p>
        </div>
      </div>

      {/* ===================== SUCCESS POPUP MODAL ===================== */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center transform animate-scale-in">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-green-600 mb-3">
              Success!
            </h3>
            <p className="text-gray-700 mb-6">{message}</p>

            <button
              onClick={() => {
                setShowPopup(false);
                handleClear();
              }}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transform hover:scale-[1.02] transition-all shadow-md"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}