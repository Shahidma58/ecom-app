"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState } from "react";
import "../../../../app/globals.css";

const schema = Yup.object({
  ac_no: Yup.number().required("Account No is required"),
  ac_gl: Yup.number().required("GL Code is required"),
  ac_title: Yup.string().required("Account Title is required"),
  ac_contact: Yup.string().required("Contact is required"),
  ac_addr: Yup.string().required("Address is required"),
  curr_bal: Yup.number().required("Current Balance required"),
  yy_op_bal: Yup.number().required("Opening Balance required"),
  ac_stat: Yup.string().required("Status required"),
  inp_by: Yup.string().optional(),
});

export default function AccountForm() {
  const [message, setMessage] = useState("");
  const [isExisting, setIsExisting] = useState(false);
  const [glDesc, setGlDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // Shared input classes
  // const inputClass =
  //   "w-full border-1 border-black rounded-lg px-4 py-2.5 text-sm bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all";
  const inputErrorClass = "border-red-500 focus:ring-red-400 focus:border-red-400";
  // const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  // 🔍 Check if account exists when user leaves ac_no field
  const checkAccount = async (ac_no: number) => {
    if (!ac_no) return;
    
    try {
      setLoading(true);
      const res = await fetch(`/api/pos/accts/get_acct/${ac_no}`);

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          const acct = data.data;
          setGlDesc(acct.gen_ledg?.gl_desc || "Not FOund");
          setValue("ac_gl", acct.ac_gl);
          setValue("ac_title", acct.ac_title);
          setValue("ac_contact", acct.ac_contact);
          setValue("ac_addr", acct.ac_addr);
          setValue("curr_bal", acct.curr_bal);
          setValue("yy_op_bal", acct.yy_op_bal);
          setValue("ac_stat", acct.ac_stat);
          setValue("inp_by", "Admin");
          setIsExisting(true);
          setMessage("✓ Existing account loaded for update");
        } else {
          reset({ ac_no });
          setGlDesc("");
          setIsExisting(false);
          setMessage("→ New account — please enter details");
        }
      }
    } catch (err) {
      console.error("Check account error:", err);
      setMessage("⚠ Error checking account");
    } finally {
      setLoading(false);
    }
  };

  // 💾 Save or Update
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const res = await fetch("/api/pos/accts/save_acct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.success) {
        setMessage(
          isExisting
            ? "✓ Account updated successfully!"
            : "✓ New account created successfully!"
        );
        if (!isExisting) {
          reset();
          setGlDesc("");
        }
      } else {
        setMessage("⚠ " + result.message);
      }
    } catch (err) {
      console.error("Save error:", err);
      setMessage("⚠ Failed to save account");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    reset();
    setGlDesc("");
    setMessage("");
    setIsExisting(false);
  };

  return (
    <div 
    // className="min-h-screen max-w-4xl bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 py-2 px-1 justify-items-center"
    className="min-h-screen max-w-4xl py-2 px-1 justify-items-center"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div
          className="mb-1 rounded-xl shadow-lg p-1 text-center"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
          }}
        >
          <h1 className="text-2xl font-bold text-white mb-1">
            Account Management
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg pb-8 pt-2 border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            {/* Account Number & Title Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label className={`labelClass`}>
                  Account No <span className="text-red-500">*</span>
                </label>
                <input maxLength={6}
                  type="number"
                  {...register("ac_no")}
                  onBlur={(e) => checkAccount(Number(e.target.value))}
//                  className={`${inputClass} ${
                  className={`inputClass ${
                    errors.ac_no ? inputErrorClass : ""
                  }`}
                  placeholder="Enter account number"
                />
                {errors.ac_no && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.ac_no?.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={`labelClass`}>
                  Account Title <span className="text-red-500">*</span>
                </label>
                <input maxLength={35}
                  {...register("ac_title")}
                  type="text"
                  className={`inputClass ${
                    errors.ac_title ? inputErrorClass : ""
                  }`}
                  placeholder="Enter account title"
                />
                {errors.ac_title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.ac_title?.message}
                  </p>
                )}
              </div>
            </div>

            {/* GL Code & Description Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label className={`labelClass`}>
                  GL Code <span className="text-red-500">*</span>
                </label>
                <input maxLength={5}
                  {...register("ac_gl")}
                  type="number"
                  className={`inputClass ${
                    errors.ac_gl ? inputErrorClass : ""
                  }`}
                  placeholder="GL Code"
                />
                {errors.ac_gl && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.ac_gl?.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={`labelClass`}>GL Description</label>
                <input
                  type="text"
                  value={glDesc}
                  className="inputClass"
                  // className="w-full border border-black rounded-lg px-4 py-2.5 text-sm bg-gray-100 text-gray-600 focus:outline-none"
                  placeholder="GL Description"
                  disabled
                />
              </div>
            </div>
            {/* Address */}
            <div>
              <label className={`labelClass`}>
                Address <span className="text-red-500">*</span>
              </label>
              <input maxLength={64}
                {...register("ac_addr")}
                className={`inputClass resize-y ${
                  errors.ac_addr ? inputErrorClass : ""
                }`}
                placeholder="Enter complete address"
              />
              {errors.ac_addr && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.ac_addr?.message}
                </p>
              )}
            </div>


            {/* Contact & Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label className={`labelClass`}>
                  Contact <span className="text-red-500">*</span>
                </label>
                <input maxLength={15}
                  {...register("ac_contact")}
                  type="text"
                  className={`inputClass ${
                    errors.ac_contact ? inputErrorClass : ""
                  }`}
                  placeholder="Phone or email"
                />
                {errors.ac_contact && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.ac_contact?.message}
                  </p>
                )}
              </div>

              <div>
                <label className={`labelClass`}>
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("ac_stat")}
                  className={`inputClass ${
                    errors.ac_stat ? inputErrorClass : ""
                  }`}
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {errors.ac_stat && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.ac_stat?.message}
                  </p>
                )}
              </div>
              <div>
                <label className={`labelClass`}>
                  Current Balance <span className="text-red-500">*</span>
                </label>
                <input readOnly
                  {...register("curr_bal")}
                  type="number"
                //   step="0.01"
                  className={`inputClass ${
                    errors.curr_bal ? inputErrorClass : ""
                  }`}
                  placeholder="0"
                />
              </div>

            </div>

            {/* Balance Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* <div>
                <label className={`labelClass`}>
                  Current Balance <span className="text-red-500">*</span>
                </label>
                <input readOnly
                  {...register("curr_bal")}
                  type="number"
                  className={`inputClass ${
                    errors.curr_bal ? inputErrorClass : ""
                  }`}
                  placeholder="0"
                />
              </div> */}

              <div>
                {/* <label className={`labelClass`}>
                  Opening Balance <span className="text-red-500">*</span>
                </label> */}
                <input readOnly
                  {...register("yy_op_bal")}
                  type="number"
                //   step="0.01"
                  className={`inputClass ${
                    errors.yy_op_bal ? inputErrorClass : ""
                  }`}
                  placeholder="0"
                  hidden
                />

              </div>
                <input
                  {...register("inp_by")}
                  type="text"
                  className="hidden"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                // className="flex-1 bg-linear-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transform hover:scale-[1.02] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                className="btn-save h-10"
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
                    Processing...
                  </span>
                ) : isExisting ? (
                  "Update Account"
                ) : (
                  "Create Account"
                )}
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="btn-clear01 w-75 h-10"
                //  w-full md:w-auto
                // className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-blue-500"
              >
                Clear Form
              </button>
            </div>
          </form>
         {/* Message Alert */}
        {/* {message && (
          <div
            className={`mb-1 rounded-lg px-6 py-4 shadow-sm border-l-4 ${
              message.includes("✓")
                ? "bg-green-50 border-green-500 text-green-800"
                : message.includes("→")
                ? "bg-blue-50 border-blue-500 text-blue-800"
                : "bg-yellow-50 border-yellow-500 text-yellow-800"
            }`}
          >
            <p className="font-medium">{message}</p>
          </div>
        )} */}


        </div>

        {/* Help Text */}
        {/* <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            💡 <strong>Tip:</strong> Enter an account number and press Tab to load existing data
          </p>
        </div> */}
      </div>
    </div>
  );
}