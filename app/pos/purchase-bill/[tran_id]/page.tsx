// app/pos/purchase-bill/[tran_id]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/app/lib/apiClient";

interface PurchaseDetail {
  pur_id: string;
  pur_id_serl: number;
  prd_cd: string;
  prd_desc: string;
  pur_qty: string;
  pur_prc: string;
  new_rsp: string;
  cur_rsp: string;
  itm_tot_amt: string;
  tax_amt: string;
}

interface PurchaseHeader {
  pur_id: string;
  brn_cd: number;
  vnd_id: string;
  tot_itms: number;
  tot_qty: number;
  tot_amt: string;
  amt_paid: string;
  amt_cr: string;
  inp_by: string;
  inp_dt: string;
  pur_dt: string;
}

interface VendorData {
  ac_no: string;
  ac_title: string;
  ac_contact: string;
  ac_addr: string;
  generalLedger?: {
    gl_desc: string;
  };
}

export default function PurchaseBillPage() {
  const router = useRouter();
  const params = useParams();
  const tran_id = params.tran_id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchaseHeader, setPurchaseHeader] = useState<PurchaseHeader | null>(null);
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetail[]>([]);
  const [vendor, setVendor] = useState<VendorData | null>(null);

  useEffect(() => {
    if (tran_id) {
      fetchPurchaseBill();
    }
  }, [tran_id]);

  const fetchPurchaseBill = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch purchase details
      const purchaseResp = await api.get(`/api/pos/get_purchase?pur_id=${tran_id}`);
      const purchaseData = await purchaseResp.json();

      if (!purchaseResp.ok || !purchaseData.success) {
        throw new Error(purchaseData.message || "Failed to fetch purchase");
      }

      setPurchaseHeader(purchaseData.data.header);
      setPurchaseDetails(purchaseData.data.items);
      
      // Vendor is already included in the response
      if (purchaseData.data.vendor) {
        setVendor(purchaseData.data.vendor);
      }
    } catch (err) {
      console.error("Error fetching purchase bill:", err);
      setError(err instanceof Error ? err.message : "Failed to load purchase bill");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewPurchase = () => {
    router.push("/pos/purch01");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading purchase bill...</p>
        </div>
      </div>
    );
  }

  if (error || !purchaseHeader) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Bill</h2>
            <p className="text-gray-600 mb-6">{error || "Purchase not found"}</p>
            <button
              onClick={handleNewPurchase}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to Purchase
            </button>
          </div>
        </div>
      </div>
    );
  }

  const creditAmount = parseFloat(purchaseHeader.amt_cr || "0");
  const paidAmount = parseFloat(purchaseHeader.amt_paid || "0");
  const totalAmount = parseFloat(purchaseHeader.tot_amt || "0");

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:py-0">
      <div className="max-w-4xl mx-auto px-4">
        {/* Action Buttons - Hidden on print */}
        <div className="mb-6 flex gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-md flex items-center gap-2"
          >
            <span>🖨️</span> Print Bill
          </button>
          <button
            onClick={handleNewPurchase}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-md flex items-center gap-2"
          >
            <span>📦</span> New Purchase
          </button>
        </div>

        {/* Bill Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-700 to-purple-600 text-white px-8 py-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">PURCHASE ORDER</h1>
                <p className="text-indigo-100 text-sm">HerbaGlam - Cosmetics Universe</p>
              </div>
              <div className="text-right">
                <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur">
                  <p className="text-xs text-indigo-100 mb-1">Purchase ID</p>
                  <p className="text-xl font-bold">{purchaseHeader.pur_id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bill Info Section */}
          <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-2 gap-8">
              {/* Vendor Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Vendor Details</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="font-bold text-lg text-gray-800 mb-2">
                    {vendor?.ac_title || "Unknown Vendor"}
                  </p>
                  {vendor?.ac_contact && (
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold">Contact:</span> {vendor.ac_contact}
                    </p>
                  )}
                  {vendor?.ac_addr && (
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold">Address:</span> {vendor.ac_addr}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Account #:</span> {purchaseHeader.vnd_id}
                  </p>
                </div>
              </div>

              {/* Purchase Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Purchase Info</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Purchase Date:</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {new Date(purchaseHeader.pur_dt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Branch:</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {purchaseHeader.brn_cd}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Created By:</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {purchaseHeader.inp_by}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Date Created:</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {new Date(purchaseHeader.inp_dt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="px-8 py-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Purchase Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-indigo-50 border-b-2 border-indigo-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Code</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Qty</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Cost Price</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">New RSP</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {purchaseDetails.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">{item.pur_id_serl}</td>
                      <td className="px-4 py-3 text-gray-800 font-medium">{item.prd_cd}</td>
                      <td className="px-4 py-3 text-gray-800">{item.prd_desc}</td>
                      <td className="px-4 py-3 text-right text-gray-800 font-semibold">
                        {parseFloat(item.pur_qty).toFixed(0)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-800">
                        {parseFloat(item.pur_prc).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-800">
                        {parseFloat(item.new_rsp).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-800 font-semibold">
                        {parseFloat(item.itm_tot_amt).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Section */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="max-w-md ml-auto space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">Total Items:</span>
                <span className="text-gray-800 font-semibold text-lg">
                  {purchaseHeader.tot_itms}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">Total Quantity:</span>
                <span className="text-gray-800 font-semibold text-lg">
                  {purchaseHeader.tot_qty}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-300">
                <span className="text-gray-700 font-semibold text-lg">Total Amount:</span>
                <span className="text-gray-900 font-bold text-xl">
                  Rs. {totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 bg-green-50 px-4 rounded-lg">
                <span className="text-green-700 font-semibold">Amount Paid:</span>
                <span className="text-green-700 font-bold text-lg">
                  Rs. {paidAmount.toFixed(2)}
                </span>
              </div>
              {creditAmount > 0 && (
                <div className="flex justify-between items-center py-2 bg-amber-50 px-4 rounded-lg">
                  <span className="text-amber-700 font-semibold">Credit Amount:</span>
                  <span className="text-amber-700 font-bold text-lg">
                    Rs. {creditAmount.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-100 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Thank you for your business! This is a computer-generated document.
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:py-0 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}