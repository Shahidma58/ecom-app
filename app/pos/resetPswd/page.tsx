"use client";

import { gVars } from "@/app/app.config";
import Head from "next/head";
import { useState, useRef, useEffect } from "react";

export default function ResetPswdPage() {
  const [formData, setFormData] = useState({
    usr_id: "",
    new_pswd: "",
    brn_cd: gVars.gBrn_Cd
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confPswd, setConfPswd] = useState("");
  const [user_name, setUser_Name] = useState("");
  const [br_name, setBr_Name] = useState("Ground Floor");
  
  const user_Idref = useRef<HTMLInputElement>(null);
  const pass_ref = useRef<HTMLInputElement>(null);
  const confPass_ref = useRef<HTMLInputElement>(null);

  // Fix: Only run once on mount
  useEffect(() => {
    user_Idref.current?.focus();
  }, []); // Empty dependency array

  //======================================================
  const handleUserIdBlur = async () => {
    // Remove e.preventDefault() - not needed for onBlur
    if (!formData.usr_id.trim()) {
      setMessage("Err: User ID is required....");
      user_Idref.current?.focus();
      return;
    }

    if (formData.usr_id === gVars.gUser) {
      setMessage("Err: You cannot reset your own password");
      setFormData(prev => ({ ...prev, usr_id: "" }));
      user_Idref.current?.focus();
      return;
    }
//    setIsLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/users/${formData.usr_id}`);
      const data = await res.json();
      
      if (data.success) {
        setUser_Name(data.data.usr_name || "");
        setMessage("Inf: User found ✔");
        setTimeout(() => setMessage(""), 1500);
        pass_ref.current?.focus();
      } else {
        setMessage("Err: User not found");
        setUser_Name("");
        user_Idref.current?.focus();
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setMessage("Err: Error fetching user");
      setUser_Name("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.usr_id.trim()) {
      setMessage("Err: User ID is required");
      user_Idref.current?.focus();
      return;
    }

    if (!formData.new_pswd.trim()) {
      setMessage("Err: New Password is required");
      pass_ref.current?.focus();
      return;
    }

    if (!confPswd.trim()) {
      setMessage("Err: Please confirm password");
      return;
    }

    if (formData.new_pswd !== confPswd) {
      setMessage("Err: Passwords do not match!");
      setConfPswd("");
      pass_ref.current?.focus();
      return;
    }

    if (formData.new_pswd.length < 6) {
      setMessage("Err: Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const url = `/api/users/chng_pswd/${formData.usr_id}`;
    const payload = {
      usr_id: formData.usr_id,
      new_pswd: formData.new_pswd,
      brn_cd: formData.brn_cd,
    };

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Inf: Password updated successfully! ✔");
        setTimeout(() => {
          handleClear();
        }, 2000);
      } else {
        setMessage("err: " + data.message || "Error updating password");
      }
    } catch (err) {
      console.error("Err: Error submitting form:", err);
      setMessage("Err: Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      usr_id: "",
      new_pswd: "",
      brn_cd: gVars.gBrn_Cd
    });
    setConfPswd("");
    setUser_Name("");
    setMessage("");
    setShowPassword(false);
    user_Idref.current?.focus();
  };
//
  const chk_conf_pswd = () => {
    if (confPswd != formData.new_pswd) {
      setMessage("Err: Password not confirmed....")
      confPass_ref.current?.focus();
    }
  }
const handleconfPass = (value: string) => {
  setConfPswd(value);
};
  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>

      <div className="border-2 min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-4 px-2">
        <div className="max-w-2xl mx-auto">
          <header className="mb-1 rounded-lg shadow-md p-2 text-center bg-linear-to-r from-green-600 via-emerald-600 to-teal-600">
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Reset Password
            </h1>
          </header>

          <main className="bg-white rounded-lg shadow-lg border border-gray-200 px-2 py-3">
            <form className="space-y-2" onSubmit={handleSubmit}>
              {/* User ID */}
              <div className="grid grid-cols-[2fr_2fr_5fr] gap-2 items-center">
                <div>
                  User ID:<span className="text-red-500">*</span>
                </div>
                <div>
                  <input
                    ref={user_Idref}
                    type="text"
                    name="usr_id"
                    value={formData.usr_id}
                    onChange={handleChange}
                    onBlur={handleUserIdBlur}
                    className="w-32 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={user_name}
                    disabled
                    placeholder="User name will appear here"
                    className="w-full border border-black rounded px-3 py-2 text-sm bg-gray-100"
                  />
                </div>
              </div>

              {/* Branch Code */}
              <div className="grid grid-cols-[2fr_2fr_5fr] gap-2 items-center">
                <div>Branch Code:</div>
                <div>
                  <input
                    type="text"
                    name="brn_cd"
                    value={formData.brn_cd}
                    readOnly
                    className="w-32 border border-black rounded px-3 py-2 text-sm bg-gray-100"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={br_name}
                    disabled
                    className="w-full border border-black rounded px-3 py-2 text-sm bg-gray-100"
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>
                  New Password:<span className="text-red-500">*</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    ref={pass_ref}
                    type={showPassword ? "text" : "password"}
                    name="new_pswd"
                    minLength={6}
                    maxLength={20}
                    value={formData.new_pswd}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className="w-40 border border-black rounded px-3 py-2 text-sm focus:ring-green-500 mx-3"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="h-9 w-9 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow-md"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>
                  Confirm Pswd:<span className="text-red-500">*</span>
                </div>
                <div>
                  <input
                    ref={confPass_ref}
                    type={showPassword ? "text" : "password"}
                    minLength={6}
                    maxLength={20}
                    name="conf_pswd"
                    value={confPswd}
                    onBlur={chk_conf_pswd}
                    onChange={(e) => handleconfPass(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-40 border border-black rounded px-3 py-2 text-sm focus:ring-green-500 mx-3"
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-center pt-2 border-t border-gray-300 mt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-50 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition-all disabled:opacity-50"
                >
                  💾 {isLoading ? "Processing..." : "Save Password"}
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isLoading}
                  className="w-50 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition-all disabled:opacity-50"
                >
                  🧹 Clear
                </button>
              </div>
            </form>

            {/* Message */}
            {message && (
              <div className={`mt-3 text-center text-sm font-semibold animate-pulse ${
//                message.includes("Err: ") || message.includes("✔") || message.includes("found")
                message.includes("Err: ")
                  ? "text-red-600" 
                  : "text-emerald-700"
              }`}>
                {message}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}