'use client'

import React from 'react';
import { StarIcon } from 'lucide-react';
interface RatingProps {
  value: number;
  showCount?: boolean;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}
const Rating = ({ value, showCount = true, count = 0, size = 'md' }: RatingProps) => {
  // Round to nearest half
  const roundedValue = Math.round(value * 2) / 2;
  // Determine icon size based on the size prop
  const iconSize = {
    sm: 14,
    md: 16,
    lg: 20,
  }[size];
  // Determine text size based on the size prop
  const textClass = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[size];
  return (
    <div className="flex items-center">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          // Full star
          if (star <= roundedValue) {
            return <StarIcon key={star} size={iconSize} className="text-yellow-400 fill-current" />;
          }
          // Half star
          else if (star - 0.5 === roundedValue) {
            return (
              <div key={star} className="relative">
                <StarIcon size={iconSize} className="text-gray-300" />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <StarIcon size={iconSize} className="text-yellow-400 fill-current" />
                </div>
              </div>
            );
          }
          // Empty star
          else {
            return <StarIcon key={star} size={iconSize} className="text-gray-300" />;
          }
        })}
      </div>
      {showCount && (
        <div className={`ml-2 ${textClass} text-gray-600`}>
          <span className="font-medium text-gray-900">{value}</span>
          {count > 0 && <span> ({count})</span>}
        </div>
      )}
    </div>
  );
};
export default Rating;
