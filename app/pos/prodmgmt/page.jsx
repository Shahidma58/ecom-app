'use client';
import Head from 'next/head';

export default function ProductsManagement() {
  return (
    <>
      <Head>
        <title>Products Management</title>
      </Head>

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-4 px-2">
        <div className="max-w-3xl mx-auto">
          {/* Title Banner - Reduced Height */}
          <header className="mb-1 rounded-lg shadow-md p-2 text-center bg-linear-to-r from-green-600 via-emerald-600 to-teal-600">
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Products Management
            </h1>
          </header>

          {/* Main Content Form Section */}
          <main className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-300">
              Product Details
            </h3>
            
            <form className="space-y-2">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <label htmlFor="prd_cd" className="text-sm font-medium text-gray-700 text-left">
                  Product Code <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  id="prd_cd" 
                  name="prd_cd" 
                  required 
                  className="w-[150px] md:col-span-3 border border-black rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>
              
              {/* 2. Description */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <label htmlFor="prd_desc" className="text-sm font-medium text-gray-700 text-left">
                  Description <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="prd_desc" 
                  name="prd_desc" 
                  required 
                  className="w-[300px] md:col-span-3 border border-black rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>
              {/* 3. Category */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <label htmlFor="prd_cat" className="text-sm font-medium text-gray-700 text-left">
                  Category <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="prd_cat" 
                  name="prd_cat" 
                  required 
                  className="w-[200px] md:col-span-3 border border-black rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>
              
              {/* 4. Brand */}
              {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <label htmlFor="prd_brand" className="text-sm font-medium text-gray-700 text-left">
                  Brand
                </label>
                <input 
                  type="text" 
                  id="prd_brand" 
                  name="prd_brand" 
                  className="w-[100px] md:col-span-3 border border-black rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                />
                <button 
                  type="button" 
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition-all hover:shadow-lg"
                >
                  Help
                </button>
              </div> */}
<div className="flex flex-wrap items-center gap-4">
  <label
    htmlFor="prd_brand"
    className="text-sm font-medium text-gray-700 text-left"
  >
    Brand
  </label>

  <input
    type="text"
    id="prd_brand"
    name="prd_brand"
    className="w-[100px] border border-black rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
  />

  <button
    type="button"
    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition-all hover:shadow-lg"
  >
    Help
  </button>
</div>


              {/* 5. SKU */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <label htmlFor="prd_sku" className="text-sm font-medium text-gray-700 text-left">
                  SKU <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="prd_sku" 
                  name="prd_sku" 
                  required 
                  className="w-[100px] md:col-span-3 border border-black rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>

              {/* 6. Image Link */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <label htmlFor="prd_img_lnk" className="text-sm font-medium text-gray-700 text-left">
                  Image Link
                </label>
                <input 
                  type="url" 
                  id="prd_img_lnk" 
                  name="prd_img_lnk" 
                  placeholder="https://example.com/image.jpg" 
                  className="w-[350px] md:col-span-3 border border-black rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>

              {/* Button Bar */}
              <div className="flex flex-wrap gap-3 justify-center pt-2 border-t border-gray-300 mt-2">
                <button 
                  type="submit" 
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition-all hover:shadow-lg"
                >
                  <span className="text-lg">💾</span> Save
                </button>
                <button 
                  type="reset" 
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition-all hover:shadow-lg"
                >
                  <span className="text-lg">🧹</span> Clear
                </button>
                <button 
                  type="button" 
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition-all hover:shadow-lg"
                >
                  <span className="text-lg">🗑️</span> Delete
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </>
  );
}