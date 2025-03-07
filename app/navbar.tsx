"use client"
import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  
  return (
    <nav className="bg-blue-600 p-4 shadow-xl">
      <div className="max-w-screen-xl mx-auto flex justify-center items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-white font-bold text-3xl ">
            BlogSite
          </Link>
        </div>

        

       
      </div>

      
    </nav>
  );
};

export default Navbar;
