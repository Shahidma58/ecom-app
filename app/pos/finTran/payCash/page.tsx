"use client";
import { gVars } from "../../../app.config";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { calc_dayofyear, get_str_date } from "@/lib/udfs";
export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [gl_desc, setGl_desc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const drAcRef = useRef<HTMLInputElement>(null);
  const wCOH = parseInt(gVars.gCOH);
  const gUser = gVars.gUser;
  let wTrn_dt = 0;
  const today = new Date();
  const wTrn_date = today;

  //-=====================================================
  const [form, setForm] = useState({
    trn_id: 0,
    trn_serl: 1,
    trn_date: wTrn_date,
    mod_id: "FINTR",
    ac_no: wCOH,
    gl_cd: 200011,
    trn_desc: "Test Tran ---",
    dr_cr: "C",
    trn_amt: 125,
    trn_flag: "A",
    trn_stat: "A",
    inp_by: gUser,
    drac_no: 0,
  });

  const [tran2, setTran2] = useState({
    drgl_cd: 200999,
    dr_cr: "D",
    trn_dt: 25303, //wTrn_dt
  });

  const [acctInfo, setAcInfo] = useState({
    drActitle: "",
    crActitle: "",
    drAcBal: 0,
    crAcBal: 0,
  });
  /* =====================  MOVE TO Central config ===============*/
  const inputClassSmall =
    "w-[200px]  border-black-500 rounded-md px-3 py-2.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-pink-400 transition-all bg-gray-200";
  const inputClassLarge =
    "border border-black-500 rounded-md px-3 py-2.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-pink-400 transition-all bg-gray-200";
  /* --===========================================================================*/
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  //================================================
  //================================================
  const fetchCOH = async (wCOH: number) => {
    if (!wCOH || wCOH === 0) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/pos/fin_tran/get_gl/${wCOH}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch Account");
      }

      if (data.success) {
        setAcInfo((prev) => ({
          ...prev,
          crActitle: data.data.gl_desc,
          crAcBal: data.data.curr_bal,
        }));
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
        // Set gl_desc in form state
        // setForm(prev => ({
        //   ...prev,
        //   gl_desc: data.data.ac_title,
        //   curr_bal: data.data.curr_bal
        // }));
        setAcInfo((prev) => ({
          ...prev,
          drActitle: data.data.ac_title,
          drAcBal: data.data.curr_bal,
        }));
      }
    } catch (error) {
      console.error("Error fetching Account:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch account"
      );
      // Clear gl_desc on error
      setForm((prev) => ({
        ...prev,
        gl_desc: "",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleGLCodeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const gl_cd = parseInt(e.target.value);

    if (!isNaN(gl_cd) && gl_cd > 0) {
      fetchAccount(gl_cd);
    }
  };
  //==================================================
  const handlePostTran = async () => {
    try {
      setLoading(true);
      setError(null);

      const tranPayload = {
        tranDr: tran2,
        tranInfo: form,
      };

      console.log("creating a cart----------");

      const apiResponse = await fetch("/api/pos/fin_tran/save_fin_tr", {
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
  //==================================================
  useEffect(() => {
    fetchCOH(wCOH);
    drAcRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div
          className="mb-4 rounded-lg shadow-lg p-2 text-center"
          style={{
            background: "linear-gradient(to right, #ec4899, #a855f7, #3b82f6)",
          }}
        >
          <h2 className="text-2xl font-semibold text-white mb-2">
            Pay Cash --- {gVars.siteName}
          </h2>
          {/* <div className="h-1 w-20 bg-white rounded-full mx-auto"></div> */}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-800 p-8">
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
          {/* //===================== FROM ACCOUNT =========================== */}
          <div className="space-y-1">
            {/* Header Row */}
            <div className="grid grid-cols-4 gap-2 text-sm font-medium text-gray-700">
              <div>Account</div>
              <div className="col-span-2">Title</div>
              <div>Curr Bal.</div>
            </div>

            {/* Input Row */}
            <div className="grid grid-cols-4 gap-2 items-center">
              {/* Account Input */}
              <div className="w-full">
                <input
                  name="ac_no"
                  type="text"
                  placeholder="Pay Cash"
                  title="Cash on Hand G/L"
                  maxLength={6}
                  className={inputClassSmall}
                  value={form.ac_no}
                  onChange={handleInputChange}
                />
              </div>

              {/* Title Input */}
              <div className="col-span-2 w-full">
                <input
                  name="crAcTitle"
                  type="text"
                  value={acctInfo.crActitle}
                  placeholder="A/c Title"
                  className={inputClassLarge}
                  readOnly
                />
              </div>

              {/* Current Balance Input */}
              <div className="w-full">
                <input
                  id="crAcBal"
                  name="crAcBal"
                  type="text"
                  value={acctInfo.crAcBal}
                  className={inputClassSmall + " text-right bg-gray-100"}
                  readOnly
                />
              </div>
            </div>

            {/* =================  TO ACCOUNT ======================= */}
            <div className="space-y-1">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                {/* <div className="md:col-span-1"> */}
                <div className="w-[100px] border-black-800">
                  <input
                    name="drac_no"
                    type="text"
                    ref={drAcRef}
                    value={form.drac_no}
                    placeholder="Pay To"
                    maxLength={6}
                    title="Pay to Account/GL"
                    className={inputClassSmall}
                    onChange={handleInputChange}
                    onBlur={handleGLCodeBlur}
                  />
                </div>
                <div className="md:col-span-2">
                  <input
                    name="drAcTitle"
                    type="text"
                    value={acctInfo.drActitle}
                    placeholder="Credit Account"
                    className={inputClassLarge}
                    maxLength={35}
                    //onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div className="md:col-span-1">
                  <input
                    name="drAcrBal"
                    type="text"
                    value={acctInfo.drAcBal}
                    placeholder="Balance"
                    className={inputClassSmall + " text-right bg-gray-100"}
                    //onChange={handleInputChange}
                    disabled
                  />
                </div>
              </div>
              <div className="flex">
                <label className="w-40 pt-2">Description: </label>
                <input
                  name="trn_desc"
                  type="text"
                  value={form.trn_desc}
                  required
                  placeholder="Description"
                  maxLength={35}
                  className={inputClassLarge}
                  onChange={handleInputChange}
                  // readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <label className="w-10 pt-2">Amount: </label>
              <div className="w-40 md:col-span-1">
                <input
                  name="trn_amt"
                  type="text"
                  value={form.trn_amt}
                  placeholder="Amount"
                  required
                  className={inputClassSmall}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* ============================= Buttons ================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <button
              onClick={handlePostTran}
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
              onClick={
                () => {}
              }
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


//Clr_Form {
                  // setForm({
                //   trn_id: 0,
                //   trn_serl: 0,
                //   trn_date: Date,
                //   mod_id: "FINTR",
                //   ac_no: ,
                //   gl_cd: ,
                //   trn_desc: "Test Tran ---",
                //   dr_cr: "D",
                //   trn_amt: 125,
                //   trn_flag: "A",
                //   trn_stat: "A",
                //   inp_by: "Admin",
//}