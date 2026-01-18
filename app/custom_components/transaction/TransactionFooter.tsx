import React from "react";

interface TransactionTotals {
  sal_items: number;
  sal_qty: number;
  sal_disc: number;
  sal_amt: number;
}

interface TransactionFooterProps {
  totals: TransactionTotals;
  returnMode: boolean;
  loading: boolean;
  customerMobile: string;
  onMobileChange: (value: string) => void;
  onSave: () => void;
  disabled?: boolean;
  labels?: {
    items?: string;
    quantity?: string;
    discount?: string;
    netAmount?: string;
    mobile?: string;
    mobilePlaceholder?: string;
    saveButton?: string;
    saveReturnButton?: string;
    loadingText?: string;
  };
}

export default function TransactionFooter({
  totals,
  returnMode,
  loading,
  customerMobile,
  onMobileChange,
  onSave,
  disabled = false,
  labels = {},
}: TransactionFooterProps) {
  const defaultLabels = {
    items: "Items",
    quantity: "Qty",
    discount: "Discount",
    netAmount: "Net Amount",
    mobile: "Mobile",
    mobilePlaceholder: "03XX-XXXXXXX",
    saveButton: "💾 Save",
    saveReturnButton: "💾 Save Return",
    loadingText: "Processing...",
    ...labels,
  };

  return (
    <>
      <div className="bg-linear-to-r from-emerald-700 to-teal-600 text-white rounded-lg shadow-lg shadow-emerald-900/25 px-1 py-1 sticky bottom-0 mt-auto border-none animate-slideUp">
        <div className="grid grid-cols-6 gap-3 items-center">
          <div className="flex flex-col">
            <span className="text-xs font-medium opacity-80 mb-0.5">
              {defaultLabels.items}
            </span>
            <div className="bg-white/95 rounded-md p-1 text-center">
              <span className="text-emerald-700 text-base">{totals.sal_items}</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-medium opacity-80 mb-0.5">
              {defaultLabels.quantity}
            </span>
            <div className="bg-white/95 rounded-md p-1 text-center">
              <span className="text-emerald-700 text-base">{totals.sal_qty}</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-medium opacity-80 mb-0.5">
              {defaultLabels.discount}
            </span>
            <div className="bg-white/95 rounded-md p-1 text-center">
              <span className="text-emerald-700 text-base">
                {totals.sal_disc.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-medium opacity-80 mb-0.5">
              {defaultLabels.netAmount}
            </span>
            <div
              className={`rounded-md p-1 text-center ${
                returnMode
                  ? "bg-red-900 border border-red-600"
                  : "bg-white/95"
              }`}
            >
              <span
                className={`text-base ${
                  returnMode ? "text-red-100" : "text-emerald-700"
                }`}
              >
                {totals.sal_amt.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-medium opacity-80 mb-0.5">
              Mobile:
              {/* {defaultLabels.mobile} */}
            </span>
            <input
              type="tel"
              name="sal_mbl"
              placeholder={defaultLabels.mobilePlaceholder}
              className="w-full p-1 rounded-md border-none bg-white/95 text-emerald-700 text-base text-center focus:outline-none focus:ring-2 focus:ring-white/50"
              value={customerMobile}
              maxLength={15}
              onChange={(e) => onMobileChange(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={onSave}
              disabled={disabled || loading}
              className="bg-emerald-900 mt-4 text-white w-full px-4 py-1.5 text-sm font-bold rounded-md border-none cursor-pointer transition-all shadow-md hover:bg-blue-700 hover:shadow-lg disabled:bg-white/30 disabled:text-white/60 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading
                ? defaultLabels.loadingText
                : returnMode
                ? defaultLabels.saveReturnButton
                : defaultLabels.saveButton}
            </button>
          </div>
        </div>
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
    </>
  );
}