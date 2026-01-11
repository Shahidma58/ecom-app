"use client";

import { gVars } from "@/app/app.config";
import { CornerDownLeft } from "lucide-react";
import Head from "next/head";
import { useState, useRef, useEffect } from "react";

export default function chngPswdPage() {
  const [formData, setFormData] = useState({
    usr_id: 'Amena1', //gVars.gUser,
    new_pswd: "",
    brn_cd: gVars.gBrn_Cd,
  });
  let wErr = 0;
  const [isPswdConf, setIsPswdConf] = useState(false);
  const [isOPValid, setIsOPValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [oldPswd, setOldPswd] = useState("");
  const [confPswd, setConfPswd] = useState("");
  const [user_name, setUser_Name] = useState("");
  const [br_name, setBr_Name] = useState("Ground-Floor");
  // Fetch user when usr_id loses focus
  const user_Idref = useRef<HTMLInputElement>(null);
  const pass_ref = useRef<HTMLInputElement>(null);
  const oldpass_ref = useRef<HTMLInputElement>(null);
  const confPass_ref = useRef<HTMLInputElement>(null);
//      user_Idref.current?.focus();
  //=====================================================
  // Only run once on mount
  useEffect(() => {
    user_Idref.current?.focus();
  }, []);
  //===============================  
  const handleClear = () => {
    setFormData({
      usr_id: gVars.gUser,
      new_pswd: "",
      brn_cd: gVars.gBrn_Cd
    });
    setShowPassword(false);
    setIsPswdConf(false);
    setIsOPValid(false);
    setMessage("");
    setOldPswd("");
    setConfPswd("");
  };
//=================================================
  const handleUserIdBlur = async () => {
    if (!formData.usr_id) return;
    setIsLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/users/${formData.usr_id}`);
      const data = await res.json();
      if (data.success) {
        // setFormData({
        //   ...data.data,
        //   password: "", 
        // });
        console.log(data.data);
        setUser_Name(data.data.usr_name);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
//      setIsEdit(false);
      setMessage("Err: Error fetching user");
    } finally {
      setIsLoading(false);
    }
  };
  const handleOldPswd = (old_pswd: string) => {
    setOldPswd(old_pswd);
  }
  const handleConfPswd = (conf_pswd: string) => {
    setConfPswd(conf_pswd);
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
//   console.log('Submitt.........');
//   user_Idref.current?.focus();
    setMessage("");
    e.preventDefault();
    if (oldPswd.trim() =="" || !isOPValid) {
      setMessage("Err: Invalid Old Password...")
      oldpass_ref.current?.focus()
      return;
    }
    if (formData.new_pswd.trim() =="" || oldPswd==formData.new_pswd) {
      setMessage("Err: Invalid/Same New Password...")
      pass_ref.current?.focus()
      return;
    }
    if (confPswd.trim() =="" || confPswd!=formData.new_pswd) {
      setMessage("Err: New Password not confirmed...")
      pass_ref.current?.focus()
      return;
    }

    if (!isPswdConf) {
      setMessage("Err: Password not Confirmed....");
      return;
    }

    setIsLoading(true);
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
        setMessage("Inf: User updated successfully!");
        setTimeout(() => setMessage(""), 2000);
        handleClear();
      } else {
        setMessage("Err: Error saving user");
      }
    } catch (err) {
      console.error("Err: Error submitting form:", err);
      setMessage("Err: Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };
//===================  Check new Password =========
  const chk_new_pswd = (e: React.FormEvent) => {
    setMessage("");
    if (formData.new_pswd == oldPswd) {
      setMessage("Err: New Pswd is same as Current Pswd");
      pass_ref.current?.focus();
    }
  };
//===================  Check Conf Password =====================
  const chk_conf_pswd = (e: React.FormEvent) => {
    setMessage("");
    if (formData.new_pswd == confPswd && formData.new_pswd != oldPswd) {
      setIsPswdConf(true);
    } else {
      setMessage("Err: New Pswd not Valid/Confirmed...");
      setIsPswdConf(false);
      confPass_ref.current?.focus();
    }
  };
  //===================  Validate Password =======================
  const val_curr_pswd = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!oldPswd) {
      setMessage("Err: Invalid Current Passwors");
      return;
    }
    setIsLoading(true);
    setIsOPValid(false);
    try {
      const res = await fetch("/api/users/val_pswd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: formData.usr_id,
          password: oldPswd,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage("Err: " + data.error || "Err: Error validating password");
        return;
      }
      // success
      setIsOPValid(true);
      setMessage("Current password validated successfully! ✔");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Err: Error validating password:", err);
      setMessage("Err: Network error occurred");
    } finally {
      setIsLoading(false);
    }
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
              Change Own Password
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
//                    onChange={handleChange}
                    onBlur={handleUserIdBlur}
//                    disabled={isEdit}
                    className="w-32 border border-black rounded px-3 py-2 text-sm focus:ring-green-500 disabled:bg-gray-200"
                    required
                    readOnly
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
                    disabled
                    readOnly
                  />
                </div>
              </div>
              {/* Branch Code */}
              <div className="grid grid-cols-[2fr_2fr_6fr] gap-2 items-center">
                <div>
                  Branch Code:
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    name="brn_cd"
                    value={formData.brn_cd}
                    className="w-25 border border-black rounded px-3 py-2 text-sm focus:ring-green-500 disabled:bg-gray-200"
                    disabled
                    readOnly
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="br_name"
                    // maxLength={35}
                    value={br_name}
//                    onChange={handleChange}
                    className="w-80 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
                    disabled
                    readOnly
                  />
                </div>
              </div>
              {/* old Password */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>
                  Old Password <span className="text-red-500">*</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    ref={oldpass_ref}
                    type={showPassword ? "text" : "password"}
                    name="old_pswd"
                    value={oldPswd}
                    onChange={(e) => handleOldPswd(e.target.value)}
                    onBlur={val_curr_pswd}
                    placeholder="Enter current Password"
                    className="w-80 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
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
              {/* new Pswd */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>
                  New Password <span className="text-red-500">*</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    ref={pass_ref}
                    type={showPassword ? "text" : "password"}
                    name="new_pswd"
                    value={formData.new_pswd}
                    onChange={handleChange}
                    onBlur={chk_new_pswd}
                    placeholder="Enter New password"
                    className="w-80 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>
              {/* Conf-Pswd */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>
                  Confirm Pswd <span className="text-red-500">*</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    ref={confPass_ref}
                    type={showPassword ? "text" : "password"}
                    name="conf_Pswd"
                    value={confPswd}
                    onChange={(e) => handleConfPswd(e.target.value)}
                    onBlur={chk_conf_pswd}
                    placeholder="Confirm New password"
                    className="w-80 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
                    required
                  />
                </div>
              </div>
             {/* Buttons */}
              <div className="flex gap-3 justify-center pt-2 border-t border-gray-300 mt-2">
                <button
                  type="submit"
//                  disabled={!isValid}
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
