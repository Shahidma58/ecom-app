"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState } from "react";
import "../../../../app/globals.css";
import { gVars } from "@/app/app.config";

// ✅ YUP Schema
const schema = Yup.object({
  gl_cd: Yup.number()
    .typeError("GL Code must be a number")
    .required("GL Code is required")
    .max(99999, "GL Code must be less than or equal to 99999"),
//  gl_cd: Yup.number().required("GL Code is required"),
  gl_desc: Yup.string()
    .required("Description is required"),
    brn_cd:  Yup.number()
    .required("Banch Code is required")
    .max(199, "Branch Code must be less than or equal to 199"),

  yy_op_bal: Yup.number().required("Opening Balance is required"),
  curr_bal: Yup.number().required("Current Balance is required"),
  inp_by: Yup.string().optional(),
});

export default function GenLedgForm() {
  const [gl_code, setGl_Code] = useState(0);
  const [br_name, setBr_Name] = useState("");
//  const [gl_desc, setGl_Desc] = useState("");
  const [message, setMessage] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Classes (same as account form)
  const inputErrorClass = "border-red-500 focus:ring-red-400 focus:border-red-400";

  // ---------------------------------------------------------
  // 🔍 SEARCH BY gl_cd ON BLUR
  // ---------------------------------------------------------
  const checkGL = async (gl_cd: number) => {
    if (!gl_cd) return;

    try {
      setLoading(true);
      setGl_Code(gl_cd);
      const res = await fetch(`/api/pos/gen_ledg/${gl_cd}`);

      const data = await res.json();

      if (data.success && data.data) {
        const gl = data.data;
        // fill form
        setValue("gl_desc", gl.gl_desc);
        setValue("yy_op_bal", gl.yy_op_bal);
        setValue("curr_bal", gl.curr_bal);
        setValue("inp_by", "Admin");
        setBtnDisabled(true);
      } else {
        setValue("gl_desc", "");
        setBtnDisabled(true);
        setMessage("→ Invalid GL Code");
      }
    } catch (err) {
        setBtnDisabled(true);
      console.error(err);
      setMessage("⚠ Error checking GL Code");
    } finally {
      setLoading(false);
    }
  };

//=============================================================
  const getGl_Bal = async (brn_cd: number, gl_cd: number) => {
//console.log('into function.......');
    if (!brn_cd) return;
    try {
      setLoading(true);
      const glBal = await fetch(`/api/pos/gen_ledg/gl_bals?gl_code=${gl_cd}&brn_cod=${brn_cd}`);
      const data = await glBal.json();
//console.log(data);
      if (data.success && data.data) {
        const gl = data.data;
        setValue("yy_op_bal", gl.yy_op_bal);
        setValue("curr_bal", gl.curr_bal);
        setValue("inp_by", gl.inp_by);
        setBtnDisabled(true);
        setMessage("→ Branch GL already defined....");
      } else {
        setValue("yy_op_bal", 0);
        setValue("curr_bal", 0);
        setValue("inp_by", gVars.gUser);
        setBtnDisabled(false);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠ Error checking GL Code");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // 💾 SAVE (CREATE OR UPDATE)
  // ---------------------------------------------------------
  const handleSave = async (data: any) => {
    try {
      setLoading(true);

      const res = await fetch("/api/pos/gen_ledg/gl_bals", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const out = await res.json();

      if (out.success) {
        setMessage("✓ Branch G/L Created successfully");
//        if (!isExisting) reset();
      } else {
        setMessage("⚠ " + out.message);
      }
    } catch (err) {
      console.error("Save Error:", err);
      setMessage("⚠ Failed to Ctreat Branch G/L");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    reset();
    setBtnDisabled(true);
    setMessage("");
  };

  // ---------------------------------------------------------
  // JSX FORM
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen max-w-4xl bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 px-2 justify-items-center">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div
          className="mb-1 rounded-xl shadow-lg p-3 text-center"
          style={{
            background:
              "linear-gradient(135deg, #5EAF85FF 0%, #125F2FFF 50%, #4E45B1FF 100%)",
          }}
        >
          <h1 className="text-2xl font-bold text-white">
            Create Branch General Ledger
          </h1>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-xl shadow-lg px-8 py-2 border border-gray-200">
          <form onSubmit={handleSubmit(handleSave)} className="space-y-2">
            {/* ROW 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* GL CODE */}
              <div>
                <label className="labelClass">
                  GL Code <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("gl_cd")}
                  type="number"
                //  maxLength={5}
                  onBlur={(e) => checkGL(Number(e.target.value))}
                  className={`inputClass ${
                    errors.gl_cd ? inputErrorClass : ""
                  }`}
                  placeholder="Enter GL Code"
                />
                {errors.gl_cd && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.gl_cd.message}
                  </p>
                )}
              </div>

              {/* GL DESC */}
              <div className="md:col-span-2">
                <label className="labelClass">
                  GL Description <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("gl_desc")}
                  className={`inputClass ${
                    errors.gl_desc ? inputErrorClass : ""
                  }`}
                  placeholder="G/L description"
                  disabled
                />
                {errors.gl_desc && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.gl_desc.message}
                  </p>
                )}
              </div>
            </div>
            {/* Branch Code & Desc */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div>
                <label className="labelClass">
                  Branch: <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("brn_cd")}
                  type="number"
                  maxLength={3}
                  onBlur={(e) => getGl_Bal(Number(e.target.value), gl_code)}
                  className={`inputClass ${
                    errors.gl_cd ? inputErrorClass : ""
                  }`}
                  placeholder="Enter Branch Code"
                />
                {errors.gl_cd && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.gl_cd.message}
                  </p>
                )}
              </div>

              {/* Brn Name */}
              <div className="md:col-span-2">
                <label className="labelClass">
                  Branch Name: <span className="text-red-500">*</span>
                </label>
                <input
                  value= {br_name}
                  className={`inputClass ${
                    errors.gl_desc ? inputErrorClass : ""
                  }`}
                  placeholder="Branch Name"
                  disabled
                />
                {errors.gl_desc && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.gl_desc.message}
                  </p>
                )}
              </div>
            </div>
            {/* ROW 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type */}
              {/* <div>
                <label className="labelClass">
                  Type <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("gl_type")}
                  className={`inputClass ${
                    errors.gl_type ? inputErrorClass : ""
                  }`}
                />
              </div> */}

              {/* <div>
                <label className="labelClass">
                  GL Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("gl_type")}
                  className={`inputClass ${
                    errors.gl_type ? inputErrorClass : ""
                  }`}
                >
                  <option value="">Select Status</option>
                  <option value="CUS">Customer</option>
                  <option value="GL">Genral Ledger</option>
                </select>
              </div> */}


              {/* Status */}
              {/* <div>
                <label className="labelClass">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("gl_stat")}
                  className={`inputClass ${
                    errors.gl_stat ? inputErrorClass : ""
                  }`}
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div> */}
            </div>

            {/* ROW 4 BALANCES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Opening Balance */}
              <div>
                <label className="labelClass">
                  Opening Balance <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("yy_op_bal")}
                  type="number"
                  className={`inputClass ${
                    errors.yy_op_bal ? inputErrorClass : ""
                  }`}
                  readOnly
                />
              </div>

              {/* Current Balance */}
              <div>
                <label className="labelClass">
                  Current Balance <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("curr_bal")}
                  type="number"
                  className={`inputClass ${
                    errors.curr_bal ? inputErrorClass : ""
                  }`}
                  readOnly  
                />
              </div>

              {/* Hidden Field */}
              <input {...register("inp_by")} type="hidden" value="Admin" />
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                disabled={btnDisabled}
                type="submit"
//                onClick={handleSave}
                className="flex-1 bg-green-600 text-white px-2 py-1 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50"
              >
                Create Branch GL
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="flex-1 border-2 border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
        {/* MESSAGE */}
        {message && (
          <div
            className={`mb-4 rounded-lg px-6 py-4 border-l-4 shadow-sm ${
              message.includes("✓")
                ? "bg-green-50 border-green-500 text-green-800"
                : message.includes("→")
                ? "bg-blue-50 border-blue-500 text-red-500"
                : "bg-yellow-50 border-yellow-500 text-red-500"
            }`}
          >
            {message}
          </div>
        )}


        {/* <div className="mt-6 text-center text-sm text-gray-600">
          <p>💡 Enter GL Code and press TAB to load existing record</p>
        </div> */}
      </div>
    </div>
  );
}
