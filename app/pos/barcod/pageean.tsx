"use client";

import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import JsBarcode from "jsbarcode";

export default function BarcodePrinterPage() {
  const [formData, setFormData] = useState({
    barcode: "",
    count: "1",
    productName: "",
    price: "",
  });

  const [barcodes, setBarcodes] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const barcodeRefs = useRef<(SVGSVGElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEAN13 = (code: string): boolean => {
    // EAN13 must be exactly 13 digits
    if (!/^\d{12,13}$/.test(code)) {
      return false;
    }

    // If 12 digits, JsBarcode will auto-generate check digit
    if (code.length === 12) {
      return true;
    }

    // If 13 digits, validate check digit
    const digits = code.split("").map(Number);
    const checkDigit = digits.pop()!;
    
    let sum = 0;
    digits.forEach((digit, index) => {
      sum += digit * (index % 2 === 0 ? 1 : 3);
    });
    
    const calculatedCheck = (10 - (sum % 10)) % 10;
    return checkDigit === calculatedCheck;
  };

  const generateBarcodes = () => {
    if (!formData.barcode.trim()) {
      setMessage("Please enter a barcode");
      return;
    }

    if (!validateEAN13(formData.barcode)) {
      setMessage("Invalid EAN13 barcode. Must be 12 or 13 digits.");
      return;
    }

    const count = parseInt(formData.count);
    if (count < 1 || count > 100) {
      setMessage("Count must be between 1 and 100");
      return;
    }

    // Generate array of barcodes
    const newBarcodes = Array(count).fill(formData.barcode);
    setBarcodes(newBarcodes);
    setMessage(`Generated ${count} barcode sticker(s) ✔`);
    setTimeout(() => setMessage(""), 2000);
  };

  useEffect(() => {
    if (barcodes.length > 0) {
      barcodes.forEach((barcode, index) => {
        const svg = barcodeRefs.current[index];
        if (svg) {
          try {
            JsBarcode(svg, barcode, {
              format: "EAN13",
              width: 2,
              height: 60,
              displayValue: true,
              fontSize: 14,
              margin: 5,
            });
          } catch (error) {
            console.error("Error generating barcode:", error);
          }
        }
      });
    }
  }, [barcodes]);

  const handlePrint = () => {
    if (barcodes.length === 0) {
      setMessage("Please generate barcodes first");
      return;
    }
    window.print();
  };

  const handleClear = () => {
    setFormData({
      barcode: "",
      count: "1",
      productName: "",
      price: "",
    });
    setBarcodes([]);
    setMessage("");
  };

  return (
    <>
      <Head>
        <title>Barcode Sticker Printer</title>
      </Head>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .barcode-sticker {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>

      <div className="no-print border-2 min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-4 px-2">
        <div className="max-w-4xl mx-auto">
          <header className="mb-1 rounded-lg shadow-md p-2 text-center bg-linear-to-r from-green-600 via-emerald-600 to-teal-600">
            <h1 className="text-2xl font-bold text-white tracking-wide">
              🏷️ Barcode Sticker Printer
            </h1>
          </header>

          <main className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); generateBarcodes(); }}>
              {/* Barcode Input */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>
                  Barcode (EAN13):<span className="text-red-500">*</span>
                </div>
                <div>
                  <input
                    type="text"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleChange}
                    placeholder="Enter 12 or 13 digit barcode"
                    className="w-80 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
                    maxLength={13}
                    required
                  />
                </div>
              </div>

              {/* Product Name (Optional) */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>Product Name:</div>
                <div>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="Optional product name"
                    className="w-80 border border-black rounded px-3 py-2 text-sm"
                    maxLength={50}
                  />
                </div>
              </div>

              {/* Price (Optional) */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>Price:</div>
                <div>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Optional price"
                    className="w-40 border border-black rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Count */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>
                  Sticker Count:<span className="text-red-500">*</span>
                </div>
                <div>
                  <input
                    type="number"
                    name="count"
                    value={formData.count}
                    onChange={handleChange}
                    min="1"
                    max="100"
                    className="w-32 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    (Max 100)
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-center pt-2 border-t border-gray-300 mt-2">
                <button
                  type="submit"
                  className="w-50 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition-all"
                >
                  🎯 Generate
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-50 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition-all"
                >
                  🖨️ Print
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="w-50 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition-all"
                >
                  🧹 Clear
                </button>
              </div>
            </form>

            {/* Message */}
            {message && (
              <div className={`mt-3 text-center text-sm font-semibold animate-pulse ${
                message.includes("✔") ? "text-emerald-700" : "text-red-600"
              }`}>
                {message}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Print Area - Barcode Stickers */}
      {barcodes.length > 0 && (
        <div className="print-area mt-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 p-4">
            {barcodes.map((barcode, index) => (
              <div
                key={index}
                className="barcode-sticker border-2 border-dashed border-gray-400 p-3 rounded-lg bg-white flex flex-col items-center justify-center"
                style={{ width: "250px", height: "150px" }}
              >
                {formData.productName && (
                  <div className="text-xs font-semibold text-center mb-1 truncate w-full">
                    {formData.productName}
                  </div>
                )}
                
                <svg
                  ref={(el) => {
                    barcodeRefs.current[index] = el;
                  }}
                  className="barcode-svg"
                />
                
                {formData.price && (
                  <div className="text-sm font-bold text-center mt-1">
                    Rs. {formData.price}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}