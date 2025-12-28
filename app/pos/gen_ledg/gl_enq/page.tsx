"use client";

import { useState, useEffect, useMemo } from "react";

interface Account {
  brn_cd: number,
  gl_cd: string;
  gl_desc: string;
  curr_bal: string;
  gl_stat: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [brnCode, setBrnCode] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const params = new URLSearchParams();
    const fetchAccounts = async () => {
//      console.log('into api...')
      try {
//                console.log('into api...-----')
  if (brnCode) {
    params.append('brn_cod', brnCode.toString());
  }

      const resp = await fetch(`/api/pos/gen_ledg/gl_enq?${params.toString()}`);
//        const resp = await fetch("/api/pos/gen_ledg/gl_enq");
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

  // ✅ Fetch accounts on page load

  useEffect(() => {
    fetchAccounts();
  }, []);

  // ✅ Filter + Search logic
  const filteredAccounts = useMemo(() => {
    if (!accounts || accounts.length === 0) return [];

    const term = searchTerm.trim().toLowerCase();

    return accounts.filter((acc) => {
      const titleMatch = acc.gl_desc?.toLowerCase().includes(term);
      const noMatch = acc.gl_cd?.toString().includes(term);

      const statusMatch =
        filterStatus === "All" ||
        acc.gl_stat?.toLowerCase() === filterStatus.toLowerCase();

      return (titleMatch || noMatch) && statusMatch;
    });
  }, [accounts, searchTerm, filterStatus]);

  // ✅ Render
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-emerald-700">
        General Ledgers - Information
      </h2>

      {/* 🔍 Search + Filter Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="number"
          maxLength={3}
          placeholder="Branch"
          value={brnCode}
          onChange={(e) => setBrnCode(e.target.value)}
          className="flex-1 w-[100px] border border-gray-400 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
        />
        <button className="w-25 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1.5 px-2 rounded-md shadow-md transition-all"
          onClick={() => fetchAccounts()}>
          Display
        </button>
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
                <th className="border px-3 py-2 text-left">Brn</th>
                <th className="border px-3 py-2 text-left">A/c No</th>
                <th className="border px-3 py-2 text-left">A/c Title</th>
                <th className="border px-3 py-2 text-right">Curr Bal</th>
                <th className="border px-3 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((acc) => (
                <tr
                  key={acc.gl_cd}
                  className="hover:bg-emerald-50 transition-colors"
                >
                  <td className="border px-3 py-1">{acc.brn_cd}</td>
                  <td className="border px-3 py-1">{acc.gl_cd}</td>
                  <td className="border px-3 py-1">{acc.gl_desc}</td>
                  <td className="border px-3 py-1 text-right">
                    {Number(acc.curr_bal).toLocaleString()}
                  </td>
                  <td
                    className={`border px-3 py-1 text-center font-semibold ${
                      acc.gl_stat === "Active"
                        ? "text-green-700"
                        : "text-red-500"
                    }`}
                  >
                    {acc.gl_stat}
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
