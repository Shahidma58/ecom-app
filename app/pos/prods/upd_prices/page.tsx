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

  tax_amt: Yup.number()
    .typeError("Invalid Tax Amount")
    .min(0, "Tax cannot be negative")
    .required("Tax Amount is required"),
});

export default function UpdatePrices() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    prd_cd: "",
    prd_desc: "",
    prd_cat: "",
    prd_brand: "",
    pur_prc: "",
    min_rsp: "",
    max_rsp: "",
    tax_amt: "",
  });

  // ------------------------------------------------------
  // Handle input
  // ------------------------------------------------------
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  //================= Clear Form =====================
  const clr_form = () => {
    setForm({
      prd_cd: "",
      prd_desc: "",
      prd_cat: "",
      prd_brand: "",
      pur_prc: "",
      min_rsp: "",
      max_rsp: "",
      tax_amt: "",
    });
  };

  // ------------------------------------------------- -----
  // Fetch product details by prd_cd
  // ------------------------------------------------------
  const fetchRecord = async () => {
    if (!form.prd_cd) {
      alert("Enter Product Code first.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/pos/prods/get_prod/${form.prd_cd}`);
      const data = await res.json();

      if (!res.ok) throw new Error("Record not found");
      //console.log(data)
      setForm({
        ...form,
        prd_desc: data.data.prd_desc || "",
        prd_cat: data.data.prd_cat || "",
        prd_brand: data.data.prd_brand || "",
        pur_prc: data.data.pur_prc || "",
        min_rsp: data.data.min_rsp || "",
        max_rsp: data.data.max_rsp || "",
        tax_amt: data.data.tax_amt || "",
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
          tax_amt: form.tax_amt,
        },
        { abortEarly: false }
      );

      const res = await fetch("/api/pos/prods/upd_prices", {
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
        <title>Update Product Prices</title>
      </Head>

      <div className="border-2 min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-4 px-2">
        <div className="max-w-2xl mx-auto">
          {/* <div className="max-w-500 mx-auto"> */}

          <header className="mb-1 rounded-lg shadow-md p-2 text-center bg-linear-to-r from-green-600 via-emerald-600 to-teal-600">
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Update Product Prices
            </h1>
          </header>

          <main className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Product Code */}
              <div className="grid grid-cols-[5fr_5fr] gap-2 items-center">
                {/* <div className="grid gap-2 items-center"> */}
                <div className="flex">
                  <label className="mr-8">
                    Product Code:<span className="text-red-500">*</span>
                  </label>
                  {/* <div className={"w-25 ml-2 mr-4"}> */}
                  <input
                    type="number"
                    name="prd_cd"
                    value={form.prd_cd}
                    onChange={handleChange}
                    onBlur={fetchRecord}
                    className="w-35 border border-black rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="prd_desc"
                    value={form.prd_desc}
                    disabled
                    className="border border-black rounded px-3 py-2 text-sm w-80 bg-gray-100"
                  />
                </div>
              </div>
              {/* Category */}
              <div className="grid grid-cols-[5fr_5fr] gap-2 items-center">
                <div>
                  <label className={"mr-18"}>Category:</label>
                  <input
                    type="text"
                    name="prd_cat"
                    value={form.prd_cat}
                    disabled
                    className="border border-black rounded px-3 py-2 text-sm w-32 bg-gray-100"
                  />
                </div>

                <div>
                  <label className={"mr-17"}>Brand:</label>
                  <input
                    type="text"
                    name="prd_brand"
                    value={form.prd_brand}
                    disabled
                    className="border border-black rounded px-3 py-2 text-sm w-32 bg-gray-100"
                  />
                </div>
              </div>
              {/* info to be updated */}
              {/* Purchase Price */}
              {/* <div className="grid grid-cols-[2fr_8fr] gap-2 items-center"> */}
              <div className="grid grid-cols-[5fr_5fr] gap-2 items-center">
                <div>
                  <label className={"mr-7"}>
                    Purchase Price:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="pur_prc"
                    value={form.pur_prc}
                    onChange={handleChange}
                    className="border border-black rounded px-3 py-2 text-sm w-32"
                  />
                </div>
                <div>
                  <label className={"mr-5"}>Tax Amount: </label>
                  <input
                    type="number"
                    name="tax_amt"
                    value={form.tax_amt}
                    onChange={handleChange}
                    className="border border-black rounded px-3 py-2 text-sm w-32"
                  />
                </div>
              </div>
              {/* Min RSP */}
              <div className="grid grid-cols-[5fr_5fr] gap-2 items-center">
                <div>
                  <label className={"mr-18"}>
                    Min RSP:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="min_rsp"
                    value={form.min_rsp}
                    onChange={handleChange}
                    className="border border-black rounded px-3 py-2 text-sm w-32"
                  />
                </div>
                {/* Max RSP */}
                <div>
                  <label className={"mr-10"}>
                    Max RSP:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="max_rsp"
                    value={form.max_rsp}
                    onChange={handleChange}
                    className="border border-black rounded px-3 py-2 text-sm w-32"
                  />
                </div>
              </div>
              {/* Tax Amount */}
              <div className="grid grid-cols-[2fr_3fr_5fr] gap-2 items-center">
                <div></div>
                {/* Buttons */}
                {/* <div className="flex flex-wrap gap-3 justify-center pt-2 border-t border-gray-300 mt-2"> */}
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
                      // setForm({
                      //   prd_cd: "",
                      //   prd_desc: "",
                      //   prd_cat: "",
                      //   prd_brand: "",
                      //   pur_prc: "",
                      //   min_rsp: "",
                      //   max_rsp: "",
                      //   tax_amt: "",
                      // })
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

{
  /* <button
                    type="button"
                    onClick={fetchRecord}
                    className="ml-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-md"
                  >
                    {loading ? "..." : "Search"}
                  </button> */
}
