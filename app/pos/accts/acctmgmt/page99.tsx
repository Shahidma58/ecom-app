"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState } from "react";

  const schema = Yup.object({
    ac_no: Yup.number().required("Account No is required"),
    ac_gl: Yup.number().required("GL Code is required"),
    ac_title: Yup.string().required("Account Title is required"),
    ac_contact: Yup.string().required("Contact is required"),
    ac_addr: Yup.string().required("Address is required"),
    curr_bal: Yup.number().required("Current Balance required"),
    yy_op_bal: Yup.number().required("Opening Balance required"),
    ac_stat: Yup.string().required("Status required"),
  });
export default function AccountForm() {
  const [message, setMessage] = useState("");
  const [isExisting, setIsExisting] = useState(false);
  const [glDesc, setGlDesc] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema),
  });

  // 🔍 Check if account exists when user leaves ac_no field
  const checkAccount = async (ac_no: number) => {

    if (!ac_no) return;
    try {
//    alert('aaaaaaaaaaaaaaaa' + ac_no);
      const res = await fetch(`/api/pos/accts/get_acct/${ac_no}`);

      if (res.ok) {
        const data = await res.json();
//        setAccount(data.data || data);
        if (data.success && data.data) {
          const acct = data.data;
//console.log(acct.gen_ledg.gl_desc);        
          setGlDesc(acct.gen_ledg.gl_desc);
          setValue("ac_gl", acct.ac_gl);
          setValue("ac_title", acct.ac_title);
          setValue("ac_contact", acct.ac_contact);
          setValue("ac_addr", acct.ac_addr);
          setValue("curr_bal", acct.curr_bal);
          setValue("yy_op_bal", acct.yy_op_bal);
          setValue("ac_stat", acct.ac_stat);
          setIsExisting(true);
          setMessage("Existing account loaded for update");
        } else {
          reset({ ac_no });
          setIsExisting(false);
          setMessage("New account — please enter details");
        }
      }
    } catch (err) {
      console.error("Check account error:", err);
    }
  };

  // 💾 Save or Update
  const onSubmit = async (data: any) => {
    try {
      const res = await fetch("/api/pos/accts/save_acct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.success) {
        setMessage(isExisting ? "Account updated successfully!" : "New account created!");
        reset();
      } else {
        setMessage(result.message);
      }
    } catch (err) {
      console.error("Save error:", err);
      setMessage("Failed to save account");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-green-700 mb-4 text-center">Account Creation / Update</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex">
            <label className="block text-sm font-semibold pr-4">Account No:</label>
            <input
              type="number"
              {...register("ac_no")}
              onBlur={(e) => checkAccount(Number(e.target.value))}
              className=" w-[100px] border border-gray-300 rounded-md p-2"
            />
            <p className="text-red-500 text-sm">{errors.ac_no?.message}</p>

            <div>
              {/* <label className="block text-sm font-semibold">Account Title</label> */}
              <input {...register("ac_title")} type="text" className="w-full border rounded-md p-2" />
              <p className="text-red-500 text-sm ml-4">{errors.ac_title?.message}</p>
            </div>

            {/* <input className="ml-4 w-full border rounded-md" 
              type="text" 
              value=  {glDesc}
              disabled
            />                 */}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className='flex'>
              <label className="block text-sm font-semibold">GL Code</label>
              <input {...register("ac_gl")} type="number" className="w-full border rounded-md p-2" />
              <p className="text-red-500 text-sm">{errors.ac_gl?.message}</p>

              {/* <label className="block text-sm font-semibold">Description: </label>*/}
              <input className="w-full border rounded-md p-2" 
                type="text" 
                value=  {glDesc}
                disabled
                />                 
            </div>
            {/* <div>
              <label className="block text-sm font-semibold">Account Title</label>
              <input {...register("ac_title")} type="text" className="w-full border rounded-md p-2" />
              <p className="text-red-500 text-sm">{errors.ac_title?.message}</p>
            </div> */}
          </div>
          <div  className='flex'>
            <div>
              <label className="block text-sm font-semibold">Contact</label>
              <input {...register("ac_contact")} type="text" className="w-full border rounded-md p-2" />
              <p className="text-red-500 text-sm">{errors.ac_contact?.message}</p>
            </div>
            <div>
            <label className="block text-sm font-semibold">Status</label>
            <select {...register("ac_stat")} className="w-full border rounded-md p-2">
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <p className="text-red-500 text-sm">{errors.ac_stat?.message}</p>
            </div>

          </div>
          <div>
            <label className="block text-sm font-semibold">Address</label>
            <textarea {...register("ac_addr")} className="w-full border rounded-md p-2" />
            <p className="text-red-500 text-sm">{errors.ac_addr?.message}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold">Current Balance</label>
              <input {...register("curr_bal")} type="number" step="0.01" className="w-full border rounded-md p-2" />
              <p className="text-red-500 text-sm">{errors.curr_bal?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold">Opening Balance</label>
              <input {...register("yy_op_bal")} type="number" step="0.01" className="w-full border rounded-md p-2" />
              <p className="text-red-500 text-sm">{errors.yy_op_bal?.message}</p>
            </div>
          </div>


          <div className="text-center">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
            >
              {isExisting ? "Update Account" : "Create Account"}
            </button>
          </div>
        </form>

        {message && <p className="mt-4 text-center text-green-700 font-semibold">{message}</p>}
      </div>
    </div>
  );
}
