"use client";
import { useEffect, useState } from "react";

interface DashboardItem {
  gl_cd: number;
  db_title: string;
  brn_cd: number;
  dd_op_bal: number;
  today_mvmnt: number;
  curr_bal: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [brnCd, setBrnCd] = useState(""); // Optional - empty by default

  const fetchData = async (branchCode: string) => {
    setLoading(true);
    console.log('Fetching data for branch:', branchCode || 'all branches');
    
    try {
      // Build URL with optional brn_cd parameter
      const url = branchCode.trim() 
        ? `/api/pos/gen_ledg/gl_dashboard?brn_cd=${branchCode}`
        : `/api/pos/gen_ledg/gl_dashboard`;
      
      const res = await fetch(url);
      const result = await res.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        alert(result.error || "Failed to fetch data");
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      alert("Error loading dashboard data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(brnCd);
  }, []); // Only fetch on initial mount

  const handleBranchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrnCd(e.target.value);
  };

  const handleSearch = () => {
    fetchData(brnCd);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 to-emerald-100 flex flex-col items-center justify-start py-2">
      {/* Banner - Reduced height */}
      <div className="text-center mb-1">
        <h1 className="text-2xl font-bold text-emerald-700 tracking-wide">
          📊 Accounts Dashboard
        </h1>
      </div>

      {/* Branch Code Input - Reduced height */}
      <div className="bg-white shadow-lg rounded-lg px-4 py-2 mb-3 w-[92%] md:w-[80%]">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-700">
            Branch Code:
          </label>
          <input
            type="number"
            value={brnCd}
            onChange={handleBranchChange}
            onKeyPress={handleKeyPress}
            className="w-28 border border-emerald-600 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="Optional"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1 px-4 rounded-md shadow-md transition-all disabled:opacity-50 text-sm"
          >
            {loading ? "Loading..." : "🔍 Search"}
          </button>
          <button
            onClick={() => {
              setBrnCd("");
              fetchData("");
            }}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-4 rounded-md shadow-md transition-all disabled:opacity-50 text-sm"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-2xl rounded-2xl w-[92%] md:w-[80%] overflow-hidden">
        <table className="min-w-full text-lg font-medium">
          <thead className="bg-emerald-700 text-white text-sm">
            <tr>
              <th className="py-2 px-4 text-left">A/C No</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-right">Opening Bal.</th>
              <th className="py-2 px-4 text-right">Trans Today</th>
              <th className="py-2 px-4 text-right">Current Bal.</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-gray-500 text-sm"
                >
                  Loading data...
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item, i) => (
                <tr
                  key={i}
                  className={`border-b transition-all duration-200 hover:scale-[1.01] ${
                    i % 2 === 0
                      ? "bg-emerald-50 hover:bg-emerald-100"
                      : "bg-white hover:bg-emerald-50"
                  } ${
                    item.curr_bal >= 0 ? "text-gray-800" : "text-red-600"
                  }`}
                >
                  <td className="py-2 px-2">{item.gl_cd}</td>
                  <td className="py-2 px-2">{item.db_title}</td>
                  <td className="py-2 px-2 text-right">
                    {item.dd_op_bal.toLocaleString()}
                  </td>
                  <td className="py-2 px-2 text-right">
                    {item.today_mvmnt.toLocaleString()}
                  </td>
                  <td
                    className={`py-2 px-2 text-right font-semibold ${
                      item.curr_bal >= 0 ? "text-emerald-700" : "text-red-600"
                    }`}
                  >
                    {item.curr_bal.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-gray-500 text-sm"
                >
                  {brnCd ? `No records found for branch code ${brnCd}` : "No records found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Section - Optional */}
      {/* {data.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg px-4 py-2 mt-3 w-[92%] md:w-[80%]">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">
              Total Accounts: <span className="text-emerald-700">{data.length}</span>
              {brnCd && <span className="ml-2 text-gray-500">(Branch: {brnCd})</span>}
            </p>
          </div>
        </div>
      )} */}
    </div>
  );
}