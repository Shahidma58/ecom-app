import React from "react";

interface FormItem {
  itm_cd: number | string;
  itm_desc: string;
  itm_rsp: number;
  itm_qty: number;
  itm_disc: number;
  itm_net_price: number;
  itm_amt: number;
}

interface TransactionItemsTableProps {
  items: FormItem[];
  returnMode: boolean;
  onQuantityChange: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  emptyMessage?: string;
  headers?: {
    code?: string;
    description?: string;
    quantity?: string;
    price?: string;
    discount?: string;
    netPrice?: string;
    total?: string;
    action?: string;
  };
}

export default function TransactionItemsTable({
  items,
  returnMode,
  onQuantityChange,
  onRemoveItem,
  emptyMessage = "No items added yet",
  headers = {},
}: TransactionItemsTableProps) {
  const defaultHeaders = {
    code: "Code",
    description: "Description",
    quantity: "Qty",
    price: "Price",
    discount: "Disc",
    netPrice: "Net Price",
    total: "Total",
    action: "✖",
    ...headers,
  };

  return (
    <div className="bg-white rounded-xl border border-gray-300 shadow-sm mb-1 overflow-hidden max-h-96 flex-1">
      <div className="overflow-auto max-h-full">
        <table className="w-full text-sm border-collapse">
          {/* <thead className="bg-sky-100 sticky top-0">
            <tr>
              <th className="bg-sky-100 px-3 py-2 text-left text-xs font-semibold text-slate-900 border-b border-gray-200 w-24">
                {defaultHeaders.code}
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-900 border-b border-gray-200 w-75">
                {defaultHeaders.description}
              </th>
              <th className="bg-sky-100 px-3 py-2 text-center text-xs font-semibold text-slate-900 border-b border-gray-200 w-24">
                {defaultHeaders.quantity}
              </th>
              <th className="bg-sky-100 px-3 py-2 text-right text-xs font-semibold text-slate-900 border-b border-gray-200 w-24">
                {defaultHeaders.price}
              </th>
              <th className="bg-sky-100 px-3 py-2 text-right text-xs font-semibold text-slate-900 border-b border-gray-200 w-24">
                {defaultHeaders.discount}
              </th>
              <th className="bg-sky-100 px-3 py-2 text-right text-xs font-semibold text-slate-900 border-b border-gray-200 w-28">
                {defaultHeaders.netPrice}
              </th>
              <th className="bg-sky-100 px-3 py-2 text-right text-xs font-semibold text-slate-900 border-b border-gray-200 w-28">
                {defaultHeaders.total}
              </th>
              <th className="bg-sky-100 px-3 py-2 text-center text-xs font-semibold text-slate-900 border-b border-gray-200 w-16">
                {defaultHeaders.action}
              </th>
            </tr>
          </thead> */}
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
              items.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 transition-colors hover:bg-green-50 ${
                    returnMode ? "bg-rose-50 text-red-800 font-semibold" : ""
                  }`}
                >
                  <td className="px-3 py-2 text-gray-700 w-24">{item.itm_cd}</td>
                  <td className="px-3 py-2 text-gray-700">{item.itm_desc}</td>
                  <td className="px-3 py-2 text-center w-28">
                    <div className="inline-flex items-center justify-center bg-gray-50 rounded-md overflow-hidden border border-gray-300">
                      <button
                        className="bg-sky-100 text-sky-700 border-none px-2 py-1 text-sm font-semibold cursor-pointer transition-all hover:bg-sky-200"
                        onClick={() =>
                          onQuantityChange(index, Math.max(1, item.itm_qty - 1))
                        }
                      >
                        –
                      </button>
                      <span className="w-8 text-center bg-white font-semibold text-sm text-gray-900 py-1 border-l border-r border-gray-300">
                        {item.itm_qty}
                      </span>
                      <button
                        className="bg-sky-100 text-sky-700 border-none px-2 py-1 text-sm font-semibold cursor-pointer transition-all hover:bg-sky-200"
                        onClick={() => onQuantityChange(index, item.itm_qty + 1)}
                      >
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
                      onClick={() => onRemoveItem(index)}
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