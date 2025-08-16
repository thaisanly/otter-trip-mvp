'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MenuIcon, XIcon, ChevronDownIcon } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const pathname = usePathname();

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
  }, [pathname]);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const isExploreActive = () => {
    return pathname.startsWith('/explore/');
  };

  const isMeetExpertsActive = () => {
    return pathname.startsWith('/meet-experts');
  };


  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white shadow-sm'}`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image 
            src="/image.png" 
            alt="OtterTrip" 
            width={166} 
            height={48} 
            className="h-10 md:h-12 object-contain" 
            priority={true}
          />
        </Link>

        {/* Desktop Navigation - Right aligned */}
        <div className="hidden md:flex items-center ml-auto">
          <nav className="flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium ${isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
            >
              Home
            </Link>
            <Link
              href="/meet-experts"
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
                <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-lg shadow-lg p-2 border border-gray-100 z-50">
                  <Link
                    href="/explore/adventure"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
                    onClick={() => setIsExploreOpen(false)}
                  >
                    Adventure
                  </Link>
                  <Link
                    href="/explore/cultural"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
                    onClick={() => setIsExploreOpen(false)}
                  >
                    Cultural
                  </Link>
                  <Link
                    href="/explore/relaxation"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
                    onClick={() => setIsExploreOpen(false)}
                  >
                    Relaxation
                  </Link>
                  <Link
                    href="/explore/food"
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
              href="/"
              className={`text-gray-700 hover:text-blue-600 py-2 ${isActive('/') ? 'font-medium text-blue-600' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/meet-experts"
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
                    href="/explore/adventure"
                    className="block py-1 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Adventure
                  </Link>
                  <Link
                    href="/explore/cultural"
                    className="block py-1 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cultural
                  </Link>
                  <Link
                    href="/explore/relaxation"
                    className="block py-1 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Relaxation
                  </Link>
                  <Link
                    href="/explore/food"
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