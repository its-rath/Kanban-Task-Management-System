import React from 'react';
import clsx from 'clsx';
import { getInitials } from '@/utils/task.utils';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** 
   * Background color class (e.g., 'bg-blue-500')
   * @default 'bg-primary-500'
   */
  bgColor?: string;
  /** 
   * Text color class (e.g., 'text-white')
   * @default 'text-white'
   */
  textColor?: string;
}

/**
 * Avatar component displaying user initials with consistent styling
 */
export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'md',
  className,
  bgColor = 'bg-primary-500',
  textColor = 'text-white',
}) => {
  const sizeStyles = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const initials = getInitials(name);
  const sizeClass = sizeStyles[size] || sizeStyles.md;

  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center rounded-full font-medium select-none',
        sizeClass,
        bgColor,
        textColor,
        className
      )}
      role="img"
      aria-label={`Avatar of ${name}`}
      title={name}
    >
      {initials}
    </div>
  );
};