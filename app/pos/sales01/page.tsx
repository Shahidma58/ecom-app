"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { api, setAccessToken } from "@/app/lib/apiClient";

const gVars = { gUser: "Demo User" };

const calc_dayofyear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

const get_str_date = () => new Date().toISOString().split("T")[0];

export default function Sales01() {
  const router = useRouter();
  const { user, accessToken, isLoading } = useAuth();
  const today = new Date();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [salItems, setSalItems] = useState<FormItem[]>([]);
  const [returnMode, setReturnMode] = useState(false);
  const [customerMobile, setCustomerMobile] = useState<string>("");

  const [salTotals, setSalTotals] = useState<SalTotal>({
    sal_id: 0,
    sal_dt: today,
    sal_amt: 0,
    sal_items: 0,
    sal_qty: 0,
    sal_disc: 0,
    inp_by: gVars.gUser,
    sal_mbl: undefined,
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
    itm_net_price: number;
  }

  interface SalTotal {
    sal_id: number;
    sal_dt: Date;
    sal_qty: number;
    sal_amt: number;
    sal_items: number;
    sal_disc: number;
    inp_by: string;
    sal_mbl?: number;
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
    itm_net_price: 0,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/pos/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
    }
  }, [accessToken]);

  if (!user) {
    return null;
  }

  const fetchProd = async (prd_cd: number) => {
    if (!prd_cd || prd_cd === 0) return;

    try {
      setLoading(true);
      setError(null);

      const resp = await api.get(`/api/pos/get_prod?prd_cd=${prd_cd}`);
      const data = await resp.json();

      if (!resp.ok) throw new Error(data.error || "Failed to fetch Product");

      if (data.success) {
        const itemRsp = Number(data.data.max_rsp);
        const itemQty = Number(form.itm_qty);
        const discountAmt = Number(data.data.discount_amt) || 0;
        const netPrice = itemRsp - discountAmt;
        const itemAmt = netPrice * itemQty;

        setForm({
          ...form,
          itm_desc: data.data.prd_desc,
          itm_rsp: itemRsp,
          itm_disc: discountAmt,
          itm_net_price: netPrice,
          itm_cost: Number(data.data.pur_prc),
          itm_amt: itemAmt,
        });
      }
    } catch (error) {
      console.error("Error fetching Product:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch Product"
      );
      setForm((prev) => ({ 
        ...prev, 
        itm_desc: "",
        itm_disc: 0,
        itm_net_price: 0,
      }));
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
        const newAmt = newQty * Number(existing.itm_net_price);
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
        (sum, item) => sum + (Number(item.itm_disc) * Number(item.itm_qty)),
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
        sal_mbl: customerMobile ? Number(customerMobile) : undefined,
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
        itm_net_price: 0,
      });

      return updatedItems;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

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

    setForm((prev) => {
      const newForm = { ...prev, [name]: processedValue };
      
      if (name === "itm_qty") {
        const netPrice = Number(prev.itm_net_price || 0);
        newForm.itm_amt = netPrice * Number(processedValue || 0);
      } else if (name === "itm_rsp") {
        const netPrice = Number(processedValue || 0) - Number(prev.itm_disc || 0);
        newForm.itm_net_price = netPrice;
        newForm.itm_amt = netPrice * Number(prev.itm_qty || 0);
      }
      
      return newForm;
    });
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
        (sum, item) => sum + (Number(item.itm_disc) * Number(item.itm_qty)),
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
        sal_mbl: customerMobile ? Number(customerMobile) : undefined,
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

      const apiResponse = await api.post("/api/pos/save_tran", tranPayload);
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
      (sum, item) => sum + (Number(item.itm_disc) * Number(item.itm_qty)),
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
      sal_mbl: customerMobile ? Number(customerMobile) : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col text-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-700 to-teal-500 text-white shadow-md">
        <div className="max-w-full mx-auto px-4 py-2.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-white m-0">
              HerbaGlam - Cosmetics Universe
            </h1>
            {user?.branch_code && (
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30 backdrop-blur tracking-wide">
                Branch: {user.branch_code}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-teal-100 font-medium">{user?.name}</span>
            </div>
            <div className="text-sm text-teal-100 font-medium">{wStr_Dt}</div>
          </div>
        </div>
      </header>



      <div className="max-w-full mt-2 mx-auto px-4 pb-3 flex-1 flex flex-col">
        {/* Product Input */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-3 mb-3">
          <div className="flex items-end gap-2">
            <div className="flex-none w-24">
              <label className="text-xs font-medium text-gray-600 mb-1 block">Code</label>
              <input
                type="text"
                name="itm_cd"
                placeholder="Code"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-white transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                value={form.itm_cd || ""}
                onChange={handleInputChange}
                onBlur={() => fetchProd(Number(form.itm_cd))}
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
              />
            </div>
            <div className="flex-1 min-w-0">
              <label className="text-xs font-medium text-gray-600 mb-1 block">Description</label>
              <input
                type="text"
                placeholder="Product Description"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-500 transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                value={form.itm_desc}
                readOnly
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
              />
            </div>
            <div className="flex-none w-28">
              <label className="text-xs font-medium text-gray-600 mb-1 block">Qty</label>
              <input
                name="itm_qty"
                type="number"
                placeholder="Qty"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-white transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                value={form.itm_qty}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
              />
            </div>
            <div className="flex-none w-24">
              <label className="text-xs font-medium text-gray-600 mb-1 block">Price</label>
              <input
                name="itm_rsp"
                type="number"
                placeholder="Price"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-white transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                value={form.itm_rsp}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
              />
            </div>
            <div className="flex-none w-24">
              <label className="text-xs font-medium text-gray-600 mb-1 block">Disc</label>
              <input
                name="itm_disc"
                type="number"
                placeholder="Disc"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-500 transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                value={form.itm_disc}
                readOnly
              />
            </div>
            <div className="flex-none w-28">
              <label className="text-xs font-medium text-gray-600 mb-1 block">Net Price</label>
              <input
                name="itm_net_price"
                type="number"
                placeholder="Net"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-500 transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                value={form.itm_net_price}
                readOnly
              />
            </div>
            <div className="flex-none w-28">
              <label className="text-xs font-medium text-gray-600 mb-1 block">Total</label>
              <input
                name="itm_amt"
                type="number"
                placeholder="Total"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-500 transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                value={form.itm_amt}
                readOnly
              />
            </div>
            <div className="flex-none w-16">
              <label className="text-xs font-medium text-gray-600 mb-1 block opacity-0">Action</label>
              <button
                className={`w-full px-2 py-1.5 text-sm font-semibold rounded-md border-none cursor-pointer transition-all ${
                  returnMode
                    ? "bg-red-600 text-white shadow-md shadow-red-600/40"
                    : "bg-amber-500 text-white hover:bg-amber-600"
                }`}
                onClick={() => setReturnMode(!returnMode)}
                type="button">
                Return
              </button>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-xl border border-gray-300 shadow-sm mb-3 overflow-hidden max-h-96 flex-1">
          <div className="overflow-auto max-h-full">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-sky-100 sticky top-0">
                <tr>
                  <th className="bg-sky-100 px-3 py-2 text-left text-xs font-semibold text-slate-900 border-b border-gray-200 w-24">
                    Code
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-900 border-b border-gray-200 w-96">
  Description
</th>

                  <th className="bg-sky-100 px-3 py-2 text-center text-xs font-semibold text-slate-900 border-b border-gray-200 w-28">
                    Qty
                  </th>
                  <th className="bg-sky-100 px-3 py-2 text-right text-xs font-semibold text-slate-900 border-b border-gray-200 w-24">
                    Price
                  </th>
                  <th className="bg-sky-100 px-3 py-2 text-right text-xs font-semibold text-slate-900 border-b border-gray-200 w-24">
                    Disc
                  </th>
                  <th className="bg-sky-100 px-3 py-2 text-right text-xs font-semibold text-slate-900 border-b border-gray-200 w-28">
                    Net Price
                  </th>
                  <th className="bg-sky-100 px-3 py-2 text-right text-xs font-semibold text-slate-900 border-b border-gray-200 w-28">
                    Total
                  </th>
                  <th className="bg-sky-100 px-3 py-2 text-center text-xs font-semibold text-slate-900 border-b border-gray-200 w-16">
                    ✖
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {salItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-3 py-8 text-center text-gray-400 text-sm">
                      No items added yet
                    </td>
                  </tr>
                ) : (
                  salItems.map((item, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-200 transition-colors hover:bg-green-50 ${
                        returnMode ? "bg-rose-50 text-red-800 font-semibold" : ""
                      }`}>
                      <td className="px-3 py-2 text-gray-700 w-24">{item.itm_cd}</td>
                      <td className="px-3 py-2 text-gray-700">{item.itm_desc}</td>
                      <td className="px-3 py-2 text-center w-28">
                        <div className="inline-flex items-center justify-center bg-gray-50 rounded-md overflow-hidden border border-gray-300">
                          <button
                            className="bg-sky-100 text-sky-700 border-none px-2 py-1 text-sm font-semibold cursor-pointer transition-all hover:bg-sky-200"
                            onClick={() => {
                              setSalItems((prev) => {
                                const updated = [...prev];
                                const newQty = Math.max(
                                  1,
                                  updated[index].itm_qty - 1
                                );
                                updated[index].itm_qty = newQty;
                                updated[index].itm_amt =
                                  newQty * Number(updated[index].itm_net_price);
                                updateTotals(updated);
                                return updated;
                              });
                            }}>
                            –
                          </button>
                          <span className="w-8 text-center bg-white font-semibold text-sm text-gray-900 py-1 border-l border-r border-gray-300">
                            {item.itm_qty}
                          </span>
                          <button
                            className="bg-sky-100 text-sky-700 border-none px-2 py-1 text-sm font-semibold cursor-pointer transition-all hover:bg-sky-200"
                            onClick={() => {
                              setSalItems((prev) => {
                                const updated = [...prev];
                                const newQty = updated[index].itm_qty + 1;
                                updated[index].itm_qty = newQty;
                                updated[index].itm_amt =
                                  newQty * Number(updated[index].itm_net_price);
                                updateTotals(updated);
                                return updated;
                              });
                            }}>
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right text-gray-700 w-24">
                        {item.itm_rsp.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-700 w-24">
                        {item.itm_disc > 0 ? item.itm_disc.toFixed(2) : "-"}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-700 w-28">
                        {item.itm_net_price.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-700 w-28">
                        {item.itm_amt.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-center w-16">
                        <button
                          className="border-none cursor-pointer transition-colors text-xs text-red-600 bg-red-100 rounded px-2 py-1 hover:text-red-900"
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
        </div>

        {/* Totals Section */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white rounded-lg shadow-lg shadow-emerald-900/25 px-4 py-2 sticky bottom-0 mt-auto border-none animate-slideUp">
          <div className="grid grid-cols-6 gap-3 items-center">
            <div className="flex flex-col">
              <span className="text-xs font-medium opacity-80 mb-0.5">Items</span>
              <div className="bg-white/95 rounded-md p-1 text-center">
                <span className="text-emerald-700 text-base">{salTotals.sal_items}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium opacity-80 mb-0.5">Qty</span>
              <div className="bg-white/95 rounded-md p-1 text-center">
                <span className="text-emerald-700  text-base">{salTotals.sal_qty}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium opacity-80 mb-0.5">Discount</span>
              <div className="bg-white/95 rounded-md p-1 text-center">
                <span className="text-emerald-700  text-base">{salTotals.sal_disc.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium opacity-80 mb-0.5">Net Amount</span>
              <div className={`rounded-md p-1 text-center ${
                returnMode
                  ? "bg-red-900 border border-red-600"
                  : "bg-white/95"
              }`}>
                <span className={`text-base ${
                  returnMode ? "text-red-100" : "text-emerald-700"
                }`}>{salTotals.sal_amt.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium opacity-80 mb-0.5">Mobile</span>
              <input
                type="tel"
                name="sal_mbl"
                placeholder="03XX-XXXXXXX"
                className="w-full p-1 rounded-md border-none bg-white/95  text-emerald-700 text-base text-center focus:outline-none focus:ring-2 focus:ring-white/50"
                value={customerMobile}
                maxLength={15}
                onChange={(e) =>
                  setCustomerMobile(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>
            <div className="flex flex-col justify-end">
              <button
                onClick={handleSaveTran}
                disabled={loading || salItems.length === 0}
                className="bg-emerald-900 mt-4 text-white w-full px-4 py-1.5 text-sm font-bold rounded-md border-none cursor-pointer transition-all shadow-md hover:bg-blue-700 hover:shadow-lg disabled:bg-white/30 disabled:text-white/60 disabled:cursor-not-allowed disabled:shadow-none">
                {loading
                  ? "Processing..."
                  : returnMode
                  ? "💾 Save Return"
                  : "💾 Save"}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}