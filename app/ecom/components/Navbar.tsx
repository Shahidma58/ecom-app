"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FaRegUser } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { GrDeliver } from "react-icons/gr";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // const cartItems = useSelector((state: RootState) => state.cart.items);
  // const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "All Products", path: "/ecom/products" },
    { name: "Track Order", path: "/ecom/track-order" },
    { name: "About Us", path: "/ecom/about" },
    { name: "Privacy Policy", path: "/ecom/privacy" },
    { name: "Contact Us", path: "/ecom/contact" },
  ];

  // Check if current page is payCash
  const isPayCashPage = pathname === "/ecom/finTran/payCash";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Row: Logo and Menu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-gray-800">
            YourStore
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="text-gray-600 hover:text-blue-600 transition-colors">
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-600 hover:text-blue-600 focus:outline-none">
            {isMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Second Row: Icons - Hidden on payCash page */}
      {!isPayCashPage && (
        <div className="bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-end space-x-6">
            <Link
              href="/ecom/track-order"
              className="text-gray-600 hover:text-blue-600 flex items-center space-x-1">
              <GrDeliver className="h-5 w-5" />
            </Link>
            <Link
              href="/ecom/cart"
              className="text-gray-600 hover:text-blue-600 flex items-center space-x-1 relative">
              <IoCartOutline className="h-5 w-5" />
              {/* Badge */}
              {/* {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {totalQuantity}
                </span>
              )} */}
            </Link>
            <Link
              href="/login"
              className="text-gray-600 hover:text-blue-600 flex items-center space-x-1">
              <FaRegUser className="h-5 w-5" />
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-2 flex flex-col space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="block py-2 text-gray-600 hover:text-blue-600"
                onClick={toggleMenu}>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;