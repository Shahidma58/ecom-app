"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "./bill.css";

interface SaleItem {
  itm_cd: number;
  itm_desc: string;
  itm_qty: number;
  itm_rsp: number;
  itm_disc: number;
  itm_amt: number;
}

interface SaleTotal {
  sal_id: number;
  sal_dt: string;
  sal_amt: number;
  sal_qty: number;
  sal_items: number;
  sal_disc: number;
  inp_by: string;
}

export default function BillPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saleTotal, setSaleTotal] = useState<SaleTotal | null>(null);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await fetch(`/api/pos/save_tran?sal_id=${id}`);
        const data = await res.json();

        if (data.success) {
          setSaleTotal(data.data.salTots[0]);
          setSaleItems(data.data.salItms);
        } else {
          console.error("Failed to fetch bill:", data.message);
        }
      } catch (err) {
        console.error("Error fetching bill:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBill();
  }, [id]);

  if (loading) return <div className="bill-loading">Loading bill...</div>;
  if (!saleTotal) return <div className="bill-error">No bill found.</div>;

  return (
    <div className="bill-container">
      <div className="bill-header">
        <h1 className="bill-title">🧾 HerbaGlam - Customer Bill</h1>
        <div className="bill-info">
          <p>
            <strong>Bill No:</strong> {saleTotal.sal_id}
          </p>
          <p>
            <strong>Date:</strong> {new Date(saleTotal.sal_dt).toLocaleString()}
          </p>
          <p>
            <strong>Cashier:</strong> {saleTotal.inp_by}
          </p>
        </div>
      </div>

      <table className="bill-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Disc</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {saleItems.map((item, index) => (
            <tr key={index}>
              <td>{item.itm_cd}</td>
              <td>{item.itm_desc}</td>
              <td>{item.itm_qty}</td>
              <td>{Number(item.itm_rsp || 0).toFixed(2)}</td>
              <td>{item.itm_disc}</td>
              <td>{Number(item.itm_amt || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bill-summary">
        <p>
          <strong>Total Qty:</strong> {saleTotal.sal_qty}
        </p>
        <p>
          <strong>Total Items:</strong> {saleTotal.sal_items}
        </p>
        <p>
          <strong>Total Discount:</strong> {saleTotal.sal_disc}
        </p>
        <p className="bill-net">
          💰 <strong>Net Amount:</strong>{" "}
          {Number(saleTotal.sal_amt || 0).toFixed(2)}
        </p>
      </div>

      <button onClick={() => window.print()} className="print-btn">
        🖨️ Print Bill
      </button>
    </div>
  );
}
