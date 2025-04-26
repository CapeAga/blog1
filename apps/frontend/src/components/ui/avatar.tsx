import React from 'react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  fallback?: string;
  status?: 'online' | 'offline' | 'away' | 'busy' | 'none';
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = '', size = 'md', shape = 'circle', fallback, status = 'none', ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const sizeClasses = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl'
    };

    const shapeClasses = {
      circle: 'rounded-full',
      square: 'rounded-md'
    };

    const statusClasses = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      away: 'bg-yellow-500',
      busy: 'bg-red-500',
      none: 'hidden'
    };

    const getFallbackInitials = () => {
      if (!fallback) return '?';
      const words = fallback.trim().split(' ');
      if (words.length === 1) return words[0].charAt(0).toUpperCase();
      return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase();
    };

    return (
      <div
        ref={ref}
        className={twMerge(
          'relative inline-flex items-center justify-center flex-shrink-0 bg-gray-200 dark:bg-gray-700 overflow-hidden',
          sizeClasses[size],
          shapeClasses[shape],
          className
        )}
        {...props}
      >
        {!src || imageError ? (
          <span className="font-medium text-gray-600 dark:text-gray-300">
            {getFallbackInitials()}
          </span>
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        )}
        {status !== 'none' && (
          <span className={twMerge(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-800',
            statusClasses[status],
            size === 'xs' ? 'w-1.5 h-1.5' : 'w-2.5 h-2.5'
          )} />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar'; 