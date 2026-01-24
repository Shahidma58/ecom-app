"use client";

import Head from "next/head";
import { useState } from "react";

interface UpdatePricePopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    bar_cd?: string;
    prd_desc?: string;
    pur_prc?: string;
    min_rsp?: string;
    max_rsp?: string;
  };
}

export default function UpdatePricePopup({ isOpen, onClose, initialData }: UpdatePricePopupProps) {
  const [form, setForm] = useState({
    bar_cd: initialData?.bar_cd || "",
    pur_prc: initialData?.pur_prc || "",
    min_rsp: initialData?.min_rsp || "",
    max_rsp: initialData?.max_rsp || "",
  });

  const [prdDesc, setPrdDesc] = useState(initialData?.prd_desc || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchProduct = async () => {
    if (!form.bar_cd) return;
    try {
      const res = await fetch(`/api/pos/prods/get_prod_mast?bar_cd=${form.bar_cd}`);
      const data = await res.json();
      if (data.success && data.data) {
        setPrdDesc(data.data.prd_desc || "");
        setForm({
          ...form,
          pur_prc: data.data.pur_prc || "",
          min_rsp: data.data.min_rsp || "",
          max_rsp: data.data.max_rsp || "",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/pos/prods/update_price", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        alert("Price updated successfully!");
        onClose();
      } else {
        alert(data.error || "Failed to update");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating price");
    }
  };

  const clr_form = () => {
    setForm({
      bar_cd: "",
      pur_prc: "",
      min_rsp: "",
      max_rsp: "",
    });
    setPrdDesc("");
  };

  if (!isOpen) return null;

  return (
    <>
      <Head>
        <title>Update Price</title>
      </Head>

      {/* Popup - No backdrop, positioned absolute */}
      <div className="fixed top-20 right-10 z-50">
        <div className="bg-white rounded-lg shadow-2xl border-2 border-gray-300 w-[500px]">
          
          {/* Header */}
          <header className="relative rounded-t-lg shadow-md p-2 text-center bg-linear-to-r from-green-600 via-emerald-600 to-teal-600">
            <h1 className="text-xl font-bold text-white tracking-wide">
              Update Price
            </h1>
            {/* <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button> */}
          </header>

          {/* Main Content */}
          <main className="px-4">
            <form onSubmit={handleSubmit} className="space-y-1">
              
              {/* Price Fields */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-sm mb-1">
                    New Pur Prc:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="pur_prc"
                    value={form.pur_prc}
                    onChange={handleChange}
                    className="w-full border border-black rounded px-2 py-1.5 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Min RSP:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="min_rsp"
                    value={form.min_rsp}
                    onChange={handleChange}
                    className="w-full border border-black rounded px-2 py-1.5 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Max RSP:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="max_rsp"
                    value={form.max_rsp}
                    onChange={handleChange}
                    className="w-full border border-black rounded px-2 py-1.5 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-center pt-2 pb-2 border-t border-gray-300">
                <button
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-4 rounded-md shadow-md transition-all"
                  type="submit"
                >
                  💾 Save
                </button>

                <button
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 rounded-md shadow-md transition-all"
                  type="button"
                  onClick={clr_form}
                >
                  🧹 Clear
                </button>

                <button
                  className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 rounded-md shadow-md transition-all"
                  type="button"
                  onClick={onClose}
                >
                  ✕ Close
                </button>
              </div>

              {/* Hidden Fields */}
              <input
                type="number"
                name="bar_cd"
                value={form.bar_cd}
                onChange={handleChange}
                onBlur={fetchProduct}
                hidden
              />
              <input
                type="text"
                name="prd_desc"
                value={prdDesc}
                disabled
                hidden
              />
            </form>
          </main>
        </div>
      </div>
    </>
  );
}