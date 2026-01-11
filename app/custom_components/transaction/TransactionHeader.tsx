// components/TransactionHeader.tsx
import React from "react";
import { FiPackage, FiShoppingCart } from "react-icons/fi"; // import icons

interface TransactionHeaderProps {
  title: string;
  branchCode?: number;
  userName?: string;
  dateString: string;
  transactionType?: "sale" | "purchase";
}

export default function TransactionHeader({
  title,
  branchCode,
  userName,
  dateString,
  transactionType = "sale",
}: TransactionHeaderProps) {
  const isPurchase = transactionType === "purchase";
  
  // Different color schemes for Purchase vs Sale
  const headerColors = isPurchase
    ? "bg-gradient-to-r from-indigo-700 to-purple-600"
    : "bg-gradient-to-r from-teal-700 to-teal-500";
  
  const badgeColors = isPurchase
    ? "bg-purple-600 text-white border-purple-400"
    : "bg-emerald-600 text-white border-emerald-400";
  
  const TypeIcon = isPurchase ? FiPackage : FiShoppingCart; // icon component
  const typeLabel = isPurchase ? "PURCHASE" : "SALE";

  return (
    <header className={`${headerColors} text-white shadow-md`}>
      <div className="max-w-full mx-auto px-4 py-2.5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-white m-0">{title}</h1>
          
          {/* Transaction Type Badge */}
          <span className={`${badgeColors} px-3 py-1 rounded-full text-xs font-bold border-2 backdrop-blur tracking-wide shadow-lg flex items-center gap-1.5`}>
            <TypeIcon className="text-base" />
            {typeLabel}
          </span>
          
          {branchCode && (
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30 backdrop-blur tracking-wide">
              Branch: {branchCode}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {userName && (
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${isPurchase ? 'text-purple-100' : 'text-teal-100'}`}>
                {userName}
              </span>
            </div>
          )}
          <div className={`text-sm font-medium ${isPurchase ? 'text-purple-100' : 'text-teal-100'}`}>
            {dateString}
          </div>
        </div>
      </div>
    </header>
  );
}
