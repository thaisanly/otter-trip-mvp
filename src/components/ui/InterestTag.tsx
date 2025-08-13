import React from 'react';
interface InterestTagProps {
  label: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'top';
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}
const InterestTag: React.FC<InterestTagProps> = ({
  label,
  icon,
  iconPosition = 'left',
  selected = false,
  onClick,
  className = '',
}) => {
  const baseClasses = `inline-flex items-center rounded-full text-sm transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`;
  const selectedClasses = selected
    ? 'bg-blue-100 text-blue-800 border-blue-200'
    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200';
  const iconTopClasses = iconPosition === 'top' ? 'flex-col px-3 py-2 gap-1' : 'px-3 py-1 gap-2';
  return (
    <div className={`${baseClasses} ${selectedClasses} ${iconTopClasses} border`} onClick={onClick}>
      {icon && icon}
      <span>{label}</span>
    </div>
  );
};
export default InterestTag;
