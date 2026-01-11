"use client";

import React, { useEffect, useState } from "react";
import Barcode from "./barcomp";
import "./stickers.css";

interface StickerProduct {
  prd_cd: number;
  prod_mast: {
    bar_cd: string;
    prd_desc: string;
  };
  max_rsp: number;
}

export default function StickerPrintPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<StickerProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/pos/products/print");
        const data = await res.json();

        if (data.success) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error("Sticker fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="loading">Loading stickers…</div>;

  return (
    <div className="sticker-page">
      <div className="sticker-sheet">
        {products.map((p, index) => (
          <div key={index} className="sticker">
            <div className="sticker-title">
              {p.prod_mast.prd_desc}
            </div>

            <Barcode
              value={p.prod_mast.bar_cd}
              width={2}
              height={40}
              displayValue={true}
            />

            <div className="sticker-footer">
              <span className="price">
                Rs. {Number(p.max_rsp).toFixed(0)}
              </span>
              <span className="code">#{p.prd_cd}</span>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => window.print()} className="print-btn">
        🖨️ Print Stickers
      </button>
    </div>
  );
}
