"use client";
import { useState } from "react";
import Head from "next/head";
import * as Yup from "yup";

// ---------------------- Yup Schema ----------------------
const schema = Yup.object({
  pur_prc: Yup.number()
    .typeError("Invalid Purchase Price")
    .required("Purchase Price is required")
    .positive("Purchase Price must be > 0"),

  min_rsp: Yup.number()
    .typeError("Invalid Min RSP")
    .required("Min RSP is required")
    .positive("Min RSP must be > 0"),

  max_rsp: Yup.number()
    .typeError("Invalid Max RSP")
    .required("Max RSP is required")
    .positive("Max RSP must be > 0"),

  tax_pct: Yup.number()
    .typeError("Invalid Tax Amount")
    .min(0, "Tax cannot be negative")
    .required("Tax Amount is required"),
});

export default function UpdatePrices() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    prd_cd: "",
    bar_cd: "",
    pur_prc: "",
    min_rsp: "",
    max_rsp: "",
  });

  // ------------------------------------------------------
  // Handle input
  // ------------------------------------------------------
  const [prdDesc, setPrdDesc] = useState('');
  const [prdCat, setPrdCat] = useState('');
  const [prdCd, setPrdCd] = useState('');
  const [prdBrand, setPrdBrand] = useState('');
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  //================= Clear Form =====================
  const clr_form = () => {
    setForm({
      prd_cd: "",
      bar_cd: "",
      pur_prc: "",
      min_rsp: "",
      max_rsp: "",
    });
    setPrdCat('');
    setPrdBrand('');
    setPrdDesc('');
  };

  // ------------------------------------------------- -----
  // Fetch product details by prd_cd
  // ------------------------------------------------------
  const fetchProduct = async () => {
    if (!form.bar_cd) {
      alert("Enter Product Code first.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/pos/prods/get_prod_barcd?bar_cd=${form.bar_cd}`);
      const data = await res.json();

      if (!res.ok) throw new Error("Record not found");
      const wPrdCd = data.data.prd_cd;
      setPrdDesc(data.data.prd_desc || "");
      setPrdCat(data.data.prd_cat || "");
//    setPrdCd(data.data.prd_cat || "");
      setPrdBrand(data.data.prd_brand || "");
    // } catch (err: any) {
    //   alert(err.message);
    // }
    // try {
    //api/pos/prods/get_prod_info?prd_cd=901
      const resp = await fetch(`/api/pos/prods/get_prod_info?prd_cd=${wPrdCd}`);
      if (!resp.ok) throw new Error("Prices Record not found");
      const info = await resp.json();
      setForm({
        ...form,
        prd_cd:  info.data.prd_cd || "",
        pur_prc: info.data.pur_prc || "",
        min_rsp: info.data.min_rsp || "",
        max_rsp: info.data.max_rsp || "",
      });
    } catch (err: any) {
      alert(err.message);
    }
    setLoading(false);
  };

  // ------------------------------------------------------
  // Submit handler with Yup validation
  // ------------------------------------------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      // Validate only the editable fields
      await schema.validate(
        {
          pur_prc: form.pur_prc,
          min_rsp: form.min_rsp,
          max_rsp: form.max_rsp,
        },
        { abortEarly: false }
      );

      const res = await fetch("/api/pos/prods/save_prod_prcs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Prices updated successfully!");
    } catch (err: any) {
      if (err.inner) {
        // Show all Yup validation errors
        const messages = err.inner.map((e: any) => e.message).join("\n");
        alert(messages);
      } else {
        alert(err.message);
      }
    }
  };

  // ------------------------------------------------------

return (
  <>
    <Head>
      <title>Update Price</title>
    </Head>

    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl border-2 border-gray-300 w-[500px] max-h-[90vh] overflow-auto">
        
        {/* Header */}
        <header className="rounded-t-lg shadow-md p-2 text-center bg-linear-to-r from-green-600 via-emerald-600 to-teal-600">
          <h1 className="text-xl font-bold text-white tracking-wide">
            Update Price
          </h1>
        </header>

        {/* Main Content */}
        <main className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* Price Fields */}
            <div className="grid grid-cols-3 gap-3">
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
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-center pt-2 border-t border-gray-300">
              <button
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-all"
                type="submit"
              >
                💾 Save
              </button>

              <button
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-all"
                type="button"
                onClick={clr_form}
              >
                🧹 Clear
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

/* <button
      type="button"
      onClick={fetchRecord}
      className="ml-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-md"
    >
      {loading ? "..." : "Search"}
    </button> 
*/
//console.log(data)
//      setForm({
//        ...form,
        // prd_desc: data.data.prd_desc || "",
        // prd_cat: data.data.prd_cat || "",
        // prd_brand: data.data.prd_brand || "",
//        pur_prc: data.data.pur_prc || "",
//        min_rsp: data.data.min_rsp || "",
//        max_rsp: data.data.max_rsp || "",
//        tax_pct: data.data.tax_pct || "",
//      });

