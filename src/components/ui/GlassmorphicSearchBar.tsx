'use client'

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  GlobeIcon,
  ArrowRightIcon,
} from 'lucide-react';
type GlassmorphicSearchBarProps = {
  className?: string;
};
const GlassmorphicSearchBar = ({ className = '' }: GlassmorphicSearchBarProps) => {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState<'experts' | 'tours'>('experts');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('');
  const [language, setLanguage] = useState('');
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  // Find hero element for scroll behavior
  useEffect(() => {
    // Find the hero element by looking for the first element with a background image
    const heroElements = document.querySelectorAll('[class*="bg-blue-900"]');
    if (heroElements.length > 0) {
      heroRef.current = heroElements[0] as HTMLDivElement;
    }
  }, []);
  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const heroBottom = heroRef.current.getBoundingClientRect().bottom;
      const isPassedHero = heroBottom <= 0;
      setIsScrolled(isPassedHero);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Animation for button press
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 300);
    // Build query parameters
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (date) params.append('date', date);
    if (searchMode === 'experts') {
      if (language) params.append('language', language);
      router.push(`/meet-experts?${params.toString()}`);
    } else {
      if (guests) params.append('guests', guests);
      router.push(`/search?${params.toString()}`);
    }
  };
  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        handleSubmit(e as unknown as React.FormEvent);
      }, 300);
    }
  };
  return (
    <div
      ref={searchBarRef}
      className={`
        ${className}
        fixed left-1/2 transform -translate-x-1/2 z-30
        transition-all duration-250 ease-in-out
        ${isScrolled ? 'top-4 max-w-[1100px] shadow-md bg-white' : 'bottom-8 max-w-[1160px] shadow-lg'}
      `}
      style={{
        maxWidth: isScrolled ? '1100px' : '1160px',
        height: isScrolled ? '56px' : '70px',
        borderRadius: '40px',
        background: isScrolled ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.25)',
        backdropFilter: isScrolled ? 'none' : 'blur(12px)',
        boxShadow: isHovering
          ? '0 12px 32px rgba(0, 0, 0, 0.2)'
          : isScrolled
            ? '0 4px 12px rgba(0, 0, 0, 0.1)'
            : '0 8px 24px rgba(0, 0, 0, 0.15)',
        border: isScrolled ? 'none' : '1px solid rgba(255, 255, 255, 0.35)',
        transform: `translate(-50%, ${isHovering && !isScrolled ? '-4px' : '0'})`,
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <form onSubmit={handleSubmit} className="h-full w-full flex lg:flex-row flex-col">
        {/* Mode Toggle - Only visible in non-scrolled state */}
        {!isScrolled && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 lg:block hidden">
            <div
              className="relative w-[100px] h-[36px] rounded-full bg-white/35 flex items-center"
              style={{
                background: 'rgba(255, 255, 255, 0.35)',
              }}
            >
              {/* Sliding indicator */}
              <div
                className="absolute w-[50px] h-[28px] rounded-full bg-blue-600 transition-all duration-180 ease-in-out"
                style={{
                  left: searchMode === 'experts' ? '4px' : '46px',
                  background: 'linear-gradient(90deg, #4F7EFF 0%, #6D8BFF 100%)',
                }}
              ></div>
              {/* Toggle buttons */}
              <button
                type="button"
                className={`relative z-10 w-[50px] h-full text-xs font-medium transition-colors ${searchMode === 'experts' ? 'text-white' : 'text-gray-700'}`}
                onClick={() => setSearchMode('experts')}
              >
                Experts
              </button>
              <button
                type="button"
                className={`relative z-10 w-[50px] h-full text-xs font-medium transition-colors ${searchMode === 'tours' ? 'text-white' : 'text-gray-700'}`}
                onClick={() => setSearchMode('tours')}
              >
                Tours
              </button>
            </div>
          </div>
        )}
        {/* Main search fields */}
        <div
          className={`
          flex lg:flex-row flex-col w-full h-full
          ${!isScrolled ? 'lg:pl-[116px]' : ''}
        `}
        >
          {/* Location field */}
          <div
            className={`
            lg:flex-1 h-full lg:border-r border-white/35 relative
            ${isScrolled ? 'lg:border-gray-200' : ''}
            ${activeInput === 'location' ? 'ring-2 ring-inset ring-blue-500' : ''}
          `}
          >
            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400">
              <MapPinIcon size={isScrolled ? 18 : 20} />
            </div>
            <input
              type="text"
              placeholder="Where to?"
              className={`
                w-full h-full bg-transparent border-0 outline-none
                lg:pl-12 pl-5 lg:pr-4 pr-5 text-gray-800 placeholder-gray-500
                ${activeInput === 'location' ? 'placeholder-opacity-70' : ''}
                ${isScrolled ? 'text-sm' : ''}
              `}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setActiveInput('location')}
              onBlur={() => setActiveInput(null)}
              onKeyDown={handleKeyDown}
            />
          </div>
          {/* Date field */}
          <div
            className={`
            lg:flex-1 h-full lg:border-r border-white/35 relative
            ${isScrolled ? 'lg:border-gray-200' : ''}
            ${activeInput === 'date' ? 'ring-2 ring-inset ring-blue-500' : ''}
          `}
          >
            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400">
              <CalendarIcon size={isScrolled ? 18 : 20} />
            </div>
            <input
              type="text"
              placeholder="When?"
              className={`
                w-full h-full bg-transparent border-0 outline-none
                lg:pl-12 pl-5 lg:pr-4 pr-5 text-gray-800 placeholder-gray-500
                ${activeInput === 'date' ? 'placeholder-opacity-70' : ''}
                ${isScrolled ? 'text-sm' : ''}
              `}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onFocus={() => setActiveInput('date')}
              onBlur={() => setActiveInput(null)}
              onKeyDown={handleKeyDown}
            />
          </div>
          {/* Language or Guests field */}
          <div
            className={`
            lg:flex-1 h-full lg:border-r border-white/35 relative
            ${isScrolled ? 'lg:border-gray-200' : ''}
            ${activeInput === 'third' ? 'ring-2 ring-inset ring-blue-500' : ''}
          `}
          >
            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400">
              {searchMode === 'experts' ? (
                <GlobeIcon size={isScrolled ? 18 : 20} />
              ) : (
                <UsersIcon size={isScrolled ? 18 : 20} />
              )}
            </div>
            <input
              type="text"
              placeholder={searchMode === 'experts' ? 'Language' : 'Guests'}
              className={`
                w-full h-full bg-transparent border-0 outline-none
                lg:pl-12 pl-5 lg:pr-4 pr-5 text-gray-800 placeholder-gray-500
                ${activeInput === 'third' ? 'placeholder-opacity-70' : ''}
                ${isScrolled ? 'text-sm' : ''}
              `}
              value={searchMode === 'experts' ? language : guests}
              onChange={(e) =>
                searchMode === 'experts' ? setLanguage(e.target.value) : setGuests(e.target.value)
              }
              onFocus={() => setActiveInput('third')}
              onBlur={() => setActiveInput(null)}
              onKeyDown={handleKeyDown}
            />
          </div>
          {/* Search button */}
          <button
            type="submit"
            className={`
              lg:w-[140px] w-full h-full rounded-r-[40px] flex items-center justify-center
              text-white font-medium transition-all duration-200
              ${isSubmitting ? 'scale-97' : 'scale-100'}
            `}
            style={{
              background: `linear-gradient(${isHovering ? '100deg' : '90deg'}, #4F7EFF 0%, #6D8BFF 100%)`,
            }}
          >
            <span className="mr-2 lg:block md:hidden">Search</span>
            <ArrowRightIcon
              size={isScrolled ? 18 : 20}
              className="transition-transform duration-200"
              style={{
                transform: isHovering ? 'translateX(4px)' : 'translateX(0)',
              }}
            />
          </button>
        </div>
      </form>
    </div>
  );
};
export default GlassmorphicSearchBar;
