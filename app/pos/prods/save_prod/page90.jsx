"use client";
import Head from "next/head";

export default function ProductsManagement() {
  return (
    <>
      <Head>
        <title>Products Management</title>
      </Head>

      <div className="border-2 min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-4 px-2">
        <div className="max-w-2xl mx-auto">
          {/* Title Banner - Reduced Height */}
          <header className="mb-1 rounded-lg shadow-md p-2 text-center bg-linear-to-r from-green-600 via-emerald-600 to-teal-600">
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Products Management
            </h1>
          </header>

          {/* Main Content Form Section */}
          <main className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
            {/* <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-300">
              Product Details
            </h3> */}

            <form className="space-y-2">
              {/* 1. Category */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center"> */}
                <div>
                  {/* className="bg-gray-200 p-2" */}
                  Product Code:<span className="text-red-500">*</span>
                </div>
                <div>
                  <input
                    type="number"
                    id="prd_cd"
                    name="prd_cd"
                    required
                    className="w-32 border border-black rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                  />

                  <input
                    type="text"
                    id="prd_desc"
                    name="prd_desc"
                    required
                    className="ml-4 w-80 border border-black rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>
              </div>
              {/* 3. Category */}

              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>
                  Category:<span className="text-red-500">*</span>
                </div>
                <div>
                  <input
                    type="text"
                    id="prd_cat"
                    name="prd_cat"
                    required
                    className="w-32 md:col-span-1 border border-black rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                  <input
                    type="text"
                    id="cat_desc"
                    name="cat_desc"
                    required
                    className="ml-4 w-80 border border-black rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center"> */}
                <div>
                  Brand:<span className="text-red-500">*</span>
                </div>
                <div>
                  <input
                    type="text"
                    id="prd_brand"
                    name="prd_brand"
                    className="w-[100px] border border-black rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                  <button
                    type="button"
                    className="pt-2 h-9 ml-2 w-6 items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition-all hover:shadow-lg"
                  >
                    ?
                  </button>

                  <input
                    type="text"
                    id="_desc"
                    name="prd_desc"
                    className="ml-2 w-75 border border-black rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="flex gap-4"></div>
              </div>
              {/* ====================================================== */}
              {/* 5. SKU */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>
                  SKU:<span className="text-red-500">*</span>
                </div>
                <div>
                  <input
                    type="text"
                    id="prd_sku"
                    name="prd_sku"
                    required
                    className="w-[100px] md:col-span-3 border border-black rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>
              </div>
              {/* 6. Image Link */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>Image Link:</div>
                <div>
                  <input
                    type="url"
                    id="prd_img_lnk"
                    name="prd_img_lnk"
                    placeholder="https://example.com/image.jpg"
                    className="w-100 md:col-span-3 border border-black rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>
              </div>
              {/* Button Bar */}
              <div className="flex flex-wrap gap-3 justify-center pt-2 border-t border-gray-300 mt-2">
                <button
                  type="submit"
                  className=" w-50 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition-all hover:shadow-lg"
                >
                  <span className="text-lg">💾</span> Save
                </button>
                <button
                  type="reset"
                  className="w-50 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition-all hover:shadow-lg"
                >
                  <span className="text-lg">🧹</span> Clear
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </>
  );
}
