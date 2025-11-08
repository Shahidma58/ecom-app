"use client";

import { useEffect, useState } from "react";
import ProductCard from "../components/product";
import Footer from "../components/footer";

const ITEMS_PER_PAGE = 5; // 3 rows * 3 columns

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/ecom/prods");
        const data = await response.json();
        //console.log(data);
        setProducts(data.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const dispProds = products.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading products...
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Our Products</h1>

        {/* 3 columns layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {dispProds.map((product, prd_cd) => (
            <ProductCard key={prd_cd} product={product} />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50">
            Previous
          </button>

          <span className="text-gray-800">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
