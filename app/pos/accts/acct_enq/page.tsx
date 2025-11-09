"use client";

import { useState, useEffect, useMemo } from "react";

interface Account {
  ac_no: string;
  ac_title: string;
  curr_bal: string;
  ac_stat: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // ✅ Fetch accounts on page load
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const resp = await fetch("/api/pos/accts/accts_enq");
        const data = await resp.json();

        if (data.success && Array.isArray(data.data)) {
          setAccounts(data.data);
        } else {
          console.error("Invalid response:", data);
        }
      } catch (err) {
        console.error("Error fetching accounts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // ✅ Filter + Search logic
  const filteredAccounts = useMemo(() => {
    if (!accounts || accounts.length === 0) return [];

    const term = searchTerm.trim().toLowerCase();

    return accounts.filter((acc) => {
      const titleMatch = acc.ac_title?.toLowerCase().includes(term);
      const noMatch = acc.ac_no?.toString().includes(term);

      const statusMatch =
        filterStatus === "All" ||
        acc.ac_stat?.toLowerCase() === filterStatus.toLowerCase();

      return (titleMatch || noMatch) && statusMatch;
    });
  }, [accounts, searchTerm, filterStatus]);

  // ✅ Render
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-emerald-700">
        Accounts Inquiry
      </h2>

      {/* 🔍 Search + Filter Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by A/c No or Title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] border border-gray-400 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-400 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* 📋 Table */}
      {loading ? (
        <p className="text-gray-600">Loading accounts...</p>
      ) : filteredAccounts.length === 0 ? (
        <p className="text-gray-600">No accounts found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-md shadow-sm">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-emerald-100 text-emerald-800">
              <tr>
                <th className="border px-3 py-2 text-left">A/c No</th>
                <th className="border px-3 py-2 text-left">A/c Title</th>
                <th className="border px-3 py-2 text-right">Curr Bal</th>
                <th className="border px-3 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((acc) => (
                <tr
                  key={acc.ac_no}
                  className="hover:bg-emerald-50 transition-colors"
                >
                  <td className="border px-3 py-1">{acc.ac_no}</td>
                  <td className="border px-3 py-1">{acc.ac_title}</td>
                  <td className="border px-3 py-1 text-right">
                    {Number(acc.curr_bal).toLocaleString()}
                  </td>
                  <td
                    className={`border px-3 py-1 text-center font-semibold ${
                      acc.ac_stat === "Active"
                        ? "text-green-700"
                        : "text-red-500"
                    }`}
                  >
                    {acc.ac_stat}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
