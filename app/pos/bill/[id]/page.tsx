//       router.push(`/pos/bill/${data.tran_id}`);
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "./bill.css";
//import { useAuth } from "@/app/context/AuthContext";

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
  brn_cd?: string;
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

  // Calculate subtotal (before discount)
  const subtotal = saleItems.reduce((sum, item) => {
    return sum + (Number(item.itm_rsp) * Number(item.itm_qty));
  }, 0);

  return (
    <div className="receipt-page">
      <div className="receipt-container">
        {/* Header */}
        <div className="receipt-header">
          <h1 className="store-name">HerbaGlam</h1>
          <p className="store-info">Premium Beauty & Wellness</p>
          <p className="store-info">123 Main Street, City</p>
          <p className="store-info">Tel: (123) 456-7890</p>
        </div>

        <div className="receipt-divider"></div>

        {/* Bill Info */}
        <div className="info-section">
          <div className="info-row">
            <span>Bill No:</span>
            <span>{saleTotal.sal_id}</span>
          </div>
          <div className="info-row">
            <span>Date:</span>
            <span>{new Date(saleTotal.sal_dt).toLocaleString()}</span>
          </div>
          <div className="info-row">
            <span>Cashier:</span>
            <span>{saleTotal.inp_by}</span>
          </div>
          {saleTotal.brn_cd && (
            <div className="info-row">
              <span>Branch:</span>
              <span>{saleTotal.brn_cd}</span>
            </div>
          )}
        </div>

        <div className="receipt-divider"></div>

        {/* Items */}
        <div className="items-section">
          {saleItems.map((item, index) => {
            const itemDiscount = Number(item.itm_disc) * Number(item.itm_qty);
            const netPrice = Number(item.itm_rsp) - Number(item.itm_disc);
            
            return (
              <div key={index} className="receipt-item">
                <div className="item-header">
                  <span className="item-desc">{item.itm_desc}</span>
                  <span className="item-code">#{item.itm_cd}</span>
                </div>
                <div className="item-details">
                  <span>
                    {item.itm_qty} x {Number(item.itm_rsp).toFixed(2)}
                  </span>
                  <span className="item-total">
                    {(Number(item.itm_rsp) * Number(item.itm_qty)).toFixed(2)}
                  </span>
                </div>
                {item.itm_disc > 0 && (
                  <>
                    <div className="item-discount-row">
                      <span className="discount-label">
                        Discount ({Number(item.itm_disc).toFixed(2)}/item)
                      </span>
                      <span className="discount">
                        -{itemDiscount.toFixed(2)}
                      </span>
                    </div>
                    <div className="item-net-row">
                      <span>Net: {item.itm_qty} x {netPrice.toFixed(2)}</span>
                      <span className="item-net-total">
                        {Number(item.itm_amt).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="receipt-divider"></div>

        {/* Totals */}
        <div className="totals-section">
          <div className="total-row">
            <span>Total Items:</span>
            <span>{saleTotal.sal_items}</span>
          </div>
          <div className="total-row">
            <span>Total Qty:</span>
            <span>{saleTotal.sal_qty}</span>
          </div>
          <div className="total-row">
            <span>Subtotal:</span>
            <span>{subtotal.toFixed(2)}</span>
          </div>
          {saleTotal.sal_disc > 0 && (
            <div className="total-row discount-row">
              <span>Total Discount:</span>
              <span className="discount">-{Number(saleTotal.sal_disc).toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="receipt-divider-thick"></div>

        {/* Grand Total */}
        <div className="grand-total">
          <span className="grand-total-label">TOTAL</span>
          <span className="grand-total-amount">
            {Number(saleTotal.sal_amt).toFixed(2)}
          </span>
        </div>

        {saleTotal.sal_disc > 0 && (
          <div className="savings-message">
            🎉 You saved {Number(saleTotal.sal_disc).toFixed(2)} today!
          </div>
        )}

        <div className="receipt-divider"></div>

        {/* Footer */}
        <div className="receipt-footer">
          <p>THANK YOU FOR SHOPPING!</p>
          <p>Visit us again soon</p>
          <div className="barcode">||||||||||||||||||||</div>
        </div>
      </div>

      <button onClick={() => window.print()} className="print-btn">
        🖨️ Print Receipt
      </button>
    </div>
  );
}