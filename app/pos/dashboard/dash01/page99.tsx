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
  const fetchData = async () => {
    console.log('into API..........');
    const res = await fetch("/api/pos/gen_ledg/gl_dashboard");
    const result = await res.json();
    if (result.success) setData(result.data);
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 to-emerald-100 flex flex-col items-center justify-start py-10">
      {/* Banner */}
      <div className="text-center mb-2">
        <h1 className="text-3xl font-bold text-emerald-700 mb-2 tracking-wide">
          📊 Accounts Dashboard
        </h1>
        {/* <p className="text-lg text-gray-700">
          Overview of Account Balances & Transactions
        </p> */}
      </div>
      {/* Table */}
      <div className="bg-white shadow-2xl rounded-2xl w-[92%] md:w-[80%] overflow-hidden">
        <table className="min-w-full text-lg font-medium">
          <thead className="bg-emerald-700 text-white text-lg">
            <tr>
              <th className="py-2 px-4 text-left">A/C No</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-right">Opening Bal.</th>
              <th className="py-2 px-4 text-right">Trans Today</th>
              <th className="py-2 px-4 text-right">Current Bal.</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-2 text-center text-gray-500 text-xl"
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
                  className="py-8 text-center text-gray-500 text-xl"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      {!loading && data.length > 0 && (
        <div className="mt-10 flex gap-8 flex-wrap justify-center">
          <div className="bg-emerald-200 px-2 py-2 rounded-xl shadow-md text-center w-60 hover:bg-emerald-300 transition">
            <h2 className="text-xl font-semibold text-emerald-800">
              Total Accounts
            </h2>
            <p className="text-3xl font-bold text-emerald-900 mt-2">
              {data.length}
            </p>
          </div>
          <div className="bg-emerald-200 px-8 py-2 rounded-xl shadow-md text-center w-60 hover:bg-emerald-300 transition">
            <h2 className="text-xl font-semibold text-emerald-800">
              Total Balance
            </h2>
            <p className="text-3xl font-bold text-emerald-900 mt-2">
              {data
                .reduce((sum, d) => sum + Number(d.curr_bal), 0)
                .toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
