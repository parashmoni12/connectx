import React from 'react';

interface IconButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  label: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  badge,
  onClick,
  active = false,
  className = '',
  label,
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`relative p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${
        active
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
      } ${className}`}
    >
      <Icon className="w-5 h-5" />
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full min-w-[18px] text-center shadow-md">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
};