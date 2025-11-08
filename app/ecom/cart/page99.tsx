"use client";

import { useSelector, useDispatch } from "react-redux";

import { removeFromCart, updateQuantity } from "../../../redux/slice/cartSlice";
import Image from "next/image";
import Link from "next/link";
import { RootState } from "@/redux/store";

export default function CartPage() {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const calculateTotal = () =>
    items.reduce((total, item) => total + item.max_rsp * item.quantity, 0);

  const handleQuantityChange = (prd_cd: number, delta: number) => {
    const item = items.find((item) => item.prd_cd === prd_cd);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);
    dispatch(updateQuantity({ prd_cd, quantity: newQuantity }));
  };

  const subtotal = items.reduce(
    (total, item) => total + item.max_rsp * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">YOUR CART</h1>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-gray-200">
              <div className="grid grid-cols-6 font-semibold p-4 bg-gray-100 text-sm">
                <span className="col-span-3">PRODUCT</span>
                <span className="text-center">PRICE</span>
                <span className="text-center">QUANTITY</span>
                <span className="text-right">TOTAL</span>
              </div>
              {items.map((item) => (
                <div
                  key={item.prd_cd}
                  className="grid grid-cols-6 items-center p-4 border-t">
                  <div className="col-span-3 flex items-center gap-4">
                    <Image
                      src={`/${item.prd_img_lnk}`}
                      alt={item.prd_desc}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                    <div>
                      <p className="font-semibold">{item.prd_desc}</p>
                      <p className="text-sm text-gray-500">120ml</p>
                    </div>
                  </div>
                  <p className="text-center">Rs.{item.max_rsp.toFixed(2)}</p>
                  <div className="flex justify-center items-center gap-2">
                    <button
                      className="px-2 bg-gray-200 rounded"
                      onClick={() => handleQuantityChange(item.prd_cd, -1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="px-2 bg-gray-200 rounded"
                      onClick={() => handleQuantityChange(item.prd_cd, 1)}>
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="inline-block mr-4">
                      Rs.{(item.max_rsp * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => dispatch(removeFromCart(item.prd_cd))}
                      className="text-red-500 font-semibold">
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Comments */}
            <div>
              <h2 className="font-semibold mb-2">Additional Comments</h2>
              <textarea
                className="w-full border p-3 rounded resize-none"
                rows={4}
                placeholder="Special instruction for seller..."
              />
              <p className="mt-2 text-sm text-gray-600">
                ✅ Secure Shopping Guarantee
              </p>
            </div>
          </div>

          {/* Right Section - Summary */}
          <div className="space-y-4 border p-6 rounded shadow-sm">
            <h2 className="text-lg font-bold border-b pb-2">ORDER SUMMARY</h2>
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>Rs.{subtotal}</p>
            </div>
            <div>
              <label className="block text-sm mb-1">Coupon Code</label>
              <input
                type="text"
                placeholder="Enter Coupon Code"
                className="w-full border px-3 py-2 rounded text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Coupon code will be applied on the checkout page
              </p>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <p>TOTAL:</p>
              <p>Rs.{calculateTotal().toFixed(2)}</p>
            </div>

            <Link href="/checkout">
              <button className="w-full bg-pink-400 text-white py-2 rounded font-semibold hover:bg-pink-500 transition">
                PROCEED TO CHECKOUT
              </button>
            </Link>
            <Link href="/products">
              <button className="w-full border mt-5 border-pink-400 text-pink-500 py-2 rounded font-semibold hover:bg-pink-50 transition">
                CONTINUE SHOPPING
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
