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

interface TransactionInputFormProps {
  form: FormItem;
  returnMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCodeBlur: () => void;
  onEnterPress: () => void;
  onReturnToggle: () => void;
  labels?: {
    code?: string;
    description?: string;
    quantity?: string;
    price?: string;
    discount?: string;
    netPrice?: string;
    total?: string;
    returnButton?: string;
  };
}

export default function TransactionInputForm({
  form,
  returnMode,
  onInputChange,
  onCodeBlur,
  onEnterPress,
  onReturnToggle,
  labels = {},
}: TransactionInputFormProps) {
  const defaultLabels = {
    code: "Code",
    description: "Product Description",
    quantity: "Qty",
    price: "Price",
    discount: "Disc",
    netPrice: "Net Price",
    total: "Total",
    ...labels,
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onEnterPress();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-3 mb-3">
      <div className="flex items-end gap-2">
        <div className="flex-none w-24">
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            {defaultLabels.code}
          </label>
          <input
            type="text"
            name="itm_cd"
            placeholder={defaultLabels.code}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-white transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
            value={form.itm_cd || ""}
            onChange={onInputChange}
            onBlur={onCodeBlur}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="flex-1 min-w-0">
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            {defaultLabels.description}
          </label>
          <input
            type="text"
            placeholder={defaultLabels.description}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-500 transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
            value={form.itm_desc}
            readOnly
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="flex-none w-28">
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            {defaultLabels.quantity}
          </label>
          <input
            name="itm_qty"
            type="number"
            placeholder={defaultLabels.quantity}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-white transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
            value={form.itm_qty}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="flex-none w-24">
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            {defaultLabels.price}
          </label>
          <input
            name="itm_rsp"
            type="number"
            placeholder={defaultLabels.price}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-white transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
            value={form.itm_rsp}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="flex-none w-24">
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            {defaultLabels.discount}
          </label>
          <input
            name="itm_disc"
            type="number"
            placeholder={defaultLabels.discount}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-500 transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
            value={form.itm_disc}
            readOnly
          />
        </div>

        <div className="flex-none w-28">
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            {defaultLabels.netPrice}
          </label>
          <input
            name="itm_net_price"
            type="number"
            placeholder={defaultLabels.netPrice}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-500 transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
            value={form.itm_net_price}
            readOnly
          />
        </div>

        <div className="flex-none w-28">
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            {defaultLabels.total}
          </label>
          <input
            name="itm_amt"
            type="number"
            placeholder={defaultLabels.total}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-500 transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
            value={form.itm_amt}
            readOnly
          />
        </div>

        {labels.returnButton && (
          <div className="flex-none w-16">
          <label className="text-xs font-medium text-gray-600 mb-1 block opacity-0">
            Action
          </label>
          <button
            className={`w-full px-2 py-1.5 text-sm font-semibold rounded-md border-none cursor-pointer transition-all ${
              returnMode
                ? "bg-red-600 text-white shadow-md shadow-red-600/40"
                : "bg-amber-500 text-white hover:bg-amber-600"
            }`}
            onClick={onReturnToggle}
            type="button"
          >
            {defaultLabels.returnButton}
          </button>
        </div>)}
      </div>
    </div>
  );
}