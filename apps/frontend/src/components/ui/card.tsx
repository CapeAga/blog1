import React from 'react';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  href?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, shadow = 'sm', border = true, children, ...props }, ref) => {
    const shadowClasses = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg'
    };

    return (
      <div
        ref={ref}
        className={twMerge(
          'bg-white dark:bg-gray-800 rounded-lg overflow-hidden',
          border && 'border border-gray-200 dark:border-gray-700',
          shadowClasses[shadow],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  cardTitle?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, cardTitle, subtitle, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          'px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 dark:border-gray-700',
          className
        )}
        {...props}
      >
        {(cardTitle || subtitle || action) ? (
          <div className="flex items-start justify-between">
            <div>
              {cardTitle && (
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {cardTitle}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
            {action && <div className="ml-4">{action}</div>}
          </div>
        ) : (
          children
        )}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, noPadding = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          !noPadding && 'px-4 py-3 sm:px-6 sm:py-4',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          'px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-200 dark:border-gray-700',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export interface CardImageProps {
  src: string;
  alt?: string;
  height?: number;
  width?: number;
  priority?: boolean;
  className?: string;
  coverMode?: boolean;
  ratio?: '16:9' | '4:3' | '1:1' | '3:4';
}

export const CardImage = React.forwardRef<HTMLDivElement, CardImageProps>(
  ({ 
    src, 
    alt = '', 
    height, 
    width, 
    priority = false, 
    className,
    coverMode = false,
    ratio = '16:9'
  }, ref) => {
    const ratioClasses = {
      '16:9': 'aspect-video',
      '4:3': 'aspect-[4/3]',
      '1:1': 'aspect-square',
      '3:4': 'aspect-[3/4]'
    };

    return (
      <div 
        ref={ref}
        className={twMerge(
          'relative overflow-hidden', 
          coverMode ? '' : ratioClasses[ratio],
          className
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill={true}
          height={height}
          width={width}
          priority={priority}
          className={twMerge(
            'object-cover',
            coverMode ? 'w-full h-full' : ''
          )}
        />
      </div>
    );
  }
);

CardImage.displayName = 'CardImage';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, level = 3, children, ...props }, ref) => {
    const Heading = `h${level}` as keyof JSX.IntrinsicElements;
    
    return (
      <Heading
        ref={ref}
        className={twMerge(
          'text-lg font-medium text-gray-900 dark:text-gray-100',
          className
        )}
        {...props}
      >
        {children}
      </Heading>
    );
  }
);

CardTitle.displayName = 'CardTitle'; 