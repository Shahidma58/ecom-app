import React from "react";

const data = [
  { ac_no: "12345", ac_title: "Shahid Mahmood Alam", curr_bal: "0", ac_stat: "Inactive" },
  { ac_no: "210001", ac_title: "A&M ENTERISES", curr_bal: "5001", ac_stat: "Active" },
  { ac_no: "210002", ac_title: "AA TRADERS", curr_bal: "200", ac_stat: "Active" },
  { ac_no: "210003", ac_title: "AB TRADERS", curr_bal: "-0.1", ac_stat: "Active" },
  { ac_no: "210004", ac_title: "ABBAS BURSH", curr_bal: "-700", ac_stat: "Active" },
  { ac_no: "210005", ac_title: "ABDUL GHANI MEDICINE COMPANY", curr_bal: "-6303.36", ac_stat: "Active" },
  { ac_no: "210006", ac_title: "ABDULLAH TRADERS", curr_bal: "2000", ac_stat: "Active" },
  { ac_no: "210007", ac_title: "ABID ELECTRONICS SH", curr_bal: "0", ac_stat: "Active" },
  { ac_no: "210008", ac_title: "ADIL", curr_bal: "0.16", ac_stat: "Active" },
  { ac_no: "210009", ac_title: "ADJUSTMENT", curr_bal: "0", ac_stat: "Active" },
  { ac_no: "210010", ac_title: "AG GARMENTS", curr_bal: "0", ac_stat: "Active" },
  { ac_no: "210011", ac_title: "AH TRADERS", curr_bal: "0", ac_stat: "Active" },
  { ac_no: "210012", ac_title: "AJ TRADERS", curr_bal: "0", ac_stat: "Active" },
  { ac_no: "210013", ac_title: "AJMARI TRADERS", curr_bal: "0", ac_stat: "Active" },
  { ac_no: "210014", ac_title: "AK MARKETING", curr_bal: "0", ac_stat: "Active" },
  { ac_no: "210015", ac_title: "AL AMIN TRADERS", curr_bal: "-7442.03", ac_stat: "Active" },
  { ac_no: "210016", ac_title: "AL HAMD TRADERS", curr_bal: "-0.2", ac_stat: "Active" },
  { ac_no: "210017", ac_title: "AL JANET HOSERY", curr_bal: "0", ac_stat: "Active" },
];

export default function AccountTable() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Account List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border-b">Account No</th>
              <th className="px-4 py-2 text-left border-b">Account Title</th>
              <th className="px-4 py-2 text-right border-b">Current Balance</th>
              <th className="px-4 py-2 text-center border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr
                key={i}
                className={`${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50`}
              >
                <td className="px-4 py-2 border-b">{item.ac_no}</td>
                <td className="px-4 py-2 border-b">{item.ac_title}</td>
                <td
                  className={`px-4 py-2 border-b text-right ${
                    Number(item.curr_bal) < 0 ? "text-red-600" : "text-green-700"
                  }`}
                >
                  {item.curr_bal}
                </td>
                <td
                  className={`px-4 py-2 border-b text-center ${
                    item.ac_stat === "Active"
                      ? "text-green-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {item.ac_stat}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
