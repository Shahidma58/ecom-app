//====================================================
// Transfer amount from one Acct/GL to another Acct/GL
//====================================================
"use client";
import { gVars } from "../../../app.config";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { calc_dayofyear, get_str_date } from "@/lib/udfs";
import { CloudCog } from "lucide-react";
import { Int } from "mssql";
export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  //  const [gl_desc, setGl_desc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const crAcRef = useRef<HTMLInputElement>(null);
  const trnDescRef = useRef<HTMLInputElement>(null);
  const trnAmtRef = useRef<HTMLInputElement>(null);

  const wCOH = parseInt(gVars.gCOH);
  const gUser = gVars.gUser;
  const to_day = new Date();
  let wFlag = "";
  const [drAcDesc, setDrAcDesc] = useState("");
  const [crAcDesc, setCrAcDesc] = useState("");
  //======================================================
  const wTrn_Dt = calc_dayofyear();
  //-=====================================================
  const initForm = {
    brn_cd: gVars.gBrn_Cd,
    trn_id: 0,
    trn_serl: 0,
    trn_date: to_day,
    trn_dt: wTrn_Dt,
    ac_no: 0,
    gl_cd: 0,
    trn_desc: "Test Tran ---",
    dr_cr: "C",
    trn_amt: 0,
    trn_flag: "A",
    inp_by: gUser,
    ac_curr_bal: 0,
    drac_no: 0,
    drac_curr_bal: 0,
    drgl_cd: 0,
  };
  const [form, setForm] = useState(initForm);
  /* --===========================================================================*/
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  //================================================
  const fetchGenLedg = async (wCOH: number) => {
    if (!wCOH || wCOH === 0) {
      return;
    }
    const gl_cd = wCOH;
    const wbrn_cd = gVars.gBrn_Cd;
console.log(wbrn_cd);
    try {
      setLoading(true);
      setError(null);
//      const response = await fetch(`/api/pos/fin_tran/get_gl/${gl_cd}`);
      const response = await fetch(`/api/pos/fin_tran/get_gl/?gl_cd=${gl_cd}&brn_cd=${wbrn_cd}`);
      const data = await response.json();
      console.log(data.data.curr_bal);
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch Account");
      }
      if (wFlag == "D") {
        setForm((prevForm) => ({
          ...prevForm,
          drac_curr_bal: data.data.curr_bal,
        }));
        setDrAcDesc(data.data.gl_desc);
//      form.drgl_cd = 0;
      } else {
        setForm((prevForm) => ({
          ...prevForm,
          ac_curr_bal: data.data.curr_bal,
        }));
        setCrAcDesc(data.data.gl_desc);
      }
    } catch (error) {
      console.error("Error fetching Account:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch account"
      );
    } finally {
      setLoading(false);
    }
  };
  // Function to fetch GL account details
  const fetchAccount = async (ac_no: number) => {
    if (!ac_no || ac_no === 0) {
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/pos/fin_tran/get_ac/${ac_no}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch Account");
      }

      if (data.success) {
        // setAcctInfo ({
        //   ac_Title: data.data.ac_title,
        //   ac_Curr_Bal : parseFloat(data.data.curr_bal),
        //   ac_gl : parseInt(data.ac_gl)  // add temp input to display value
        // });
        if (wFlag == 'C') {
          form.ac_curr_bal = parseFloat(data.data.curr_bal);
          form.gl_cd = parseInt(data.data.ac_gl);
          setCrAcDesc(data.data.ac_title);
         } else {
           form.drac_curr_bal = parseFloat(data.data.curr_bal);
           form.gl_cd = parseInt(data.data.ac_gl);
           setDrAcDesc(data.data.ac_title);
         }
      }
    } catch (error) {
      console.error("Error fetching Account:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch account"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCrAcBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const wac_no = parseInt(e.target.value);
    wFlag = 'C';
    console.log(parseInt(e.target.value));
    handleAcBlur(wac_no);
  }
//======================================================================
  const handleDrAcBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const wac_no = parseInt(e.target.value);
    wFlag = 'D';
    console.log(parseInt(e.target.value));
    handleAcBlur(wac_no);
  }
//=====================================================================
//  const handleAcBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  const handleAcBlur = (wac_no: number) => {
    //---------------------------------------
