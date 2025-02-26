"use client";

import React, { useState } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon, SupportIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk();

  // State for search input
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${searchQuery}&category=${searchCategory}`);
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 relative">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <Image
          className="cursor-pointer w-28 md:w-32"
          onClick={() => router.push("/")}
          src={assets.logo}
          alt="logo"
        />

        {/* Desktop Search Bar with Category Selector */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
          <select
            className="px-2 py-2 bg-gray-100 border-r border-gray-300 focus:outline-none"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          >
            <option value="all">All</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Apple</option>
            <option value="home">Samsung</option>
            <option value="home">Redmi</option>
          </select>
          <input
            type="text"
            placeholder="Search for products..."
            className="px-4 py-2 w-full focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="bg-orange-600 text-white px-4 py-2 hover:bg-orange-700 cursor-pointer">
            Search
          </button>
        </form>
      </div>



      {/* Desktop Navigation Links */}
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">

      <Link href="/all-products" className="flex items-center hover:text-gray-900 transition">
      <BoxIcon className="w-5 h-5 mr-1" />
      All products
      </Link>
    
      <Link href="mailto:marcosjova3@gmail.com" className="flex items-center hover:text-gray-900 transition">
      <SupportIcon className="w-5 h-5 mr-1" />
      Support
      </Link>

        {isSeller && (
          <button onClick={() => router.push("/seller")} className=" border px-4 py-1.5 rounded-full">
            Seller Dashboard
          </button>
        )}
      </div>

      {/* User Options (Cart, Account, etc.) */}
      <ul className="hidden md:flex items-center gap-4">
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
      </ul>

      {/* Mobile Navigation & Search Button */}
      <div className="flex items-center md:hidden gap-3">
        <Image
          className="w-5 h-5 cursor-pointer"
          src={assets.search_icon}
          alt="search icon"
          onClick={() => setShowMobileSearch(!showMobileSearch)}
        />

        {isSeller && (
          <button onClick={() => router.push("/seller")} className="text-xs border px-4 py-1.5 rounded-full">
            Seller Dashboard
          </button>
        )}

        {user ? (
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
        ) : (
          <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <form onSubmit={handleSearch} className="absolute top-16 left-0 w-full px-4 z-50">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-md">
            <select
              className="px-2 py-2 bg-gray-100 border-r border-gray-300 focus:outline-none"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              <option value="all">All</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home</option>
            </select>
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
    </nav>
  );
};

export default Navbar;
