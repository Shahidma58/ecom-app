"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: {
    prd_cd: number;
    prd_img_lnk: string;
    prd_cat: string;
    prd_brand: string;
    prd_desc: string;
    max_rsp: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/ecom/products/${product.prd_cd}`}>
      <div className="bg-white p-4 shadow-lg rounded-lg w-[280px] h-[400px] flex flex-col items-center">
        <Image
          src={`/${product.prd_img_lnk}`}
          alt={product.prd_brand}
          width={250}
          height={250}
          className="rounded-lg object-cover"
        />
        <div className="w-[250px] mt-4">
          <p className="text-gray-800 text-left text-[16px] font-semibold">
            {product.prd_desc}
          </p>
          <p className="text-gray-500 text-left text-[14px]">
            {product.prd_cat}
          </p>
          <p className="text-green-600 text-left text-[16px] font-bold mt-2">
            Rs. {product.max_rsp}
          </p>
        </div>
      </div>
    </Link>
  );
}
