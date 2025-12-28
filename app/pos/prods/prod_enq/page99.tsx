"use client";

import React, { useState, useEffect } from "react";

// Debounce helper
function useDebounce(value: string, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function ProdEnquiry() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Search fields
  const [searchDesc, setSearchDesc] = useState("");
  const [searchBrand, setSearchBrand] = useState("");
  const [brnCode, setBrnCode] = useState("");

  // Debounced values
  const debouncedDesc = useDebounce(searchDesc, 300);
  const debouncedBrand = useDebounce(searchBrand, 300);

  // Sorting
  const [sortBy, setSortBy] = useState(""); // qoh | min_rsp | max_rsp
  const [sortOrder, setSortOrder] = useState("asc"); // asc | desc

  const [totalPages, setTotalPages] = useState(1);

  // Modal
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const fetchData = async () => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      prd_desc: debouncedDesc,
      prd_brand: debouncedBrand,
      sort_by: sortBy,
      sort_order: sortOrder,
      brn_code: brnCode,
    });
    // if (brnCode) {
    //   params.append('brn_cod', brnCode.toString());
    // }
console.log(brnCode);
console.log('params');
console.log(params);
    const res = await fetch(`/api/pos/prods/prod_enq?${params}`);
    const json = await res.json();

    setProducts(json.data);
    setTotalPages(json.totalPages);
//    console.log(json.data);
  };

  // Fetch when entering page
  useEffect(() => {
    console.log('getiing g gg  data')
    fetchData();
  }, [page, debouncedDesc, debouncedBrand, sortBy, sortOrder, brnCode]); 

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortBy === field) {
      // toggle asc/desc
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//    setBrnCode(e.target.value);
    setPage(1); // Reset to first page
  };

  return (
    <div className="p-1">
      {/* Search Section */}
      <div className="grid grid-cols-3 gap-4 bg-white p-1 rounded-lg shadow mb-1 border border-emerald-200">
        <div className="text-2xl font-bold text-emerald-700 mb-2">
          Products Enquiry
        </div>
        {/* <div className="grid grid-cols-3 gap-4"> */}
        <div className="flex">
      {/* <div className="flex flex-wrap items-center gap-4 mb-4"> */}
          {/* <div className="mr-4"> */}
            <input
              type="number"
              maxLength={3}
              placeholder="Branch"
              className="w-15 p-1 border rounded-lg focus:ring-emerald-500 border-emerald-300"
              value={brnCode}
              onChange={(e) => setBrnCode(e.target.value)}
            />
            {/* </div> */}
            <button 
              className="w-15 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1.5 px-2 rounded-md shadow-md transition-all"
              onClick={() => handleBranchChange}
            >
              Refresh
            </button>
           {/* <div> */}
            <input
              type="text"
              placeholder="Search by Description"
              className="w-75 p-1 border rounded-lg focus:ring-emerald-500 border-emerald-300"
              value={searchDesc}
              onChange={(e) => {
                setSearchDesc(e.target.value);
                setPage(1);
              }}
            />
          {/* </div> */}
          {/* <div className="ml-6"> */}
            <input
              type="text"
              placeholder="Search by Brand"
              className=" W-15 p-1 border rounded-lg focus:ring-emerald-500 border-emerald-300"
              value={searchBrand}
              onChange={(e) => {
                setSearchBrand(e.target.value);
                setPage(1);
              }}
            />
          {/* </div> */}
        </div>
      </div>
      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded-lg text-left border-collapse">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="p-1">Brn</th>
              <th className="p-1">Code</th>
              <th className="p-1">Description</th>
              <th className="p-1">Brand</th>
              {/* Sorting Headers */}
              <th
                className="p-1 cursor-pointer"
                onClick={() => handleSort("prd_qoh")}
              >
                QOH{" "}
                {sortBy === "prd_qoh" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>

              <th
                className="p-1 cursor-pointer"
                onClick={() => handleSort("min_rsp")}
              >
                Min RSP{" "}
                {sortBy === "min_rsp" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>

              <th
                className="p-1 cursor-pointer"
                onClick={() => handleSort("max_rsp")}
              >
                Max RSP{" "}
                {sortBy === "max_rsp" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
            </tr>
          </thead>

          <tbody>
            {products?.map((item: any) => (
              <tr
                key={item.prd_cd}
                className="border-2 border-purple-400 cursor-pointer hover:bg-emerald-100 hover:shadow-inner transition-all"                // className="border-b hover:bg-emerald-50 cursor-pointer"
                onClick={() => setSelectedProduct(item)}>
                <td className="p-0.5">{item.brn_cd}</td>
                <td className="p-0.5">{item.prd_cd}</td>
                <td className="p-0.5">{item.prd_desc}</td>
                <td className="p-0.5">{item.prd_brand}</td>
                <td className="p-0.5">{item.prd_qoh}</td>
                <td className="p-0.5">{item.min_rsp}</td>
                <td className="p-0.5">{item.max_rsp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-emerald-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>

        <span className="font-semibold text-emerald-700">
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-emerald-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 border border-emerald-400">
            <h2 className="text-xl font-bold text-emerald-700 mb-4">
              Product Details
            </h2>

            <div className="space-y-2">
              <div>
                <strong>Brn:</strong> {selectedProduct.prd_cd}
              </div>
              <div>
                <strong>Code:</strong> {selectedProduct.prd_cd}
              </div>
              <div>
                <strong>Description:</strong> {selectedProduct.prd_desc}
              </div>
              <div>
                <strong>Brand:</strong> {selectedProduct.prd_brand}
              </div>
              <div>
                <strong>QOH:</strong> {selectedProduct.prd_qoh}
              </div>
              <div>
                <strong>Purchase Price:</strong> {selectedProduct.pur_prc}
              </div>
              <div>
                <strong>Min RSP:</strong> {selectedProduct.min_rsp}
              </div>
              <div>
                <strong>Max RSP:</strong> {selectedProduct.max_rsp}
              </div>
              <div>
                <strong>Status:</strong> {selectedProduct.prd_stat}
              </div>
            </div>

            <button
              className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg"
              onClick={() => setSelectedProduct(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