//    const gl_cd = parseInt(e.target.value);
    const gl_cd = wac_no;
    if (!isNaN(gl_cd) && gl_cd > 0) {
      if (gl_cd > 100000) {
        fetchAccount(gl_cd);
      } else {
        fetchGenLedg(gl_cd);
      }
    }
    // trnDescRef.current?.focus();
  };
  //================== POST TRANSACTIONS =========================
  const handleSaveTran = async () => {
    let err = "";
    if (form.ac_no > 99999) {
      if (form.gl_cd <= 0) {
        err = "Invalid Cr-GL Code initialized";
      }
    } else {
      if (form.gl_cd != 0) {
        err = "Invalid Cr-GL Code initialized";
      }
    }
    if (form.drac_no > 99999) {
      if (form.drgl_cd <= 0) {
        err = "Invalid Cr-GL Code initialized";
      }
    } else {
      if (form.drgl_cd != 0) {
        err = "Invalid Cr-GL Code initialized";
      }
    }
    if (form.trn_amt < 1) {
        err = "Err: Invalid Amount";
    }
    if (err != "") {
      alert("Err: Invalid Data being Sent");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const tranPayload = {
        //        tranDbt: tran2,
        tranCr: form,
      };

      console.log("creating a Transaction----------");
      //console.log(tranPayload);
      const apiResponse = await fetch("/api/pos/fin_tran/save_fin_tr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tranPayload),
      });

      if (!apiResponse.ok) {
        throw new Error("Failed to Update Transaction");
      } else {
        handleClearForm;
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
  //=============   Get COH G/L =================================
  const handleClearForm = async () => {
    setDrAcDesc("");
    setCrAcDesc("");
    setForm(initForm);
    console.log(form);
  };
  //=======================================================
    //   useEffect(() => {
    //     fetchGenLedg(wCOH);
    //     wFlag = "D";
    //     setForm((prevForm) => ({
    //       ...prevForm,
    //       drac_no: wCOH,
    //     }));
    //     form.drgl_cd = 0;
    //     crAcRef.current?.focus();
    //   }, []);
  
  /* =====================  MOVE TO Central config ===============*/
  const inputClassSmall =
    "w-[200px]  border-black-500 rounded-md px-3 py-2.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-pink-400 transition-all bg-gray-100";
  const inputClassLarge =
    "border border-black-500 rounded-md px-3 py-2.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-pink-400 transition-all bg-gray-100";
  /* =====================  MOVE TO Central config ===============*/
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div
          className="mb-4 rounded-lg shadow-lg p-2 text-center"
          style={{
            background:
              "linear-gradient(to right, #3B7B23FF, #72C049FF, #8180D4FF)",
          }}
        >
          <h2 className="text-2xl font-semibold text-white mb-2">
            Acct/GL to Acct/GL
          </h2>
          {/* <div className="h-1 w-20 bg-white rounded-full mx-auto"></div> */}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-800 p-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded mb-6">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            </div>
          )}
          {/* =================  TO ACCOUNT ======================= */}
          <div className="space-y-1">
            {/*=================== Header Row =======================*/}
            <div className="grid grid-cols-[13%_15%_50%_18%] gap-2 text-sm font-medium text-black w-full py-1">
              <div></div>
              <div>Account---</div>
              <div>Title</div>
              <div className="text-right pr-2 ">Curr Bal.</div>
            {/* -- ROW - 2 Debit Account */}
              <div >Debit To:</div>
              <div>
                <input
                  name="drac_no"
                  type="text"
                  value={form.drac_no}
                  placeholder="Debit A/c"
                  maxLength={6}
                  title="Debit A/c"
                  className={inputClassSmall}
                  onChange={handleInputChange}
                  onBlur={handleDrAcBlur}
//                  readOnly
                />
              </div>
              <div>
                <input
                  name="drAcTitle"
                  type="text"
                  value={drAcDesc}
                  placeholder="Account/GL Title"
                  className={inputClassLarge}
                  maxLength={35}
                  disabled
                />
              </div>
              <div>
                <input
                  name="drAcBal"
                  type="text"
                  value={form.drac_curr_bal}
                  placeholder="Balance"
                  className={inputClassSmall + " text-right bg-gray-100"}
                  onChange={handleInputChange}
                  readOnly
                />
            </div>
            {/* -- ROW - 3 Credit Account */}
                  <div>Credit By:</div>
                <div>
                  <input
                    name="ac_no"
                    type="text"
                    ref={crAcRef}
                    placeholder="Credit A/c"
                    title="Credit A/c"
                    maxLength={6}
                    className={inputClassSmall}
                    value={form.ac_no}
                    onChange={handleInputChange}
                    onBlur={handleCrAcBlur}
                  />
                </div>
                {/* Title Input */}
                <div>
                  <input
                    name="crAcTitle"
                    type="text"
                    value={crAcDesc}
                    placeholder="Account/GL Title"
                    className={inputClassLarge}
                    disabled
                  />
                </div>
                <div className="w-full">
                  <input
                    id="crAcBal"
                    name="crAcBal"
                    type="text"
                    value={form.ac_curr_bal}
                    className={inputClassSmall + " text-right bg-gray-100"}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>
              </div>

              <div className="flex">
                <label className="w-72 pt-2">Description: </label>
                <input
                  name="trn_desc"
                  type="text"
                  ref={trnDescRef}
                  value={form.trn_desc}
                  required
                  placeholder="Description"
                  maxLength={35}
                  className={inputClassLarge}
                  onChange={handleInputChange}
                  // readOnly
                />
              </div>
            {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4"> */}
              <div className="flex pt-1">
                <div className="w-49 pt-2">
                  <label >Amount: </label>
              </div>
              <div className="w-40 md:col-span-1">
                <input 
                  name="trn_amt"
                  type="number"
                  value={form.trn_amt}
                  placeholder="Amount"
                  min={1}
                  required
                  className={inputClassSmall}
                  onChange={handleInputChange}
                />
              </div>
              {/* ================  TEMP ============= */}
              {/* <div className="w-40 md:col-span-1 px-6">
                <input
                  name="cr_ac_gl"
                  type="text"
                  value={form.gl_cd}
                  placeholder="cr GL"
                  className={inputClassSmall}
                  onChange={handleInputChange}
                  disabled
                />
              </div> */}

              {/* <div className="w-34 md:col-span-1">
                <input
                  name="dr_ac_gl"
                  type="text"
                  value={form.drgl_cd}
                  placeholder="Debit GL"
                  className={inputClassSmall}
                  onChange={handleInputChange}
                  disabled
                />
              </div> */}
            </div>
          </div>

          {/* ============================= Buttons ================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <button
              onClick={handleSaveTran}
              disabled={loading}
              className={`btn-primary ${loading ? "btn-loading" : ""}`}
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

            <button
              onClick={() => router.back()}
              disabled={loading}
              className={`border-2 border-gray-300 text-gray-700 py-2.5 px-6 rounded-md font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Go Back
            </button>

            <button
              onClick={handleClearForm}
              disabled={loading}
              className={`border-2 border-pink-300 text-pink-600 py-2.5 px-6 rounded-md font-semibold hover:border-pink-400 hover:bg-pink-50 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
