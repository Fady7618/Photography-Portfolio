import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-orange-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold">
          PhotographyNext
        </Link>
        <div className="space-x-4">
          <Link href="/gallery" className="text-white hover:text-orange-300">
            Gallery
          </Link>
          <Link href="/about" className="text-white hover:text-orange-300">
            About
          </Link>
          <Link href="/pricing" className="text-white hover:text-orange-300">
            Pricing
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;