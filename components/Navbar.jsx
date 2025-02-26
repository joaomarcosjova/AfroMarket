"use client"; // Ensures the component runs on the client side.

import React, { useState } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk();
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [showMobileSearch, setShowMobileSearch] = useState(false); // Mobile search visibility state

  // Function to handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${searchQuery}`); // Redirect to search page
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      {/* Logo */}
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push("/")}
        src={assets.logo}
        alt="logo"
      />

      {/* Desktop Search Bar (Visible on larger screens) */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center border border-gray-300 rounded-lg overflow-hidden">
        <input
          type="text"
          placeholder="Search for products..."
          className="px-4 py-2 w-64 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700">
          Search
        </button>
      </form>

      {/* Navigation Links */}
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">Home</Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">Shop</Link>
        <Link href="/" className="hover:text-gray-900 transition">About Us</Link>
        <Link href="/" className="hover:text-gray-900 transition">Contact</Link>
        {isSeller && <button onClick={() => router.push("/seller")} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}
      </div>

      {/* User Account and Cart */}
      <ul className="hidden md:flex items-center gap-4">
        {user ? (
          <>
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push("/cart")} />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push("/my-orders")} />
              </UserButton.MenuItems>
            </UserButton>
          </>
        ) : (
          <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </ul>

      {/* Mobile Navigation */}
      <div className="flex items-center md:hidden gap-3">
        {/* Mobile Search Icon - Clicking it reveals input field */}
        <button onClick={() => setShowMobileSearch(!showMobileSearch)} className="p-2">
          <Image className="w-5 h-5" src={assets.search_icon} alt="Search" />
        </button>

        {/* Mobile Search Bar (Appears when search icon is clicked) */}
        {showMobileSearch && (
          <form onSubmit={handleSearch} className="absolute top-16 left-0 w-full px-4">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-md">
              <input
                type="text"
                placeholder="Search for products..."
                className="px-4 py-2 w-full focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700">
                Search
              </button>
            </div>
          </form>
        )}

        {isSeller && <button onClick={() => router.push("/seller")} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}
        
        {user ? (
          <>
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={() => router.push("/home")} />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="Products" labelIcon={<BoxIcon />} onClick={() => router.push("/all-products")} />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push("/cart")} />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push("/my-orders")} />
              </UserButton.MenuItems>
            </UserButton>
          </>
        ) : (
          <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
