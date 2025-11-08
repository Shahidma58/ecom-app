"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";

import { useCartStore } from "../../../zu_store/cartStore";
import type { CartItem } from "../../../zu_store/cartStore";

interface Product {
  cart_id: number,
  cart_id_serl: number,
  prd_cd: number;
  prd_img_lnk: string;
  prd_cat: string;
  prd_brand: string;
  prd_desc: string;
  max_rsp: number;
  prd_rsp: number;  // ✅ Added
  tax_amt?: number; // ✅ Added
}

// ✅ Add CartItem interface (or import from cartStore)
// interface CartItem {
//   prd_cd: number;
//   prd_desc: string;
//   prd_rsp: number;
//   prd_qty: number;
//   prd_img_lnk?: string;
//   tax_amt?: number;
//   tot_amt?: number;
// }

export default function ProductDetail() {
  const router = useRouter();
  const { items, addItem, updateQty } = useCartStore();

  const params = useParams();
  const prd_cd = params?.prd_cd;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // ✅ Fetch product
  useEffect(() => {
    if (!prd_cd) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/ecom/prods/${prd_cd}`);

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        setProduct(data.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [prd_cd]);

  // ✅ Quantity Handlers
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // ✅ FIXED: Add to Cart logic
  const handleAddToCart = () => {
    if (!product) return;

    const existingItem = items.find((item) => item.prd_cd === product.prd_cd);

    if (existingItem) {
      // ✅ FIXED: Pass delta (change in quantity), not total quantity
      updateQty(product.prd_cd, quantity);
    } else {
      // Otherwise, create a new cart item
      const newItem: CartItem = {
        cart_id: 0,
        cart_id_serl: 0,
        prd_cd: product.prd_cd,
        prd_desc: product.prd_desc,
        prd_rsp: product.max_rsp,
        prd_qty: quantity,
        prd_img_lnk: product.prd_img_lnk,
        tax_amt: product.tax_amt ?? 0,
        tot_amt: (product.max_rsp + (product.tax_amt ?? 0)) * quantity,
      };

      addItem(newItem);
    }

    // ✅ Reset quantity after adding to cart
    setQuantity(1);
    
//    console.log("Cart updated:", useCartStore.getState().items);
  };

  // ✅ Loading state
  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading product details...
      </div>
    );
  }

  // ✅ UI
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 justify-center">
      <div className="flex flex-col items-end">
        <Image
          src={`/${product.prd_img_lnk}`}
          alt={product.prd_desc}
          width={400}
          height={400}
          className="rounded-lg object-cover"
        />
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-2">{product.prd_desc}</h1>

        <div className="flex items-center space-x-4 mt-4 mb-2">
          <button
            onClick={decreaseQuantity}
            className="bg-gray-300 w-10 h-10 flex items-center justify-center rounded-full text-xl"
          >
            -
          </button>
          <span className="text-xl font-semibold">{quantity}</span>
          <button
            onClick={increaseQuantity}
            className="bg-gray-300 w-10 h-10 flex items-center justify-center rounded-full text-xl"
          >
            +
          </button>
        </div>

        <p className="text-xl font-semibold mb-4">Rs. {product.max_rsp}</p>

        <div className="flex space-x-4 mt-6">
          <button
            onClick={handleAddToCart}
            className="bg-pink-300 hover:bg-pink-400 text-white px-6 py-2 rounded-md"
          >
            Add to Cart
          </button>
          <button 
            onClick={() => router.push('/ecom/cart')}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-md">
            Buy It Now
          </button>

          <button 
            onClick={() => router.push('/ecom/products')}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-md">
            Select More
          </button>

        </div>
      </div>
    </div>
  );
}