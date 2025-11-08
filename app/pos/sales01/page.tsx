"use client";
import React, { useState, useEffect } from "react";
import { gVars } from "../../app.config";
import { useRouter } from "next/navigation";
//import { useParams, useNavigate } from "react-router-dom";
import "./sales01.css";
import { calc_dayofyear, get_str_date } from "@/lib/udfs";

export default function Sales01 () {
  const today = new Date();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
//  const [gl_desc, setGl_desc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [salItems, setSalItems] = useState<FormItem[]>([]);
  const [salTotals, setSalTotals] = useState<SalTotal>({
    sal_id :0,
    sal_dt : today,
    sal_amt :0,
    sal_items : 0,
    sal_qty : 0,
    sal_disc : 0,
    inp_by : gVars.gUser
  });

  const wTrn_Dt = calc_dayofyear();
  const wStr_Dt = get_str_date();

  console.log(wTrn_Dt);

  console.log(wStr_Dt);
  // const [tranDt, setTranDt] = useState({
  //   trn_dt : wTrn_dt
  // });

  const gUser = gVars.gUser;
//============= Date Parsing  ============
  interface FormItem {
   sal_id: number,
//    sal_id_serl : number,
    itm_cd: number,
    itm_desc: String,
//    sal_dt: Date,  
    itm_rsp: number,
    itm_qty : number,
    itm_disc: number,
    itm_tax: number,
    itm_cost: number,
    itm_amt: number,
    itm_stat: String,
 }
//================================================
  interface SalTotal {
    sal_id    : number;
    sal_dt    : Date;
    sal_qty   : number;
    sal_amt   : number;
    sal_items : number;
    sal_disc  : number;
    inp_by    : String;
  }

  //=============================================      
  const [form, setForm] = useState({
    sal_id: 0,
    itm_cd: 220100100101,
    itm_desc: "Lipton Tea",
//    sal_dt: today,  
    itm_rsp: 0,
    itm_qty : 2,
    itm_disc: 0,
    itm_tax: 0,
    itm_cost: 0,
    itm_amt: 125,
    itm_stat: "A",
  });
//================================================
// Function to fetch GL account details
const fetchProd = async (prd_cd: number) => {
  if (!prd_cd || prd_cd === 0) {
    return;
  }

  try {
    setLoading(true);
    setError(null);
    console.log(prd_cd);

    const resp = await fetch(`/api/pos/get_prod?prd_cd=${prd_cd}`);
    const data = await resp.json();
    
    console.log(data);
    console.log(data.data.prd_desc);

    if (!resp.ok) {
      throw new Error(data.error || "Failed to fetch Product");
    }

    if (data.success) {
      // Calculate itm_amt BEFORE setting state
      const itemRsp = Number(data.data.max_rsp);
      const itemQty = Number(form.itm_qty);
      const itemAmt = itemRsp * itemQty;

      // Create the new item object with calculated values
      const newItem = {
        ...form,
        itm_desc: data.data.prd_desc,
        itm_rsp: itemRsp,
        itm_cost: Number(data.data.pur_prc),
        itm_qty: itemQty,
        itm_amt: itemAmt
      };

      // Set form state with the new item
      setForm(newItem);

      // Add the new item to salItems array
      setSalItems((prevItems) => {
        const updatedItems = [...prevItems, newItem];
        
        // Calculate totals using the UPDATED array
        const totalQty = updatedItems.reduce((sum, item) => sum + Number(item.itm_qty || 0), 0);
        const totalAmount = updatedItems.reduce((sum, item) => sum + Number(item.itm_amt || 0), 0);
        const totalDisc = updatedItems.reduce((sum, item) => sum + Number(item.itm_disc || 0), 0);
        const totalItems = updatedItems.length;

        // Update totals
        setSalTotals({
          sal_id : 0,
          sal_dt : today,
          sal_qty: totalQty,
          sal_amt: totalAmount,
          sal_items: totalItems,
          sal_disc: totalDisc,
          inp_by : gVars.gUser
        });

        return updatedItems;
      });

      console.log("New item added:", newItem);
    }

  } catch (error) {
    console.error("Error fetching Product:", error);
    setError(error instanceof Error ? error.message : "Failed to fetch Product");
    
    // Clear itm_desc on error
    setForm(prev => ({
      ...prev,
      itm_desc: ""
    }));
  } finally {
    setLoading(false);
  }
};

//=====================
  const fetchProd11 = async (prd_cd: number) => {
    if (!prd_cd || prd_cd === 0) {
      return;
    }

    try {

      setLoading(true);
      setError(null);
      console.log(prd_cd);

//      const response = await fetch(`/api/pos/get_prod/?${prd_cd}`);
        const resp = await fetch(`/api/pos/get_prod?prd_cd=${prd_cd}`);
//      fetch('/api/ecom/products?prd_cd=1001')
      const data = await resp.json();
console.log(data);
console.log(data.data.prd_desc);
      if (!resp.ok) {
        throw new Error(data.error || "Failed to fetch Product");
      }

      if (data.success) {
        // Set prd_desc in form state
        setForm(prev => ({
          ...prev,
          itm_desc: data.data.prd_desc,
          itm_rsp : data.data.max_rsp,
          itm_cost : data.data.pur_prc,
          itm_qty : form.itm_qty,
          itm_amt : form.itm_rsp * form.itm_qty
        }));
      }
        // Create a NEW array by spreading the previous items
        // and appending the current form object (a copy of it)
        
      setSalItems((prevItems) => {
        return [...prevItems, { ...form }];        
      });  
 // Calculate new totals
  // const totalQty = salItems.reduce((sum, item) => sum + Number(item.itm_qty || 0), 0);
  // const totalAmount = salItems.reduce((sum, item) => sum + Number(item.itm_amt || 0), 0);
  // const totalDisc = salItems.reduce((sum, item) => sum + Number(item.itm_disc || 0), 0);
  // const totalItems = salItems.length;

  // Update totals
  // setSalTotals({
  //   sal_id : 0,
  //   sal_dt : today,
  //   sal_qty: totalQty,
  //   sal_amt: totalAmount,
  //   sal_items: totalItems,
  //   sal_disc: totalDisc,
  //   inp_by: gVars.gUser
  // });      

  //console.log(form);
    console.log(salItems);
    } catch (error) {
      console.error("Error fetching Product:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch Product");
      
      // Clear prd_desc on error
      setForm(prev => ({
        ...prev,
        itm_desc: ""
      }));
    } finally {
      setLoading(false);
    }
  };
//====================================================================
  //==================================================
  const handleSaveTran = async () => {
    try {
      setLoading(true);
      setError(null);

      const tranPayload = {
        salTots: salTotals,
        salItms: salItems,
        tran_dt : wTrn_Dt
      };

      console.log("creating a cart----------");

      const apiResponse = await fetch("/api/pos/save_tran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tranPayload),
      });

      if (!apiResponse.ok) {
        throw new Error("Failed to Update Transaction");
      }
    } catch (error) {
      console.error("Error Updating Transaction:", error);
      setError(
        error instanceof Error ? error.message : "Failed to Update Transaction"
      );
    } finally {
      setLoading(false);
    }
  };



