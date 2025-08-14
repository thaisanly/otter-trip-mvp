import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon, ChevronDownIcon } from 'lucide-react';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // Close explore dropdown when route changes
  useEffect(() => {
    setIsExploreOpen(false);
    setIsMenuOpen(false);
  }, [location.pathname]);
  const isActive = (path) => {
    return location.pathname === path;
  };
  const isExploreActive = () => {
    return location.pathname.startsWith('/explore/');
  };
  const isMeetExpertsActive = () => {
    return location.pathname.startsWith('/meet-experts');
  };
  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white shadow-sm'}`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/image.png" alt="OtterTrip" className="h-10 md:h-12" />
        </Link>
        {/* Desktop Navigation - Right aligned */}
        <div className="hidden md:flex items-center ml-auto">
          <nav className="flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium ${isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
            >
              Home
            </Link>
            <Link
              to="/meet-experts"
              className={`text-sm font-medium ${isMeetExpertsActive() ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
            >
              Meet Experts
            </Link>
            <div className="relative">
              <button
                className={`flex items-center text-sm font-medium ${isExploreActive() ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
                onClick={() => setIsExploreOpen(!isExploreOpen)}
              >
                Explore
                <ChevronDownIcon size={16} className="ml-1" />
              </button>
              {isExploreOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg p-2 border border-gray-100 z-50">
                  <Link
                    to="/explore/adventure"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
                    onClick={() => setIsExploreOpen(false)}
                  >
                    Adventure
                  </Link>
                  <Link
                    to="/explore/cultural"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
                    onClick={() => setIsExploreOpen(false)}
                  >
                    Cultural
                  </Link>
                  <Link
                    to="/explore/relaxation"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
                    onClick={() => setIsExploreOpen(false)}
                  >
                    Relaxation
                  </Link>
                  <Link
                    to="/explore/food"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
                    onClick={() => setIsExploreOpen(false)}
                  >
                    Food & Cuisine
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-md border-t border-gray-100">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/"
              className={`text-gray-700 hover:text-blue-600 py-2 ${isActive('/') ? 'font-medium text-blue-600' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/meet-experts"
              className={`py-2 ${isMeetExpertsActive() ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Meet Experts
            </Link>
            <div className="py-2">
              <button
                className="flex items-center justify-between w-full text-left text-gray-700"
                onClick={() => setIsExploreOpen(!isExploreOpen)}
              >
                <span
                  className={isExploreActive() || isExploreOpen ? 'text-blue-600 font-medium' : ''}
                >
                  Explore
                </span>
                <ChevronDownIcon size={16} className={isExploreOpen ? 'text-blue-600' : ''} />
              </button>
              {isExploreOpen && (
                <div className="mt-2 pl-4 border-l-2 border-gray-100 space-y-2">
                  <Link
                    to="/explore/adventure"
                    className="block py-1 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Adventure
                  </Link>
                  <Link
                    to="/explore/cultural"
                    className="block py-1 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cultural
                  </Link>
                  <Link
                    to="/explore/relaxation"
                    className="block py-1 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Relaxation
                  </Link>
                  <Link
                    to="/explore/food"
                    className="block py-1 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Food & Cuisine
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
export default Header;
