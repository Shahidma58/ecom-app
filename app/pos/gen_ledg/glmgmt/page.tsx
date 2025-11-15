"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState } from "react";
import "../../../../app/globals.css";

// ✅ YUP Schema
const schema = Yup.object({
  gl_cd: Yup.number().required("GL Code is required"),
  gl_desc: Yup.string().required("Description is required"),
  gl_sdesc: Yup.string().optional(),
  gl_cat: Yup.string().required("Category is required"),
  gl_type: Yup.string().required("Type is required"),
  yy_op_bal: Yup.number().required("Opening Balance is required"),
  curr_bal: Yup.number().required("Current Balance is required"),
  gl_stat: Yup.string().required("Status is required"),
  inp_by: Yup.string().optional(),
});

export default function GenLedgForm() {
  const [message, setMessage] = useState("");
  const [isExisting, setIsExisting] = useState(false);
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
      const res = await fetch(`/api/pos/gen_ledg/${gl_cd}`);

      const data = await res.json();

      if (data.success && data.data) {
        const gl = data.data;

        // fill form
        setValue("gl_desc", gl.gl_desc);
        setValue("gl_sdesc", gl.gl_sdesc || "");
        setValue("gl_cat", gl.gl_cat);
        setValue("gl_type", gl.gl_type);
        setValue("yy_op_bal", gl.yy_op_bal);
        setValue("curr_bal", gl.curr_bal);
        setValue("gl_stat", gl.gl_stat);
        setValue("inp_by", "Admin");

        setIsExisting(true);
        setMessage("✓ Existing GL loaded for update");
      } else {
        reset({ gl_cd });
        setIsExisting(false);
        setMessage("→ New GL — please enter details");
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
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const res = await fetch("/api/pos/gen_ledg/save_acct", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const out = await res.json();

      if (out.success) {
        setMessage(
          isExisting
            ? "✓ GL updated successfully"
            : "✓ New GL created successfully"
        );

        if (!isExisting) reset();
      } else {
        setMessage("⚠ " + out.message);
      }
    } catch (err) {
      console.error("Save Error:", err);
      setMessage("⚠ Failed to save GL");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    reset();
    setIsExisting(false);
    setMessage("");
  };

  // ---------------------------------------------------------
  // JSX FORM
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div
          className="mb-4 rounded-xl shadow-lg p-3 text-center"
          style={{
            background:
              "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)",
          }}
        >
          <h1 className="text-3xl font-bold text-white">
            General Ledger Management
          </h1>
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            className={`mb-4 rounded-lg px-6 py-4 border-l-4 shadow-sm ${
              message.includes("✓")
                ? "bg-green-50 border-green-500 text-green-800"
                : message.includes("→")
                ? "bg-blue-50 border-blue-500 text-blue-800"
                : "bg-yellow-50 border-yellow-500 text-yellow-800"
            }`}
          >
            {message}
          </div>
        )}

        {/* FORM */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  placeholder="Enter description"
                />
                {errors.gl_desc && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.gl_desc.message}
                  </p>
                )}
              </div>
            </div>

            {/* ROW 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Short Desc */}
              <div>
                <label className="labelClass">Short Description</label>
                <input
                  {...register("gl_sdesc")}
                  className="inputClass"
                  placeholder="Optional short desc"
                />
              </div>

              {/* Category */}
              <div>
                <label className="labelClass">
                  Category <span className="text-red-500">*</span>
                </label>
                {/* <input
                  {...register("gl_cat")}
                  className={`inputClass ${
                    errors.gl_cat ? inputErrorClass : ""
                  }`}
                  placeholder="Assets / Liabilities / Equity / Revenue / Expense"
                /> */}

                <select
                  {...register("gl_cat")}
                  className={`inputClass ${
                    errors.gl_type ? inputErrorClass : ""
                  }`}
                >
                  <option value="">Select Status</option>
                  <option value="AST">Assets</option>
                  <option value="EXP">Expenses</option>
                  <option value="LIA">Liabilities</option>
                  <option value="CAP">Capital</option>
                  <option value="INC">Income</option>
                </select>

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

              <div>
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
                  {/* <option value="INC">Active</option>
                  <option value="AST">Active</option>
                  <option value="EXP">Inactive</option> */}
                </select>
              </div>


              {/* Status */}
              <div>
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
              </div>
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
                />
              </div>

              {/* Hidden Field */}
              <input {...register("inp_by")} type="hidden" value="Admin" />
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                disabled={loading}
                type="submit"
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : isExisting
                  ? "Update GL"
                  : "Create GL"}
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

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>💡 Enter GL Code and press TAB to load existing record</p>
        </div>
      </div>
    </div>
  );
}
