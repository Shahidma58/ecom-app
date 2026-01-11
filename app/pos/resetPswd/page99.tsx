"use client";

import { gVars } from "@/app/app.config";
import Head from "next/head";
import { useState, useRef, useEffect } from "react";

export default function resetPswdPage() {
  const [formData, setFormData] = useState({
    usr_id: gVars.gUser,
    new_pswd: "",
    brn_cd: gVars.gBrn_Cd
  });

 // const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confPswd, setConfPswd] = useState("");
  const [user_name, setUser_Name] = useState("");
  const [br_name, setBr_Name] = useState("Ground Floor");
  const user_Idref = useRef<HTMLInputElement>(null);
  const pass_ref = useRef<HTMLInputElement>(null);
//=================================================
  const handleConfPswd = (conf_pswd: string) => {
    setConfPswd(conf_pswd);
  }
    useEffect(() => {
      user_Idref.current?.focus();
    });
  //======================================================
  const handleUserIdBlur = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.usr_id.trim()) {
      setMessage("User ID is required....");
      user_Idref.current?.focus();
      return;
    }
    if (!formData.usr_id) return;
    if (formData.usr_id == gVars.gUser) {
      setMessage("Err: You can not reset you own password");
      user_Idref.current?.focus();
      return;
    }
    setIsLoading(true);
    setMessage("");
    try {
    console.log("fffffffffffff");
      const res = await fetch(`/api/users/${formData.usr_id}`);
      const data = await res.json();
      if (data.success) {
        // setFormData({
        //   ...data.data,
        //   password: "", 
        // });
        console.log(data.data);
        setUser_Name(data.data.usr_name);
        pass_ref.current?.focus();
      }
    } catch (err) {
      console.error("Error fetching user:", err);
//      setIsEdit(false);
      setMessage("Error fetching user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
//    console.log('Submitt.........');
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    if (!formData.new_pswd.trim()) {
      setMessage("New Passowrd is Blank...");
      return;
    }
    // console.log(isOPValid);
    // console.log(isPswdConf);
    // console.log(formData.new_pswd);
    // console.log(oldPswd);

    // if (formData.new_pswd == confPswd & formData.usr_id) {
    // } else {
    //   setMessage("Password Can't be Changed....");
    //   return;
    // }
    const method = "PUT";
    const url = `/api/users/chng_pswd/${formData.usr_id}`;
    const payload = {
      ...formData,
    };
    payload.new_pswd = formData.new_pswd;
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("User updated successfully!");
        setTimeout(() => setMessage(""), 2000);
        handleClear();
      } else {
        setMessage(data.message || "Error saving user");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setMessage("Network error occurred");
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
//    setIsEdit(false);
    setMessage("");
    setShowPassword(false);
  };

  return (
    <>
      <Head>
        <title>Users Management</title>
      </Head>

      <div className="border-2 min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-4 px-2">
        <div className="max-w-2xl mx-auto">
          <header className="mb-1 rounded-lg shadow-md p-2 text-center bg-linear-to-r from-green-600 via-emerald-600 to-teal-600">
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Reset Password
            </h1>
          </header>

          <main className="bg-white rounded-lg shadow-lg border border-gray-200 px-2">
            <form className="space-y-1" onSubmit={handleSubmit}>
              {/* User ID */}
              <div className="grid grid-cols-[2fr_2fr_6fr] gap-2 items-center">
                <div>
                  User ID:<span className="text-red-500">*</span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    ref={user_Idref}
                    type="text"
                    name="usr_id"
                    value={formData.usr_id}
                    onChange={handleChange}
//                    onChange={handleChange}
                    onBlur={handleUserIdBlur}
                    className="w-32 border border-black rounded px-3 py-2 text-sm focus:ring-green-500 disabled:bg-gray-200"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="usr_name"
                    maxLength={35}
                    value={user_name}
//                    onChange={handleChange}
                    className="w-80 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
//                    required
                    disabled
                  />
                </div>
              </div>
              {/* Branch Code */}
              {/* User ID */}
              <div className="grid grid-cols-[2fr_2fr_6fr] gap-2 items-center">
                <div>
                  Branch Code:
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    name="brn_cd"
                    value={formData.brn_cd}
//                    onChange={handleChange}
//                    onBlur={handleUserIdBlur}
//                    disabled={isEdit}
                    className="w-25 border border-black rounded px-3 py-2 text-sm focus:ring-green-500 disabled:bg-gray-200"
                    required
                    readOnly
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="usr_name"
                    // maxLength={35}
                    value={br_name}
//                    onChange={handleChange}
                    className="w-80 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
                    disabled
                    readOnly
                  />
                </div>
              </div>
            {/* new Pswd */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>
                  New Password <span className="text-red-500">*</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    ref={pass_ref}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.new_pswd}
                    onChange={handleChange}
                    placeholder="Enter New password"
                    className="w-80 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
                    required
//                    autoComplete="new-password"
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
              {/* Conf-Pswd */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>
                  Confirm Pswd <span className="text-red-500">*</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="conf_pswd"
                    value={confPswd}
                    onChange={(e) => handleConfPswd(e.target.value)}
                    placeholder="Confirm New password"
                    className="w-80 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
                    required
                    autoComplete="new-password"
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
              <div className="mt-3 text-center text-sm font-semibold text-red-500 animate-pulse">
                {message}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}