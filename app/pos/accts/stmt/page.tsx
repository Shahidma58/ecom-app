"use client";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import * as XLSX from "xlsx";

export default function StmtPage() {
  const [acNo, setAcNo] = useState("");
  const [acTitle, setAcTitle] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearch = async () => {
    try {
      let url = "/api/pos/accts/stmt";
      const params = new URLSearchParams();

      if (acNo.trim()) params.append("ac_no", acNo.trim());
      if (fromDate) params.append("from_date", fromDate);
      if (toDate) params.append("to_date", toDate);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setTransactions(data.data); // or whatever state holds your table rows
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching statement:", error);
    }
  };

  const exportToExcel = () => {
    if (transactions.length === 0) return alert("No data to export!");
    const worksheet = XLSX.utils.json_to_sheet(
      transactions.map((t, i) => ({
        "S.No": i + 1,
        Date: format(new Date(t.trn_date), "yyyy-MM-dd"),
        Description: t.trn_desc,
        Debit: t.dr_cr === "D" ? t.trn_amt : "",
        Credit: t.dr_cr === "C" ? t.trn_amt : "",
        Balance: t.ac_curr_bal,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Statement");
    XLSX.writeFile(workbook, `AccountStatement_${acNo || "All"}.xlsx`);
  };

  // Pagination Logic
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return transactions.slice(start, start + itemsPerPage);
  }, [transactions, currentPage]);

  return (
    <div className="min-h-screen bg-emerald-50 p-1">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-1 border border-emerald-200">
        <h1 className="text-2xl font-bold text-emerald-700 mb-1 text-center">
          Account Statement
        </h1>

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-2 items-end">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Account No
            </label>
            <input
              type="text"
              value={acNo}
              onChange={(e) => setAcNo(e.target.value)}
              className="w-full border border-emerald-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-400"
              placeholder="Enter Account No"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Account Title
            </label>
            <input
              type="text"
              value={acTitle}
              readOnly
              className="w-full border border-emerald-200 bg-emerald-50 text-gray-700 rounded-lg px-3 py-2"
              placeholder="Auto-filled title"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-emerald-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-emerald-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-400"
            />
          </div>

          <div className="flex gap-2 justify-center md:justify-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow transition-all"
            >
              {loading ? "Loading..." : "Search"}
            </button>

            <button
              onClick={exportToExcel}
              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold px-5 py-2.5 rounded-lg shadow transition-all border border-emerald-200"
            >
              Export
            </button>
          </div>
        </div>

        {/* Results Table */}
        {paginatedData.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-lg border border-emerald-100 shadow-sm">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-emerald-100 text-emerald-800 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Account</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2 text-right">Debit</th>
                    <th className="px-4 py-2 text-right">Credit</th>
                    <th className="px-4 py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((tran, idx) => (
                    <tr
                      key={idx}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-emerald-50"
                      } border-b border-emerald-100`}
                    >
                      <td className="px-2 py-2">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td className="px-2 py-2">{tran.ac_no}</td>
                      <td className="px-2 py-2">
                        {format(new Date(tran.trn_date), "dd-MMM-yyyy")}
                      </td>
                      <td className="px-4 py-2">{tran.trn_desc}</td>
                      <td className="px-4 py-2 text-right">
                        {tran.dr_cr === "D" ? tran.trn_amt : ""}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {tran.dr_cr === "C" ? tran.trn_amt : ""}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {tran.ac_curr_bal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-emerald-100 hover:bg-emerald-200 disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-emerald-100 hover:bg-emerald-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          !loading && (
            <p className="text-center text-gray-500 mt-6">
              No transactions found.
            </p>
          )
        )}
      </div>
    </div>
  );
}
