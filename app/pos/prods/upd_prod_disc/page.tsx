"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import * as Yup from "yup";

// Get "Today" at exactly 00:00:00 to avoid time-of-day validation issues
const today = new Date();
today.setHours(0, 0, 0, 0);

// ---------------------- Yup Schema ----------------------
const schema = Yup.object({
  disc_amt: Yup.number()
    .typeError("Invalid Discount Amount")
    .positive("Discount must be > 0"),

  disc_pct: Yup.number()
    .typeError("Invalid Discount Percentage")
    .positive("Discount PCT must be > 0")
    .min(5, "Discount must be at least 5%")
    .max(75, "Discount cannot exceed 75%"),

  // disc_st_dt: Yup.date()
  //   .required("Start date is required")
  //   .min(today, "Start date must be today or in the future"),

  // disc_end_dt: Yup.date()
  //   .required("End date is required")
  //   .min(
  //     Yup.ref('disc_st_dt'), 
  //     "End date must be later than the start date"
  //   )
});

export default function UpdatePrices() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    prd_cd: "",
    bar_cd: "",
    disc_amt: "",
    disc_pct: "",
    disc_st_dt: "",
    disc_end_dt: "",
  });

  const [prdDesc, setPrdDesc] = useState('');
  const [prdCat, setPrdCat] = useState('');
  const [prdCd, setPrdCd] = useState('');
  const [prdMaxPrc, setPrdMaxPrc] = useState('');

  // Helper function to format date for input[type="date"]
  const formatDateForInput = (dateValue: any) => {
    if (!dateValue) return "";
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split('T')[0];
    } catch {
      return "";
    }
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const clr_form = () => {
    setForm({
      prd_cd: "",
      bar_cd: "",
      disc_amt: "",
      disc_pct: "",
      disc_st_dt: "",
      disc_end_dt: "",
    });
    setPrdCat('');
    setPrdMaxPrc('');
    setPrdDesc('');
  };

  // Fetch product details by prd_cd
  const fetchProduct = async () => {
    if (!form.bar_cd) {
      alert("Enter Prod/Bar Code first.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/pos/prods/get_prod_barcd?bar_cd=${form.bar_cd}`);
      const mast = await res.json();
      
      if (!res.ok) throw new Error("Product Master Record not found");
      setPrdDesc(mast.data.prd_desc || "");
      setPrdCat(mast.data.prd_cat || "");
      setPrdCd(mast.data.prd_cd || "");
      const wPrdCd = mast.data.prd_cd;
      // } catch (err: any) {
    //   alert(err.message);
    // }
    // try {
      const resp = await fetch(`/api/pos/prods/get_prod_info?prd_cd=${wPrdCd}`);
      if (!resp.ok) throw new Error("Prod Discount Record not found");
      const info = await resp.json();
      
      setPrdMaxPrc(info.data.max_rsp || "");
      setForm({
        ...form,
        prd_cd: info.data.prd_cd || "",
        disc_amt: info.data.disc_amt || "",
        disc_pct: info.data.disc_pct || "",
        disc_st_dt: formatDateForInput(info.data.disc_st_dt),
        disc_end_dt: formatDateForInput(info.data.disc_end_dt),
      });
    } catch (err: any) {
      alert(err.message);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(form);

    try {
      // Validate all fields including dates
      await schema.validate(
        {
          disc_amt: form.disc_amt,
          disc_pct: form.disc_pct,
          disc_st_dt: form.disc_st_dt,
          disc_end_dt: form.disc_end_dt,
        },
        { abortEarly: false }
      );

      const res = await fetch("/api/pos/prods/save_prod_disc", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");
      alert("Prices updated successfully!");
      clr_form();
    } catch (err: any) {
      if (err.inner) {
        const messages = err.inner.map((e: any) => e.message).join("\n");
        alert(messages);
      } else {
        alert(err.message);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Update Product Discounts</title>
      </Head>

      <div className="border-2 min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-4 px-2">
        <div className="max-w-2xl mx-auto">
          <header className="mb-1 rounded-lg shadow-md p-2 text-center bg-linear-to-r from-green-600 via-emerald-600 to-teal-600">
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Update Product Discounts
            </h1>
          </header>

          <main className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Product Code */}
              <div className="grid grid-cols-[5fr_5fr] gap-2 items-center">
                <div className="flex">
                  <label className="mr-8">
                    Prod/Bar Code:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="bar_cd"
                    value={form.bar_cd}
                    onChange={handleChange}
                    onBlur={fetchProduct}
                    className="w-35 border border-black rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="prd_desc"
                    value={prdDesc}
                    disabled
                    className="border border-black rounded px-3 py-2 text-sm w-80 bg-gray-100"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="grid grid-cols-[25%_25%_25%_25%] gap-2 border-b">
                <div className={"mr-1"}>Category:</div>
                <div>
                  <input
                    type="number"
                    name="prd_cat"
                    value={prdCat}
                    disabled
                    className="border border-black rounded px-3 py-2 text-sm w-32 bg-gray-100"
                  />
                </div>               
                <div className={"mr-1"}>Max RSP:</div>
                <div>
                  <input
                    type="number"
                    name="max_rsp"
                    value={prdMaxPrc}
                    disabled
                    className="border border-black rounded px-3 py-2 text-sm w-32 bg-gray-100"
                  />
                </div>                
              </div>

              <div className="grid grid-cols-[25%_25%_25%_25%] gap-2 border-b">              
                <div className={"mr-5"}>Discount %: </div>
                <div>
                  <input
                    type="number"
                    name="disc_pct"
                    value={form.disc_pct}
                    onChange={handleChange}
                    className="border border-black rounded px-3 py-2 text-sm w-32"
                  />
                </div>              
                <div className={"mr-7"}>
                  Disc. Amount:<span className="text-red-500">*</span>
                </div>
                <div>
                  <input
                    type="number"
                    name="disc_amt"
                    value={form.disc_amt}
                    onChange={handleChange}
                    className="border border-black rounded px-3 py-2 text-sm w-32"
                  />
                </div>
              </div>

              <div className="grid grid-cols-[25%_25%_25%_25%] gap-2 border-b">              
                <div className={"mr-1"}>
                  Disc Start Dt:<span className="text-red-500">*</span>
                </div>
                <div>
                  <input
                    type="date"
                    name="disc_st_dt"
                    value={form.disc_st_dt}
                    onChange={handleChange}
                    className="border border-black rounded px-3 py-2 text-sm w-32"
                  />
                </div>
                <div className={"mr-10"}>
                  Disc End Dt:<span className="text-red-500">*</span>
                </div>
                <div>
                  <input
                    type="date"
                    name="disc_end_dt"
                    value={form.disc_end_dt}
                    onChange={handleChange}
                    className="border border-black rounded px-3 py-2 text-sm w-32"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-[2fr_3fr_5fr] gap-2 items-center">
                <div>
                  <button
                    className="w-50 flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md"
                    type="submit"
                    disabled={loading}
                  >
                    💾 Save
                  </button>
                </div>
                <div>
                  <button
                    className="w-50 flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md"
                    type="button"
                    onClick={clr_form}
                  >
                    🧹 Clear
                  </button>
                </div>
              </div>    
            </form>
          </main>
        </div>
      </div>
    </>
  );
}