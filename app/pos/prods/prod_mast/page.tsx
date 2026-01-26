"use client";

import Head from "next/head";
import { useState } from "react";
import * as Yup from "yup";

// =========================
// YUP VALIDATION SCHEMA
// =========================
const schema = Yup.object().shape({
  prd_cd: Yup.number().required("Product Code is required"),
  bar_cd: Yup.number().required("Bar Code is required"),
  prd_desc: Yup.string().required("Description is required"),
  prd_cat: Yup.number().required("Category is required"),
  prd_brand: Yup.number().required("Brand is required"),
});

export default function ProductsManagement() {
  const [form, setForm] = useState({
    prd_cd: "",
    bar_cd: "",
    prd_desc: "",
    prd_cat: "",
    prd_brand: "",
    prd_sku: "",
    prd_img_lnk: "",
  });

  const [existingProduct, setExistingProduct] = useState(null);
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
    if (!form.prd_cd) return;
    try {
      const res = await fetch(`/api/pos/prods/get_prod_mast?bar_cd=${form.prd_cd}`);
      const data = await res.json();
      if (data.success && data.data) {
        const p = data.data;
        setForm({
          prd_cd: p.prd_cd,
          bar_cd: p.bar_cd,
          prd_desc: p.prd_desc,
          prd_cat: p.prd_cat,
          prd_brand: p.prd_brand,
          prd_sku: p.prd_sku ?? "",
          prd_img_lnk: p.prd_img_lnk ?? "",
        });

        // Fetch category description
        if (p.prd_cat) {
          try {
            const res = await fetch(`/api/pos/prdcat/get_rec/${p.prd_cat}`);
            if (res.ok) {
              const data = await res.json();
              setCateg_Desc(data.data?.cat_desc || "");
            }
          } catch (error) {
            console.log("Category fetch error:", error);
          }
        }

        // Fetch brand name
        if (p.prd_brand) {
          try {
            const res = await fetch(`/api/pos/brands/get_rec/${p.prd_brand}`);
            if (res.ok) {
              const data = await res.json();
              setBrand_Name(data.data?.brnd_name || "");
            }
          } catch (error) {
            console.log("Brand fetch error:", error);
          }
        }

        setExistingProduct(p);
        setMessage("Product loaded ✔");
      } else {
        setExistingProduct(null);
        setMessage("New Product");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error fetching product");
    }
  };

  //============== Brand Change Handler ===============
  const handleBrandChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("prd_brand", value);

    if (!value) {
      setBrand_Name("");
      return;
    }

    try {
      const res = await fetch(`/api/pos/brands/get_rec/${value}`);
      if (!res.ok) {
        setBrand_Name("Not Found");
        return;
      }

      const data = await res.json();
      setBrand_Name(data.data?.brnd_name || "");
    } catch (error) {
      console.log("Brand fetch error:", error);
      setBrand_Name("");
    }
  };

  //============== Categ Change Handler ===============
  const handleCategChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setValue("prd_cat", value);

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
      setCateg_Desc(data.data?.cat_desc || "");
    } catch (error) {
      console.log("Category fetch error:", error);
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
      // Convert string values to numbers for numeric fields
      const payload = {
        ...form,
        prd_cd: Number(form.prd_cd),
        prd_cat: Number(form.prd_cat),
        prd_brand: Number(form.prd_brand),
      };

      const response = await fetch("/api/pos/prods/save_prod_mast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
console.log('saved...........');
      if (data.success) {
console.log('saved---------------');
        clearForm;
        setMessage(data.message);
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
      bar_cd: "",
      prd_desc: "",
      prd_cat: "",
      prd_brand: "",
      prd_sku: "",
      prd_img_lnk: "",
    });
    setExistingProduct(null);
    setMessage("");
    setBrand_Name("");
    setCateg_Desc("");
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
                    maxLength={17}
                    value={form.prd_cd}
                    onChange={(e) => setValue("prd_cd", e.target.value)}
                    onBlur={fetchProduct}
                    className="w-32 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
                    required
                  />

                  <input
                    type="text"
                    maxLength={35}
                    value={form.prd_desc}
                    onChange={(e) => setValue("prd_desc", e.target.value)}
                    className="ml-4 w-80 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-[21%_30%_25%_25%]">
                {/* Bar Code */}
                {/* <div className="grid grid-cols-[4fr_6fr] gap-2 items-center"> */}
                  <div>Bar Code:</div>
                  <div>
                    <input
                    type="text"
                    maxLength={20}
                    value={form.bar_cd}
                    onChange={(e) => setValue("bar_cd", e.target.value)}
                    className="border border-black rounded px-3 py-2 text-sm"
                  />
                </div>
              {/* </div> */}
              {/* SKU */}
              {/* <div className="grid grid-cols-[2fr_8fr] gap-2 items-center"> */}
                <div className="text-right">SKU:</div>
                <div>
                  <input
                    type="text"
                    maxLength={5}
                    value={form.prd_sku}
                    onChange={(e) => setValue("prd_sku", e.target.value)}
                    className="w-[100px] border border-black rounded px-3 py-2 text-sm"
                  />
                </div>
                {/* </div> */}
              </div>
              {/* Category */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>
                  Category:<span className="text-red-500">*</span>
                </div>

                <div>
                  <input
                    type="number"
                    maxLength={3}
                    value={form.prd_cat}
                    onChange={handleCategChange}
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
                <div>
                  Brand:<span className="text-red-500">*</span>
                </div>

                <div>
                  <input
                    className="w-[100px] border border-black rounded px-3 py-2 text-sm"
                    type="number"
                    maxLength={5}
                    value={form.prd_brand}
                    onChange={handleBrandChange}
                    required
                  />

                  <button
                    type="button"
                    className="pt-2 h-9 ml-2 w-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow-md"
                  >
                    ?
                  </button>

                  <input
                    type="text"
                    value={brand_name}
                    disabled
                    className="ml-2 w-75 border border-black rounded px-3 py-2 text-sm bg-gray-200"
                  />
                </div>
              </div>

              {/* SKU */}
              {/* <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>SKU:</div>
                <div>
                  <input
                    type="text"
                    value={form.prd_sku}
                    onChange={(e) => setValue("prd_sku", e.target.value)}
                    className="w-[100px] border border-black rounded px-3 py-2 text-sm"
                  />
                </div>
              </div> */}

              {/* Image Link */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>Image Link:</div>
                <div>
                  <input
                    type="text"
                    maxLength={50}
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