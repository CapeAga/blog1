'use client';

import React from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Button } from '../ui/button';
import { Text } from '../ui/text';
import { Breadcrumb, BreadcrumbItem } from '../ui/breadcrumb';

// 定义本地的cn函数
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PageAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger' | 'accent';
  icon?: React.ReactNode;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: PageAction[];
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={twMerge('flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b dark:border-gray-800', className)}>
      <div className="mb-4 sm:mb-0">
        <Text variant="h1" className="mb-1">
          {title}
        </Text>
        {description && (
          <Text variant="body" color="muted" className="max-w-2xl">
            {description}
          </Text>
        )}
      </div>

      {actions && actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'primary'}
              onClick={action.onClick}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
} 