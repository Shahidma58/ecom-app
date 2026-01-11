"use client";

import React, { useEffect, useState } from "react";
import "./prod_rep01.css";

interface ProductPrint {
  prd_cd: number;
  brn_cd: number;
  prd_qoh: number;
  prd_re_ord: number;
  max_rsp: number;
  pur_prc: number;
  bar_cd: string;
  prd_desc: string;
}

const ITEMS_PER_PAGE = 30; // adjust for printer / paper size

export default function ProductPrintPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductPrint[]>([]);
  const [branch, setBranch] = useState<number>(100);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/pos/reps/prod_rep?brn_cd=${branch}`);
        const data = await res.json();

        if (data.success) setProducts(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [branch]);

  if (loading) return <div className="print-loading">Loading products…</div>;

  // Split products into pages
  const pages: ProductPrint[][] = [];
  for (let i = 0; i < products.length; i += ITEMS_PER_PAGE) {
    pages.push(products.slice(i, i + ITEMS_PER_PAGE));
  }

  return (
    <div className="print-page">
      {pages.map((pageItems, pageIndex) => {
        // Compute running totals for this page
        const pageTotals = pageItems.reduce(
          (tot, p) => ({
            qoh: tot.qoh + Number(p.prd_qoh),
            cost: tot.cost + Number(p.pur_prc),
            rsp: tot.rsp + Number(p.max_rsp),
          }),
          { qoh: 0, cost: 0, rsp: 0 }
        );

        return (
          <div key={pageIndex} className="print-container page-break">
            {/* HEADER */}
            <div className="print-header">
              <h1 className="store-name">HerbaGlam</h1>
              <p className="store-info">Inventory Stock Report</p>
              <p className="store-info">
                Branch: {branch} | Page: {pageIndex + 1} | Printed:{" "}
                {new Date().toLocaleString()}
              </p>
            </div>

            <div className="print-divider"></div>

            {/* TABLE HEADER */}
            <div className="print-table-header">
              <span>BAR Code</span>
              <span>Description</span>
              <span>QOH</span>
              <span>Re-Ord</span>
              <span>Cost</span>
              <span>RSP</span>
            </div>

            <div className="print-divider"></div>

            {/* ITEMS */}
            {pageItems.map((p, idx) => (
              <div key={idx} className="print-row">
                <span>{p.bar_cd}</span>
                <span className="desc">
                  {p.prd_desc}
                  <div className="barcode">Code: {p.prd_cd}</div>
                </span>
                <span>{p.prd_qoh}</span>
                <span>{p.prd_re_ord}</span>
                <span>{Number(p.pur_prc).toFixed(2)}</span>
                <span>{Number(p.max_rsp).toFixed(2)}</span>
              </div>
            ))}

            <div className="print-divider"></div>

            {/* PAGE TOTALS */}
            <div className="flex totals-section gap-20">
              <div className="total-row">
                <span>Page: </span>
                <span>{pageIndex + 1}</span>
              </div>  
              <div className="gap-5 total-row">
                <span> Total QOH:</span>
                <span>{pageTotals.qoh}</span>
              </div>
              <div className="gap-5 total-row">
                <span> Cost:</span>
                <span>{pageTotals.cost.toFixed(2)}</span>
              </div>
              <div className="gap-5 total-row">
                <span> RSP:</span>
                <span>{pageTotals.rsp.toFixed(2)}</span>
              </div>
            </div>

            <div className="print-divider-thick"></div>
          </div>
        );
      })}

      {/* PRINT BUTTON */}
      <button onClick={() => window.print()} className="print-btn">
        🖨️ Print
      </button>
    </div>
  );
}
