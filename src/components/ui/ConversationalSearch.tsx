import React, { useEffect, useState, useRef, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, XIcon } from 'lucide-react';
type Suggestion = {
  id: string;
  text: string;
  type: 'experience' | 'guide' | 'style';
};
// Mock suggestions that would come from an AI
const mockSuggestions: Suggestion[] = [
  {
    id: 's1',
    text: 'A photography adventure with a local expert',
    type: 'experience',
  },
  {
    id: 's2',
    text: 'Someone who can show me hidden food spots',
    type: 'guide',
  },
  {
    id: 's3',
    text: 'A laid-back cultural experience',
    type: 'style',
  },
  {
    id: 's4',
    text: 'An adrenaline-filled day with an adventure guide',
    type: 'experience',
  },
  {
    id: 's5',
    text: 'A guide who specializes in architecture and history',
    type: 'guide',
  },
  {
    id: 's6',
    text: 'A spiritual journey with a mindful local',
    type: 'style',
  },
  {
    id: 's7',
    text: 'Someone who can teach me local cooking',
    type: 'guide',
  },
  {
    id: 's8',
    text: 'A family-friendly nature experience',
    type: 'experience',
  },
];
const ConversationalSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Filter suggestions based on query
    if (query.length > 0) {
      const filtered = mockSuggestions.filter((suggestion) =>
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered.length > 0 ? filtered : mockSuggestions.slice(0, 3));
    } else {
      // Show popular suggestions when no query
      setFilteredSuggestions(mockSuggestions.slice(0, 4));
    }
  }, [query]);
  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };
  return (
    <div className="w-full max-w-3xl mx-auto relative">
      <div
        className={`
        bg-white rounded-full shadow-md transition-all duration-300 overflow-hidden
        ${isFocused ? 'ring-2 ring-blue-400 shadow-lg' : ''}
      `}
      >
        <div className="relative flex items-center">
          <SearchIcon size={20} className="absolute left-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="What kind of travel experience are you looking for?"
            className="w-full py-4 pl-12 pr-12 text-gray-800 focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {query && (
            <button
              className="absolute right-5 text-gray-400 hover:text-gray-600"
              onClick={() => setQuery('')}
            >
              <XIcon size={18} />
            </button>
          )}
        </div>
      </div>
      {/* Suggestions dropdown */}
      {isFocused && (
        <div
          ref={dropdownRef}
          className="absolute mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-10"
        >
          <div className="p-2">
            {query.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">
                Try searching for experiences, guide specialties, or travel styles
              </div>
            )}
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                className="w-full text-left px-3 py-3 hover:bg-gray-50 rounded-lg flex items-center"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="mr-3">
                  {suggestion.type === 'experience' && (
                    <span className="text-blue-500 text-lg">🧭</span>
                  )}
                  {suggestion.type === 'guide' && (
                    <span className="text-green-500 text-lg">👤</span>
                  )}
                  {suggestion.type === 'style' && (
                    <span className="text-purple-500 text-lg">✨</span>
                  )}
                </div>
                <div>
                  <div className="text-gray-800">{suggestion.text}</div>
                  <div className="text-xs text-gray-500">
                    {suggestion.type === 'experience' && 'Experience type'}
                    {suggestion.type === 'guide' && 'Guide specialty'}
                    {suggestion.type === 'style' && 'Travel style'}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
            <button
              className="w-full text-center text-blue-600 font-medium text-sm hover:text-blue-800"
              onClick={() => handleSearch()}
            >
              Search for "{query || 'travel experiences'}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ConversationalSearch;
