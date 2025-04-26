import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Text } from './text';
import { Container } from './container';

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  centered?: boolean;
  children?: React.ReactNode;
  breadcrumbContent?: React.ReactNode;
  compact?: boolean;
}

export function PageHeader({
  title,
  description,
  centered = false,
  children,
  breadcrumbContent,
  compact = false,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={twMerge(
        'border-b border-gray-200 dark:border-gray-800',
        'bg-white dark:bg-gray-950',
        compact ? 'py-4 md:py-6' : 'py-6 md:py-10',
        className
      )}
      {...props}
    >
      <Container maxWidth="xl">
        {breadcrumbContent && (
          <div className="mb-3 md:mb-4">{breadcrumbContent}</div>
        )}
        
        <div className={centered ? 'text-center' : ''}>
          <Text
            variant="h1"
            className={compact ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'}
          >
            {title}
          </Text>
          
          {description && (
            <Text
              variant="body"
              color="secondary"
              className="mt-2 md:mt-3 max-w-2xl"
              {...(centered && { className: 'mx-auto' })}
            >
              {description}
            </Text>
          )}
          
          {children && (
            <div className={`mt-4 md:mt-6 ${centered ? 'mx-auto' : ''}`}>
              {children}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
} 