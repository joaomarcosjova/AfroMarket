import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer>
        
        

        
        <p className="text-center max-sm:text-sm">
        © {new Date().getFullYear()} — AfroMarket by{' '}
        <a
          href="https://www.linkedin.com/in/joaomarcosjova/"
          target="_blank"
          className="text-orange-600 font-semibold decoration-dotted"
        >
          Marcos Jova
        </a>{' '}
      </p>
      <p className="text-center text-2xl">{`{◕ ◡ ◕}`}</p>
      <br/>
    </footer>
  );
};

export default Footer;