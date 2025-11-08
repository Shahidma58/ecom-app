"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "../../zu_store/cartStore";

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, clearCart, totalAmount } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = totalAmount();
  const shippingCost = 200;
  const total = subtotal + shippingCost;

//  const seq_params = [{trn_dt : 25142, mod_id : "CART"} ]
  const [form, setForm] = useState({
    cart_id: 0,
    cust_email: "Sahidma98@gmail.com",
    cust_mbl: "123456789",
    cust_fname: "Shahid",
    cust_lname: "Alam",
    cust_addr_1: "87-N/1 Wapda Town, Phase-II ",
    cust_addr_2: "75000",
    cust_city: "Lahore City",
    cust_ctry: "Pakitan",
    cust_comp: "AI-Excellence",
    inp_by: 'Admin-1',
    tot_amt: total,
    tot_tax: 0,
    tot_itms: cartItems.length,    // NOT Array count but sum of qty
    cart_stat: 'PLACED',
    dlvy_chgs: 200,
  });


  const inputClass =
    "border border-gray-300 rounded-md p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-400";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      // Step 1: Create Cart
     const cartPayload = {
        cartInfo: form,
        cartItems,
        totals: { subtotal, shippingCost, total },
        //--------Cart_Seq replace table name
        seq_params: { trn_dt : 25304}
      };
//console.log(cartPayload)
console.log("creating a cart----------");

      const cartResponse = await fetch("/api/ecom/save_cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartPayload),
      });

      if (!cartResponse.ok) {
        throw new Error("Failed to create cart");
      }

      // const cartResult = await cartResponse.json();
      // const cart_id = cartResult.cartData.cart_id;

      // Step 2: Create Cart Details
      // const detailsPayload = {
      //   cartId: cart_id,
      //   cartItems: cartResult.cartItems || cartItems,
      // };

      // const detailsResponse = await fetch("/ecom/api/carts", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(detailsPayload),
      // });

      // if (!detailsResponse.ok) {
      //   throw new Error("Failed to create cart details");
      // }

      // Clear cart after successful order
      clearCart();

//      router.push(`/orderDetails?orderNumber=${cart_id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      setError(error instanceof Error ? error.message : "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-10 flex flex-col md:flex-row gap-10">
      {/* Left Section - Shipping & Payment */}
      <div className="flex-1 max-w-3xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            name="email"
            type="email"
            value={form.cust_email}
            placeholder="Email"
            className={inputClass}
            onChange={handleInputChange}
          />
          <input
            name="phone"
            type="text"
            value={form.cust_mbl}
            placeholder="Contact Number"
            className={inputClass}
            onChange={handleInputChange}
          />
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-4">Shipping Address</h2>

        {/* First + Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            value={form.cust_fname}
            className={inputClass}
            onChange={handleInputChange}
          />
          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={form.cust_lname}
            className={inputClass}
            onChange={handleInputChange}
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <input
            name="address"
            type="text"
            value={form.cust_addr_1}
            placeholder="Address-1"
            className={inputClass + " mb-4"}
            onChange={handleInputChange}
          />
        </div>


        {/* Country, City, Postal Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            name="city"
            type="text"
            placeholder="City"
            value={form.cust_city}
            className={inputClass}
            onChange={handleInputChange}
          />
          <input
            name="postalCode"
            type="text"
            placeholder="Postal Code"
            value={form.cust_addr_2}
            onChange={handleInputChange}
            className={inputClass}
          />
          <input
            name="country"
            type="text"
            placeholder="Country"
            value={form.cust_ctry}
            className={inputClass}
            onChange={handleInputChange}
          />

        </div>

        <h2 className="text-xl font-semibold mt-6 mb-4">Shipping Method</h2>
        <div className="border border-gray-300 p-4 rounded-md mb-4 text-sm">
          <label className="flex justify-between">
            <span>Standard</span>
            <span>Rs {shippingCost}.00</span>
          </label>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-4">Payment</h2>
        <div className="space-y-4 text-sm">
          <label className="block border border-gray-300 p-4 rounded-md">
            <input type="radio" name="payment" defaultChecked />
            <span className="ml-2">
              Safepay Checkout - pay with debit & credit cards
            </span>
          </label>
          <label className="block border border-gray-300 p-4 rounded-md">
            <input type="radio" name="payment" />
            <span className="ml-2">Cash on Delivery (COD)</span>
          </label>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-4">Billing Address</h2>
        <div className="space-y-2 text-sm">
          <label className="block border border-gray-300 p-4 rounded-md">
            <input type="radio" name="billing" defaultChecked />
            <span className="ml-2">Same as shipping address</span>
          </label>
          <label className="block border border-gray-300 p-4 rounded-md">
            <input type="radio" name="billing" />
            <span className="ml-2">Use a different billing address</span>
          </label>
        </div>
      </div>

      {/* Right Section - Order Summary */}
      <div className="w-full md:w-1/3 border border-gray-300 rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.prd_cd} className="flex gap-4 mb-4">
              <div className="relative w-16 h-16">
                <img
                  src={`/${item.prd_img_lnk}`}
                  alt={item.prd_desc}
                  className="w-full h-full object-cover rounded"
                />
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.prd_qty}
                </span>
              </div>
              <div>
                <p className="font-medium">{item.prd_desc}</p>
              </div>
              <div className="ml-auto font-semibold">
                Rs {(item.tot_amt ?? item.prd_rsp * item.prd_qty).toFixed(2)}
              </div>
            </div>
          ))
        )}

        <hr className="my-4" />
        <div className="flex justify-between mb-2 text-sm">
          <span>Subtotal</span>
          <span>Rs {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2 text-sm">
          <span>Shipping</span>
          <span>Rs {shippingCost}.00</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-4">
          <span>Total (PKR)</span>
          <span>Rs {total.toFixed(2)}</span>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className={`w-full border mt-5 border-pink-400 text-pink-500 py-2 rounded font-semibold transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-pink-50"
          }`}>
          {loading ? "PROCESSING..." : "PLACE ORDER"}
        </button>
      </div>
    </div>
  );
}


  // const handlePosts =  async()=> {
    
  // const posts = [
  //   {
  //     "post_id": 101,
  //     "main_title": "Welcome to Prisma",
  //     "sub_title": "Intro Guide",
  //     "post_detl": "Learn how to use Prisma ORM easily.",
  //     "inp_by": "Admin"
  //   },
  //   {
  //     "post_id": 102,
  //     "main_title": "Next.js API Routes",
  //     "sub_title": "Backend Simplified",
  //     "post_detl": "Next.js makes building APIs simple.",
  //     "inp_by": "Editor"
  //   }
  // ];

      // const cartResponse = await fetch("/api/ecom/posts", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(posts),
      // });

  // }
