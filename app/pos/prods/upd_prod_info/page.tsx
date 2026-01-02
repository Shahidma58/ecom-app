"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import * as Yup from "yup";
// Get "Today" at exactly 00:00:00 to avoid time-of-day validation issues
const today = new Date();
today.setHours(0, 0, 0, 0);
// ---------------------- Yup Schema ----------------------
const schema = Yup.object({
//   disc_amt: Yup.number()
//     .typeError("Invalid Discount Amount")
//     .positive("Discount must be > 0"),

  prd_re_ord: Yup.number()
    .typeError("Invalid Discount Percentage")
    .positive("Discount PCT must be > 0")

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

export default function UpdateInfo() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    prd_cd: "",  
    bar_cd: "8961100001439",
    max_pur_qty: "",
    prd_re_ord: "",
    prd_lot_ref: "",
    prd_qoh: "",
    exp_dt: "",
    max_rsp: ""
  });

  // ------------------------------------------------------
  // Handle input
  // ------------------------------------------------------
  const [prdCd, setPrdCd] = useState('');
  const [prdDesc, setPrdDesc] = useState('');
  const [prdCat, setPrdCat] = useState('');
  const [prdMaxPrc, setPrdMaxPrc] = useState('');
  const handleChange = (e: any) => {
  setForm({ ...form, [e.target.name]: e.target.value });
//    const { name, value } = e.target;
//    setForm(prev => ({ ...prev, [name]: value }));
  };
  //================= Clear Form =====================
  const clr_form = () => {
    setForm({
      prd_cd: "",  
      bar_cd: "",
      max_pur_qty: "",
      prd_re_ord: "",
      prd_lot_ref: "",
      prd_qoh: "",
      exp_dt: "",
      max_rsp: ""
    });
    setPrdCat('');
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
      const mast = await res.json();
      const wPrdCd = parseInt(mast.data.prd_cd)
      if (!res.ok) throw new Error("Product Master Record not found");
        setPrdDesc(mast.data.prd_desc || "");
        setPrdCat(mast.data.prd_cat || "");
        setPrdCd(mast.data.prd_cd || "");
    // console.log('prod code ');
    // console.log(wPrdCd);
    // console.log('prod code ');
      const resp = await fetch(`/api/pos/prods/get_prod_info?prd_cd=${wPrdCd}`);
      if (!resp.ok) throw new Error("Prices Record not found");
      const info = await resp.json();
      console.log(info);
      console.log('info');
      setForm({
        ...form,
        prd_cd: info.data.prd_cd || "",
        max_pur_qty: info.data.max_pur_qty || "",
        prd_lot_ref: info.data.prd_lot_ref || "",
        prd_qoh: info.data.prd_qoh || "",
        exp_dt: info.data.exp_dt || "",
        prd_re_ord: info.data.prd_re_ord || "",
        max_rsp:  info.data.max_rsp || ""
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
        console.log(form);

    e.preventDefault();

    try {
      // Validate only the editable fields
      await schema.validate(
        {
          max_pur_qty: form.max_pur_qty,
          prd_re_ord: form.prd_re_ord,
          exp_dt: form.exp_dt,
          prd_qoh: form.prd_qoh,
          prd_lot_ref: form.prd_lot_ref,
        },
        { abortEarly: false }
      );

      const res = await fetch("/api/pos/prods/save_prod_info", {
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
        clr_form();
//        alert(err.message);
      }
    }
  };
  // ------------------------------------------------------
  return (
    <>
      <Head>
        <title>Update Product Prices</title>
      </Head>

      <div className="border-2 min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-4 px-2">
        <div className="max-w-2xl mx-auto">
          <header className="mb-1 rounded-lg shadow-md p-2 text-center bg-linear-to-r from-green-600 via-emerald-600 to-teal-600">
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Update Product Misc Info.
            </h1>
          </header>

          <main className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Product Code */}
              <div className="grid grid-cols-[25%_25%_40%] gap-2 border-b">  
                <div>
                  Bar/Prod Code:<span className="text-red-500">*</span>
                </div>
                <div>
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
                    className="border border-black rounded px-3 py-2 text-sm w-75 bg-gray-100"
                    type="text"
                    name="prd_desc"
                    value={prdDesc}
                    disabled
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
                      value={form.max_rsp}
                      //value={form.prd_cd}
                      disabled
                      className="border border-black rounded px-3 py-2 text-sm w-32 bg-gray-100"
                    />
                </div>                
              </div> {/* --==============  end of 4 col grid ========== */}

              <div className="grid grid-cols-[25%_25%_25%_25%] gap-2 border-b">              
                <div className={"mr-5"}>Max Pur Qty: </div>
                <div>
                    <input
                      type="number"
                      name="max_pur_qty"
                      value={form.max_pur_qty}
                      onChange={handleChange}
                      className="border border-black rounded px-3 py-2 text-sm w-32"
                    />
                </div>              
                  <div className={"mr-1"}>Quantity on Hand:</div>
                  <div>
                    <input
                      type="number"
                      name="prd_qoh"
                      value={form.prd_qoh}
                      disabled
                      className="border border-black rounded px-3 py-2 text-sm w-32 bg-gray-100"
                    />
                </div>                

              </div> {/* --==============  end of 4 col grid ========== */}
              <div className="grid grid-cols-[25%_25%_25%_25%] gap-2 border-b">              
                <div className={"mr-7"}>
                  Lot Ref: {/* <span className="text-red-500">*</span> */}
                </div>
                <div>
                  <input
                    type="text"
                    name="prd_lot_ref"
                    value={form.prd_lot_ref}
                    onChange={handleChange}
                    className="border border-black rounded px-3 py-2 text-sm w-32"
                  />
                </div>

                <div className={"mr-1"}>
                  Expiry Date:<span className="text-red-500">*</span>
                </div>
                <div>
                  <input
                    type="date"
                    name="exp_dt"
                    value={form.exp_dt ? new Date(form.exp_dt).toISOString().split('T')[0] : ""}
                    onChange={handleChange}
                    className="border border-black rounded px-3 py-2 text-sm w-32"
                  />
                </div>
              </div>
              {/* //=========== Buttons ============== */}
              <div className="grid grid-cols-[2fr_3fr_5fr] gap-2 items-center">
                <div>
                  <button
                    className="w-50 flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md"
                    type="submit"
                  >
                    💾 Save
                  </button>
                </div>
                <div>
                  <button
                    className="w-50 flexjustify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md"
                    type="button"
                    onClick={() =>
                      clr_form()
                    }
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
