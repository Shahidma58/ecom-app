"use client";

import React from "react";
import { usePurchaseStore } from "../../../zu_store/purch_store";

export default function TranItemsTable() {
  const { items, incrementQty, decrementQty, removeItem, toggleReturnFlag } =
    usePurchaseStore();

  const emptyMessage = "No items added yet";

  return (
    <div className="bg-white rounded-xl border border-gray-300 shadow-sm mb-1 overflow-hidden max-h-96 flex-1">
      <div className="overflow-auto max-h-full">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="p-2 text-left w-32 font-semibold">Product Code</th>
              <th className="p-2 text-left font-semibold">Description</th>
              <th className="p-2 text-left w-26 font-semibold">Pur Price</th>
              <th className="p-2 text-left w-26 font-semibold">Max RSP</th>
              <th className="p-2 text-left w-26 font-semibold">Qty</th>
              <th className="p-2 text-left w-26 font-semibold">Total</th>
              <th className="p-2 text-left w-26 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-8 text-center text-gray-400 text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.itm_cd}
                  className={`border-b border-gray-200 transition-colors hover:bg-green-50 ${
                    item.returnFlag ? "bg-red-100 text-red-700" : ""
                  }`}
                >
                  {/* Product Code */}
                  <td className="p-2 text-gray-700">{item.itm_cd}</td>

                  {/* Description */}
                  <td className="p-2 text-gray-700">{item.itm_desc}</td>

                  {/* Purchase Price */}
                  <td className="p-2 ">{Number(item.itm_prc).toFixed(2)}</td>

                  {/* Max RSP */}
                  <td className="p-2 ">{Number(item.itm_rsp).toFixed(2)}</td>

                  {/* Quantity */}
                  <td className="px-2 py-1 ">
                    <div className="inline-flex items-center bg-gray-50 rounded-md overflow-hidden border border-gray-300">
                      <button
                        className="bg-sky-100 px-2 py-1 font-semibold hover:bg-sky-200"
                        onClick={() =>
                          item.itm_qty > 1 && decrementQty(item.itm_cd)
                        }
                      >
                        –
                      </button>
                      <span className="w-8 text-center bg-white font-semibold text-sm py-1 border-x border-gray-300">
                        {item.itm_qty}
                      </span>
                      <button
                        className="bg-sky-100 px-2 py-1 font-semibold hover:bg-sky-200"
                        onClick={() => incrementQty(item.itm_cd)}
                      >
                        +
                      </button>
                    </div>
                  </td>

                  {/* Total */}
                  <td className="p-2 ">{item.itm_tot_amt.toFixed(2)}</td>

                  {/* Remove */}
                  <td className="px-1 ">
                    <button
                      className="text-xs text-red-600 bg-red-100 rounded px-2 py-1 hover:text-red-900"
                      onClick={() => removeItem(item.itm_cd)}
                    >
                      ✕
                    </button>
                  </td>
                  <td className="px-1 text-center">
                    <button
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        item.returnFlag
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-amber-500 text-white hover:bg-amber-600"
                      }`}
                      onClick={() => toggleReturnFlag(item.itm_cd)}
                    >
                      R
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
