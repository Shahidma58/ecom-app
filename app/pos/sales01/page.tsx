"use client";
import React, { useState } from "react";
import "./sales01.css";
import { useRouter } from "next/navigation";

const gVars = { gUser: "Demo User" };

const calc_dayofyear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

const get_str_date = () => new Date().toISOString().split("T")[0];

export default function Sales01() {
  const router = useRouter();
  const today = new Date();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [salItems, setSalItems] = useState<FormItem[]>([]);
  const [returnMode, setReturnMode] = useState(false);
  const [salTotals, setSalTotals] = useState<SalTotal>({
    sal_id: 0,
    sal_dt: today,
    sal_amt: 0,
    sal_items: 0,
    sal_qty: 0,
    sal_disc: 0,
    inp_by: gVars.gUser,
  });

  const wTrn_Dt = calc_dayofyear();
  const wStr_Dt = get_str_date();

  interface FormItem {
    sal_id: number;
    itm_cd: number;
    itm_desc: string;
    itm_rsp: number;
    itm_qty: number;
    itm_disc: number;
    itm_tax: number;
    itm_cost: number;
    itm_amt: number;
    itm_stat: string;
  }

  interface SalTotal {
    sal_id: number;
    sal_dt: Date;
    sal_qty: number;
    sal_amt: number;
    sal_items: number;
    sal_disc: number;
    inp_by: string;
  }

  const [form, setForm] = useState<FormItem>({
    sal_id: 0,
    itm_cd: 0,
    itm_desc: "",
    itm_rsp: 0,
    itm_qty: 1,
    itm_disc: 0,
    itm_tax: 0,
    itm_cost: 0,
    itm_amt: 0,
    itm_stat: "A",
  });

  const fetchProd = async (prd_cd: number) => {
    if (!prd_cd || prd_cd === 0) return;

    try {
      setLoading(true);
      setError(null);

      const resp = await fetch(`/api/pos/get_prod?prd_cd=${prd_cd}`);
      const data = await resp.json();

      if (!resp.ok) throw new Error(data.error || "Failed to fetch Product");

      if (data.success) {
        const itemRsp = Number(data.data.max_rsp);
        const itemQty = Number(form.itm_qty);
        const itemAmt = itemRsp * itemQty;

        setForm({
          ...form,
          itm_desc: data.data.prd_desc,
          itm_rsp: itemRsp,
          itm_cost: Number(data.data.pur_prc),
          itm_amt: itemAmt,
        });
      }
    } catch (error) {
      console.error("Error fetching Product:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch Product"
      );
      setForm((prev) => ({ ...prev, itm_desc: "" }));
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (!form.itm_cd || !form.itm_desc) {
      setError("Please fetch a valid product before adding.");
      return;
    }

    setSalItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.itm_cd === form.itm_cd
      );
      let updatedItems;

      if (existingIndex >= 0) {
        updatedItems = [...prevItems];
        const existing = updatedItems[existingIndex];
        const newQty = Number(existing.itm_qty) + Number(form.itm_qty);
        const newAmt = newQty * Number(existing.itm_rsp);
        updatedItems[existingIndex] = {
          ...existing,
          itm_qty: newQty,
          itm_amt: newAmt,
        };
      } else {
        updatedItems = [...prevItems, { ...form }];
      }

      const totalQty = updatedItems.reduce(
        (sum, item) => sum + Number(item.itm_qty),
        0
      );
      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + Number(item.itm_amt),
        0
      );
      const totalDisc = updatedItems.reduce(
        (sum, item) => sum + Number(item.itm_disc),
        0
      );
      const totalItems = updatedItems.length;

      setSalTotals({
        sal_id: 0,
        sal_dt: today,
        sal_qty: totalQty,
        sal_amt: totalAmount,
        sal_items: totalItems,
        sal_disc: totalDisc,
        inp_by: gVars.gUser,
      });

      setForm({
        sal_id: 0,
        itm_cd: 0,
        itm_desc: "",
        itm_rsp: 0,
        itm_qty: 1,
        itm_disc: 0,
        itm_tax: 0,
        itm_cost: 0,
        itm_amt: 0,
        itm_stat: "A",
      });

      return updatedItems;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Convert to number for numeric fields
    const numericFields = [
      "itm_cd",
      "itm_qty",
      "itm_rsp",
      "itm_disc",
      "itm_amt",
    ];
    const processedValue = numericFields.includes(name)
      ? Number(value) || 0
      : value;

    setForm((prev) => ({
      ...prev,
      [name]: processedValue,
      ...(name === "itm_qty" || name === "itm_rsp"
        ? { itm_amt: Number(prev.itm_rsp || 0) * Number(processedValue || 0) }
        : {}),
    }));
  };

  const handleRemoveItem = (index: number) => {
    setSalItems((prevItems) => {
      const updatedItems = prevItems.filter((_, i) => i !== index);

      const totalQty = updatedItems.reduce(
        (sum, item) => sum + Number(item.itm_qty),
        0
      );
      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + Number(item.itm_amt),
        0
      );
      const totalDisc = updatedItems.reduce(
        (sum, item) => sum + Number(item.itm_disc),
        0
      );
      const totalItems = updatedItems.length;

      setSalTotals({
        sal_id: 0,
        sal_dt: today,
        sal_qty: totalQty,
        sal_amt: totalAmount,
        sal_items: totalItems,
        sal_disc: totalDisc,
        inp_by: gVars.gUser,
      });

      return updatedItems;
    });
  };

  const handleSaveTran = async () => {
    try {
      setLoading(true);
      setError(null);

      const tranPayload = {
        salTots: salTotals,
        salItms: salItems,
        tran_dt: wTrn_Dt,
        isReturn: returnMode,
      };

      const apiResponse = await fetch("/api/pos/save_tran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tranPayload),
      });

      const data = await apiResponse.json();

      if (!apiResponse.ok || !data.success)
        throw new Error(data.message || "Failed to save transaction");

      router.push(`/pos/bill/${data.tran_id}`);
    } catch (error) {
      console.error("Error Updating Transaction:", error);
      setError(
        error instanceof Error ? error.message : "Failed to Update Transaction"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateTotals = (updatedItems: FormItem[]) => {
    const totalQty = updatedItems.reduce(
      (sum, item) => sum + Number(item.itm_qty),
      0
    );
    const totalAmount = updatedItems.reduce(
      (sum, item) => sum + Number(item.itm_amt),
      0
    );
    const totalDisc = updatedItems.reduce(
      (sum, item) => sum + Number(item.itm_disc),
      0
    );
    const totalItems = updatedItems.length;

    setSalTotals({
      sal_id: 0,
      sal_dt: today,
      sal_qty: totalQty,
      sal_amt: totalAmount,
      sal_items: totalItems,
      sal_disc: totalDisc,
      inp_by: gVars.gUser,
    });
  };

  return (
    <div className="sales-container">
      <header className="sales-header">
        <div className="sales-header-content">
          <h1 className="sales-title">HerbaGlam - Cosmetics Universe</h1>
          <div className="sales-date">{wStr_Dt}</div>
        </div>
      </header>

      <div className="sales-content">
        {/* Product Input */}
        <div className="sales-form-card">
          <div className="sales-form-grid">
            <div className="sales-form-col-2">
              <input
                type="text"
                name="itm_cd"
                placeholder="Product Code"
                className="sales-input"
                value={form.itm_cd || ""}
                onChange={handleInputChange}
                onBlur={() => fetchProd(Number(form.itm_cd))}
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
              />
            </div>
            <div className="sales-form-col-4">
              <input
                type="text"
                placeholder="Product Description"
                className="sales-input sales-input-readonly"
                value={form.itm_desc}
                readOnly
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
              />
            </div>
            <div className="sales-form-col-1">
              <input
                name="itm_qty"
                type="number"
                placeholder="Qty"
                className="sales-input"
                value={form.itm_qty}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
              />
            </div>
            <div className="sales-form-col-1">
              <input
                name="itm_rsp"
                type="number"
                placeholder="Price"
                className="sales-input"
                value={form.itm_rsp}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
              />
            </div>
            <div className="sales-form-col-1">
              <input
                name="itm_disc"
                type="number"
                placeholder="Disc"
                className="sales-input"
                value={form.itm_disc}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
              />
            </div>
            <div className="sales-form-col-2">
              <input
                name="itm_amt"
                type="number"
                placeholder="Total"
                className="sales-input sales-input-readonly"
                value={form.itm_amt}
                readOnly
              />
            </div>
            <div className="sales-form-col-1">
              <button
                className={`sales-btn-return ${returnMode ? "active" : ""}`}
                onClick={() => setReturnMode(!returnMode)}
                type="button">
                Return
              </button>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="sales-table-card">
          <table className="sales-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
                <th className="text-right">Qty</th>
                <th className="text-right">Price</th>
                <th className="text-right">Disc</th>
                <th className="text-right">Total</th>
                <th className="text-center">✖</th>
              </tr>
            </thead>
            <tbody>
              {salItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="sales-table-empty">
                    No items added yet
                  </td>
                </tr>
              ) : (
                salItems.map((item, index) => (
                  <tr key={index} className={returnMode ? "row-return" : ""}>
                    <td>{item.itm_cd}</td>
                    <td>{item.itm_desc}</td>
                    <td className="text-right">
                      <div className="qty-control">
                        <button
                          className="qty-btn"
                          onClick={() => {
                            setSalItems((prev) => {
                              const updated = [...prev];
                              const newQty = Math.max(
                                1,
                                updated[index].itm_qty - 1
                              );
                              updated[index].itm_qty = newQty;
                              updated[index].itm_amt =
                                newQty * Number(updated[index].itm_rsp);
                              updateTotals(updated);
                              return updated;
                            });
                          }}>
                          –
                        </button>
                        <span className="qty-value">{item.itm_qty}</span>
                        <button
                          className="qty-btn"
                          onClick={() => {
                            setSalItems((prev) => {
                              const updated = [...prev];
                              const newQty = updated[index].itm_qty + 1;
                              updated[index].itm_qty = newQty;
                              updated[index].itm_amt =
                                newQty * Number(updated[index].itm_rsp);
                              updateTotals(updated);
                              return updated;
                            });
                          }}>
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-right">{item.itm_rsp.toFixed(2)}</td>
                    <td className="text-right">{item.itm_disc}</td>
                    <td className="text-right">{item.itm_amt.toFixed(2)}</td>
                    <td className="text-center">
                      <button
                        className="sales-btn-delete"
                        onClick={() => handleRemoveItem(index)}>
                        ✕
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="sales-totals-card">
          <div className="sales-totals-grid">
            <div>
              <label>Total Items</label>
              <input type="text" readOnly value={salTotals.sal_items} />
            </div>
            <div>
              <label>Total Qty</label>
              <input type="text" readOnly value={salTotals.sal_qty} />
            </div>
            <div>
              <label>Gross Amt</label>
              <input
                type="text"
                readOnly
                value={salTotals.sal_amt}
                className={returnMode ? "negative-total" : ""}
              />
            </div>
            <div>
              <label>Discount</label>
              <input type="text" readOnly value={salTotals.sal_disc} />
            </div>
            <div>
              <button
                onClick={handleSaveTran}
                disabled={loading || salItems.length === 0}
                className="sales-btn-save">
                {loading
                  ? "Processing..."
                  : returnMode
                  ? "💾 Save Return"
                  : "💾 Save"}
              </button>
            </div>
          </div>
        </div>

        {error && <div className="sales-error">{error}</div>}
      </div>
    </div>
  );
}
