"use client";

import React from "react";
import { usePurchaseStore } from "../../../zu_store/purch_store";

export default function TranItemsTable() {
  const {
    items,
    incrementQty,
    decrementQty,
    removeItem,
  } = usePurchaseStore();

  const emptyMessage = "No items added yet";

  return (
    <div className="bg-white rounded-xl border border-gray-300 shadow-sm mb-1 overflow-hidden max-h-96 flex-1">
      <div className="overflow-auto max-h-full">
        <table className="w-full text-sm border-collapse">
          <tbody className="bg-white">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-8 text-center text-gray-400 text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.itm_cd}
                  className="border-b border-gray-200 transition-colors hover:bg-green-50"
                >
                  {/* CODE */}
                  <td className="p-1 w-28 text-gray-700">
                    {item.itm_cd}
                  </td>

                  {/* DESC */}
                  <td className="p-2 text-gray-700 w-92">
                    {item.itm_desc}
                  </td>

                  {/* QTY */}
                  <td className="px-3 py-2 text-center w-24">
                    <div className="inline-flex items-center bg-gray-50 rounded-md overflow-hidden border border-gray-300">
                      <button
                        className="bg-sky-100 px-2 py-1 font-semibold hover:bg-sky-200"
                        // onClick={() => decrementQty(item.itm_cd)}
                        onClick={() => {
                          if (item.itm_qty > 1) {
                            decrementQty(item.itm_cd);
                          }
                        }}
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

                  {/* Pur PRICE */}
                  <td className="px-3 py-2 text-right w-20">
                    {Number(item.itm_prc).toFixed(2)}
                  </td>

                  {/* RSP */}
                  <td className="px-3 py-2 text-right w-32">
                    {Number(item.itm_rsp).toFixed(2)}
                  </td>

                  {/* DISC */}
                  {/* <td className="px-3 py-2 text-right w-24">
                    {item.itm_disc > 0 ? item.itm_disc.toFixed(2) : "-"}
                  </td> */}

                  {/* NET */}
                  <td className="px-3 py-2 text-right w-28">
                    {item.itm_rsp.toFixed(2)}
                  </td>

                  {/* TOTAL */}
                  <td className="px-3 py-2 text-right w-28">
                    {item.itm_tot_amt.toFixed(2)}
                  </td>

                  {/* REMOVE */}
                  <td className="px-1 text-center w-10">
                    <button
                      className="text-xs text-red-600 bg-red-100 rounded px-2 py-1 hover:text-red-900"
                      onClick={() => removeItem(item.itm_cd)}
                    >
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
  );
}
