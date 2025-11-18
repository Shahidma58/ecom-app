"use client";

import Head from "next/head";
import { useState } from "react";
import * as Yup from "yup";

// =========================
// YUP VALIDATION SCHEMA
// =========================
const schema = Yup.object().shape({
  prd_cd: Yup.number().required("Product Code is required"),
  prd_desc: Yup.string().required("Description is required"),
  prd_cat: Yup.string().required("Category is required"),
});

export default function ProductsManagement() {
  const [form, setForm] = useState({
    prd_cd: "",
    prd_desc: "",
    prd_cat: "",
    prd_brand: "",
    prd_sku: "",
    prd_img_lnk: "",
  });

  const [existingProduct, setExistingProduct] = useState(null); // Track read result
  const [message, setMessage] = useState("");

  const [brand_name, setBrand_Name] = useState("");
  const [categ_desc, setCateg_Desc] = useState("");
  // Handle input change
  const setValue = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // =========================
  // AUTO-FILL ON BLUR
  // =========================
  const fetchProduct = async () => {
    // if (!form.prd_cd.trim()) return;
    if (!form.prd_cd) return;

    try {
      const res = await fetch(`/api/pos/prods/get_prod/${form.prd_cd}`);
      const data = await res.json();

      if (data.success && data.data) {
        const p = data.data;

        // Fill ONLY form fields; leave others untouched
        setForm({
          prd_cd: p.prd_cd,
          prd_desc: p.prd_desc,
          prd_cat: p.prd_cat,
          prd_brand: p.prd_brand ?? "",
          prd_sku: p.prd_sku ?? "",
          prd_img_lnk: p.prd_img_lnk ?? "",
        });
//============================================
// BEFORE:
setForm({
  prd_cd: p.prd_cd,
  prd_desc: p.prd_desc,
  prd_cat: p.prd_cat,  // ❌ This bypasses the handler
  prd_brand: p.prd_brand ?? "",
  prd_sku: p.prd_sku ?? "",
  prd_img_lnk: p.prd_img_lnk ?? "",
});

// AFTER:
setForm({
  prd_cd: p.prd_cd,
  prd_desc: p.prd_desc,
  prd_cat: p.prd_cat,
  prd_brand: p.prd_brand ?? "",
  prd_sku: p.prd_sku ?? "",
  prd_img_lnk: p.prd_img_lnk ?? "",
});

// ADD THESE LINES after setForm:
// Manually fetch category description
if (p.prd_cat) {
  try {
    const res = await fetch(`/api/pos/prdcat/get_rec/${p.prd_cat}`);
    if (res.ok) {
      const data = await res.json();
      console.log(data.data.cat_desc);
      setCateg_Desc(data.data.cat_desc || ""); 
    }
  } catch (error) {
    console.log("Category fetch error:", error);
  }
}
//==============================================
        setExistingProduct(p);
        setMessage("Product loaded ✔");
      } else {
        setExistingProduct(null);
        setMessage("New product entry (not found in DB)");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error fetching product");
    }
  };
//============== Brand Change Handler ===============
    // 
    const handleBrandChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Update the field first
    setBrand_Name(value);

    // If empty, reset brand_name
    if (!value) {
        setBrand_Name("");
        return;
    }

    try {
        const res = await fetch(`/brands/get_rec/${value}`);
        if (!res.ok) {
        setBrand_Name("Not Found");
        return;
        }

        const data = await res.json();

        // Assuming API returns -> { brnd_name: "Samsung" }
        setBrand_Name(data.brnd_name || "");
    } catch (error) {
        console.log("Brand fetch error:", error);
        setBrand_Name("");
    }
    };
//============== Categ Change Handler ===============
    const handleCategChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Update the field first
    setCateg_Desc(value);
console.log(value);
    // If empty, reset brand_name
    if (!value) {
        setCateg_Desc("");
        return;
    }

    try {
        const res = await fetch(`/api/pos/prdcat/get_rec/${value}`);
        if (!res.ok) {
        setCateg_Desc("Not Found");
        return;
        }

        const data = await res.json();

        // Assuming API returns -> { brnd_name: "Samsung" }
        setCateg_Desc(data.data.cat_desc || "");
    } catch (error) {
        console.log("Brand fetch error:", error);
        setCateg_Desc("");
    }
    };

  // =========================
  // CREATE or UPDATE PRODUCT
  // =========================
  const saveProduct = async (e: any) => {
    e.preventDefault();

    try {
      await schema.validate(form, { abortEarly: false });
    } catch (validationErr: any) {
      setMessage(validationErr.errors.join(", "));
      return;
    }

    try {
      const response = await fetch("/api/pos/prods/save_prod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);

        // Simple popup animation
        setTimeout(() => setMessage(""), 2000);
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      console.log(err);
      setMessage("Server error while saving");
    }
  };

  // Reset form
  const clearForm = () => {
    setForm({
      prd_cd: "",
      prd_desc: "",
      prd_cat: "",
      prd_brand: "",
      prd_sku: "",
      prd_img_lnk: "",
    });
    setExistingProduct(null);
    setMessage("");
  };

  return (
    <>
      <Head>
        <title>Products Management</title>
      </Head>

      <div className="border-2 min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-4 px-2">
        <div className="max-w-2xl mx-auto">
          <header className="mb-1 rounded-lg shadow-md p-2 text-center bg-linear-to-r from-green-600 via-emerald-600 to-teal-600">
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Products Management
            </h1>
          </header>

          <main className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
            <form className="space-y-2" onSubmit={saveProduct}>
              {/* Product Code + Desc */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>
                  Product Code:<span className="text-red-500">*</span>
                </div>

                <div>
                  <input
                    type="number"
                    value={form.prd_cd}
                    onChange={(e) => setValue("prd_cd", e.target.value)}
                    onBlur={fetchProduct}
                    className="w-32 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
                    required
                  />

                  <input
                    type="text"
                    value={form.prd_desc}
                    onChange={(e) => setValue("prd_desc", e.target.value)}
                    className="ml-4 w-80 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>
                  Category:<span className="text-red-500">*</span>
                </div>

                <div>
                  <input
                    type="text"
                    value={form.prd_cat}
                //  onChange={handleCategChange}
                    onChange={(e) => {
                        setValue("prd_cat", e.target.value);  // ✅ Update form first
                        handleCategChange(e);  // ✅ Then call the handler
                    }}
                    className="w-32 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
                    required
                  />

                  <input
                    type="text"
                    value={categ_desc} 
                    disabled
                    className="ml-4 w-80 border border-black rounded px-3 py-2 text-sm bg-gray-200"
                  />
                </div>
              </div>

              {/* Brand */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>Brand:</div>

                <div>
                  <input
                    type="text"
                    value={form.prd_brand}
                    onChange={handleBrandChange}
                    // onChange={(e) => setValue("prd_brand", e.target.value)}
                    className="w-[100px] border border-black rounded px-3 py-2 text-sm"
                  />

                  <button
                    type="button"
                    className="pt-2 h-9 ml-2 w-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow-md"
                  >
                    ?
                  </button>

                  <input
                    type="text"
                    value={"brand_name"} // Placeholder until lookup ready
                    disabled
                    className="ml-2 w-75 border border-black rounded px-3 py-2 text-sm bg-gray-200"
                  />
                </div>
              </div>

              {/* SKU */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>SKU:</div>
                <div>
                  <input
                    type="text"
                    value={form.prd_sku}
                    onChange={(e) => setValue("prd_sku", e.target.value)}
                    className="w-[100px] border border-black rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Image Link */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>Image Link:</div>
                <div>
                  <input
                    type="text"
                    value={form.prd_img_lnk}
                    onChange={(e) => setValue("prd_img_lnk", e.target.value)}
                    className="w-100 border border-black rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-center pt-2 border-t border-gray-300 mt-2">
                <button
                  type="submit"
                  className="w-50 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition-all"
                >
                  💾 Save
                </button>

                <button
                  type="button"
                  onClick={clearForm}
                  className="w-50 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition-all"
                >
                  🧹 Clear
                </button>
              </div>
            </form>

            {/* Popup message */}
            {message && (
              <div className="mt-3 text-center text-sm font-semibold text-emerald-700 animate-pulse">
                {message}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
