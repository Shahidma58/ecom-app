"use client";

import { gVars } from "@/app/app.config";
import Head from "next/head";
import { useState } from "react";

export default function UsersPage() {
  const [formData, setFormData] = useState({
    usr_id: "",
    usr_name: "",
    usr_email: "",
    usr_mbl: "",
    role_id: "",
    password: "",
    usr_stat: "Active",
    inp_by: gVars.gUser,
    brn_cd: gVars.gBrn_Cd,
  });

  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Fetch user when usr_id loses focus
  const handleUserIdBlur = async () => {
    if (!formData.usr_id) return;

    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/users/${formData.usr_id}`);
      const data = await res.json();

      if (data.success) {
        setFormData({
          ...data.data,
//          is_active: String(data.data.is_active), // Convert boolean to string
          password: "", // Don't show existing password
        });
        setIsEdit(true);
        setMessage("User found - Edit Mode ✔");
      } else {
        setIsEdit(false);
        setMessage("User not found - Create Mode");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setIsEdit(false);
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
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Validate password for new users
    if (!isEdit && !formData.password) {
      setMessage("Password is required for new users");
      setIsLoading(false);
      return;
    }

    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `/api/users/${formData.usr_id}` : `/api/users`;

    // Convert is_active back to boolean for API
    const payload = {
      ...formData,
//      is_active: formData.usr_stat,
    };
    if (formData.password) {
      payload.password = formData.password;
    }
    // Don't send password if it's empty during update
    // if (isEdit && !formData.password) {
    //   delete payload.password;
    // }

    // console.log(payload);
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(
          data.message ||
            (isEdit ? "User updated successfully!" : "User created successfully!")
        );
        setTimeout(() => setMessage(""), 2000);
        if (!isEdit) {
          handleClear();
        }
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
      usr_name: "",
      usr_email: "",
      usr_mbl: "",
      role_id: "",
      password: "",
      usr_stat: "Active", // String value
      inp_by: "admin",
      brn_cd: gVars.gBrn_Cd
    });
    setIsEdit(false);
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
              {isEdit ? "Update User Info" : "Add New User"}
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
                    type="text"
                    name="usr_id"
                    value={formData.usr_id}
                    onChange={handleChange}
                    onBlur={handleUserIdBlur}
                    disabled={isEdit}
                    className="w-32 border border-black rounded px-3 py-2 text-sm focus:ring-green-500 disabled:bg-gray-200"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="usr_name"
                    maxLength={35}
                    value={formData.usr_name}
                    onChange={handleChange}
                    className="w-80 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              {/* Branch Code */}
              {/* User ID */}
              <div className="grid grid-cols-[2fr_2fr_6fr] gap-2 items-center">
                <div>
                  Branch Code:<span className="text-red-500">*</span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    name="brn_cd"
                    value={formData.brn_cd}
                    onChange={handleChange}
                    onBlur={handleUserIdBlur}
                    disabled={isEdit}
                    className="w-25 border border-black rounded px-3 py-2 text-sm focus:ring-green-500 disabled:bg-gray-200"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="usr_name"
                    // maxLength={35}
                    // value={formData.usr_name}
                    onChange={handleChange}
                    className="w-80 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
                    required
                    disabled
                  />
                </div>
              </div>
              {/* Username */}
              {/* <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>
                  Username:<span className="text-red-500">*</span>
                </div>
              </div> */}

              {/* Email */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>
                  Email:<span className="text-red-500">*</span>
                </div>
                <div>
                  <input
                    type="email"
                    name="usr_email"
                    maxLength={50}
                    value={formData.usr_email}
                    onChange={handleChange}
                    placeholder="user@example.com"
                    className="w-80 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              {/* Password */}
              <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
                <div>
                  Password:{!isEdit && <span className="text-red-500">*</span>}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={
                      isEdit ? "Leave blank to keep current" : "Enter password"
                    }
                    className="w-80 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
                    required={!isEdit}
                    autoComplete="new-password"
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

              {/* Mobile */}
              <div className="grid grid-cols-[2fr_3fr_2fr_3fr] gap-2 items-center">
                <div>Mobile Number:</div>
                <div>
                  <input
                    type="tel"
                    name="usr_mbl"
                    maxLength={15}
                    value={formData.usr_mbl}
                    onChange={handleChange}
                    placeholder="+1234567890"
                    className="w-40 border border-black rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>Role:</div>
                                <div>
                  <select
                    name="usr_stat"
                    value={formData.role_id}
                    onChange={handleChange}
                    className="w-40 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
                  >
                    <option value="Teller">Teller</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

              </div>


              {/* User Status */}
              <div className="grid grid-cols-[2fr_3fr_2fr_3fr] gap-2 items-center">
                <div>User Status:</div>
                <div>
                  <select
                    name="usr_stat"
                    value={formData.usr_stat}
                    onChange={handleChange}
                    className="w-40 border border-black rounded px-3 py-2 text-sm focus:ring-green-500"
                  >
                    <option value="Active">🟢 Active</option>
                    <option value="Inactive">🔴 Inactive</option>
                  </select>
                </div>
              {/* Created By */}
                <div>Created By:</div>
                <div>
                  <input
                    type="text"
                    name="inp_by"
                    maxLength={20}
                    value={formData.inp_by}
                    onChange={handleChange}
                    className="w-40 border border-black rounded px-3 py-2 text-sm"
                    readOnly
                  />
                </div>

              </div>

              {/* <div className="grid grid-cols-[2fr_8fr] gap-2 items-center">
              </div> */}

              {/* Buttons */}
              <div className="flex gap-3 justify-center pt-2 border-t border-gray-300 mt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-50 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition-all disabled:opacity-50"
                >
                  💾 {isLoading ? "Processing..." : isEdit ? "Update" : "Save"}
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
              <div className="mt-3 text-center text-sm font-semibold text-emerald-700 animate-pulse">
                {message}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}