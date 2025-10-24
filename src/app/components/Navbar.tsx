import { useState } from 'react';
import Link from 'next/link';
import { Calendar, User, Menu, X } from 'lucide-react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="h-16 lg:h-full w-full flex items-center">
      <div className="w-full px-4 lg:px-6 flex items-center h-full">
        <div className="flex justify-between items-center w-full">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl lg:text-2xl font-bold text-orange-800 tracking-wider plasterFont">
              FUJIFILM
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-orange-200 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6 text-orange-800" /> : <Menu className="h-6 w-6 text-orange-800" />}
          </button>

          {/* Desktop - Right side buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link 
              href="/reservation"
              className="bg-orange-800 hover:bg-orange-900 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Now</span>
            </Link>
            <button className="bg-orange-800 hover:bg-orange-900 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Sign Up</span>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 shadow-lg z-50">
            <div className="flex flex-col space-y-3 p-4">
              <Link 
                href="/reservation"
                className="bg-orange-800 hover:bg-orange-900 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Calendar className="h-4 w-4" />
                <span>Book Now</span>
              </Link>
              <button 
                className="bg-orange-800 hover:bg-orange-900 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                <span>Sign Up</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;