import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name = 'User',
  size = 'md',
  isOnline = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const statusSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  const initials = name.split(' ').map((n) => n[0]).join('').slice(0,2).toUpperCase();

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-slate-800`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 font-semibold text-white flex items-center justify-center ring-2 ring-slate-800`}
        >
          {initials}
        </div>
      )}

      {isOnline && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizeClasses[size]} rounded-full bg-emerald-500 ring-2 ring-slate-900`}
        />
      )}
    </div>
  );
};