//====================================================================
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })};
//====================================================================
  return (
    <>
      <div className="top-banner">
        {/* <a href="/" className="home-link">
          🏠 Home
        </a> */}
        <h2 className="shop-title">HerbaGlam - Cosmetics Universe</h2>
        <div className="digital-clock" id="digitalClock">
          <span id="dateDisplay"></span> : <span id="timeDisplay"></span>
        </div>
      </div>
      {/* //================= Form ===================== */}
      <div className="form-container">
        <div className="form-row">
          <input
            type="text"
            name="itm_cd"
            placeholder="Product Code"
            className="form-field"
            style={{ width: "150px" }}
            maxLength= {12}
            value={form.itm_cd}
            onChange={handleInputChange}
            autoFocus
            onBlur={() => fetchProd(form.itm_cd)}
         />
          <input
            type="text"
            placeholder="Product Description"
            className="form-field"
            value={form.itm_desc}
            readOnly
            style={{ width: "450px" }}
          />
          <input
            name= "itm_qty"
            type="number"
            placeholder="Qty"
            className="form-field"
            style={{ width: "60px" }}
            value={form.itm_qty}
            onChange={handleInputChange}
          />
          <input
            name="itm_rsp"
            type="number"
            placeholder="Price"
            className="form-field"
            style={{ width: "120px" }}
            value={form.itm_rsp}
            onChange={handleInputChange}

          />
          <input
            name = "itm_disc"
            type="number"
            placeholder="Discount"
            className="form-field"
            style={{ width: "100px" }}
            value={form.itm_disc}
            onChange={handleInputChange}
          />
          <input
            name="itm_amt"
            type="number"
            placeholder="Total Price"
            className="form-field"
            readOnly
            style={{ width: "140px" }}
            value={form.itm_amt}
            onChange={handleInputChange}
          />
          <input
            name="itm_cost"
            type="number"
            placeholder="Total Price"
            className="form-field"
            hidden
            style={{ width: "140px" }}
            value={form.itm_cost}
            onChange={handleInputChange}
          />



          <select className="form-field"  style={{ width: "60px" }}>
            <option value="R">R</option>
            <option value="S">S</option>
          </select>

          <button className="btn save-btn"  style={{ width: "100px", height: "50px" }}>
            💾
          </button>
          {/* <button className="btn save-btn"  style={{ width: "100px", height: "50px" }}>
            💾
          </button> */}
        </div>
      </div>
      {/* <!--================= Table =============--> */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th  style={{ width: "140px" }}>Product Code</th>
              <th  style={{ width: "460px" }}>Description</th>
              <th  style={{ width: "55px" }}>Qty</th>
              <th  style={{ width: "110px" }}>Price</th>
              <th  style={{ width: "100px" }}>Discount</th>
              <th  style={{ width: "130px" }}>Total Price</th>
              <th  style={{ width: "60px" }}>Stat</th>
              <th  style={{ width: "50px" }}>
                <button className="btn delete-btn"  style={{ width: "50px" }}>
                  🗑️
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
          {salItems.map((item, index) => (
          <tr key={index}> {/* Use a stable key. item.sal_id_serl is better if unique. */}
            {/* <td className="px-6 py-4 text-sm font-medium text-gray-900">
              {item.sal_id_serl}
            </td> */}
            <td className="px-6 py-4 text-sm text-gray-500">
              {item.itm_cd}
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">
              {item.itm_desc}
            </td>
            <td className="px-6 py-4 text-sm text-gray-500 text-right">
              {item.itm_qty}
            </td>
            <td className="px-6 py-4 text-sm text-gray-500 text-right">
              {item.itm_rsp.toFixed(2)}
            </td>
            <td className="px-6 py-4 text-sm text-gray-500 text-right">
              {item.itm_amt}
            </td>

          </tr>
        ))}
        </tbody>
        </table>
      </div>
      <div className="totals-section">
        <div className="form-row totals-row">
          <div className="form-group-inline">
            <label className="field-label">Total Items:</label>
            <input
              type="text"
              className="form-field totals-field"
              readOnly
              value={salTotals.sal_items}
              name="total_items"
            />
          </div>

          <div className="form-group-inline">
            <label className="field-label">Total Qty:</label>
            <input
              type="number"
              className="form-field totals-field"
              readOnly
              value= {salTotals.sal_qty}
              name="total_qty"
            />
          </div>

          <div className="form-group-inline">
            <label className="field-label">Gross Amt:</label>
            <input
              type="number"
              className="form-field totals-field"
              readOnly
              value={salTotals.sal_amt}
              name="gross_amount"
            />
          </div>

          <div className="form-group-inline">
            <label className="field-label">Net Amt:</label>
            <input
              type="number"
              className=" totals-field"
              readOnly
              value={salTotals.sal_disc}
              name="net_amount"
            />
          </div>

          <button className="btn save-tots"
              onClick={handleSaveTran}
              disabled={loading}
              // className={`btn-primary ${
              //   loading ? "btn-loading" : ""
              // }`}

>
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  PROCESSING...
                </span>
              ) : (
                "Save"
              )}
          </button>
        </div>
      </div>
    </>
  );
}
