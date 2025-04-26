import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /**
   * 文本区域状态
   * @default 'default'
   */
  status?: 'default' | 'error' | 'success';
  
  /**
   * 是否占满父容器宽度
   * @default false
   */
  isFullWidth?: boolean;
  
  /**
   * 大小
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 调整大小方式
   * @default 'vertical'
   */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

/**
 * 文本区域组件
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      status = 'default',
      isFullWidth = false,
      size = 'medium',
      resize = 'vertical',
      ...props
    },
    ref
  ) => {
    // 状态样式映射
    const statusClasses = {
      default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400',
      error: 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:border-red-400 dark:focus:ring-red-400',
      success: 'border-green-500 focus:border-green-500 focus:ring-green-500 dark:border-green-400 dark:focus:border-green-400 dark:focus:ring-green-400',
    };
    
    // 尺寸样式映射
    const sizeClasses = {
      small: 'py-1.5 px-2 text-sm',
      medium: 'py-2 px-3 text-base',
      large: 'py-2.5 px-4 text-lg',
    };
    
    // 宽度样式
    const widthClass = isFullWidth ? 'w-full' : 'w-auto';
    
    // 调整大小样式
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };
    
    return (
      <textarea
        className={cn(
          'block rounded-md border bg-white shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-opacity-50',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100',
          'dark:bg-gray-800 dark:text-gray-100',
          statusClasses[status],
          sizeClasses[size],
          resizeClasses[resize],
          widthClass,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea'; 