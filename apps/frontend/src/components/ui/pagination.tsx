import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

// 定义本地的cn函数
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * 当前页码
   * @default 1
   */
  currentPage: number;
  
  /**
   * 总页数
   * @default 1
   */
  totalPages: number;
  
  /**
   * 页码变化回调函数
   */
  onPageChange: (page: number) => void;
  
  /**
   * 是否显示上一页/下一页按钮
   * @default true
   */
  showPrevNextButtons?: boolean;
  
  /**
   * 页码数字两侧显示的页码数量
   * @default 1
   */
  siblingCount?: number;
  
  /**
   * 大小
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * 形状
   * @default "rounded"
   */
  shape?: 'rounded' | 'pill' | 'square';
  
  /**
   * 是否居中显示
   * @default false
   */
  centered?: boolean;
  
  /**
   * 自定义上一页按钮内容
   */
  prevButtonContent?: React.ReactNode;
  
  /**
   * 自定义下一页按钮内容
   */
  nextButtonContent?: React.ReactNode;
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  ({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    showPrevNextButtons = true,
    siblingCount = 1,
    size = 'md',
    shape = 'rounded',
    centered = false,
    prevButtonContent,
    nextButtonContent,
    className,
    ...props
  }, ref) => {
    
    // 计算分页按钮的范围
    const generatePagination = () => {
      // 如果页数少于7，显示所有页码
      if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
      
      // 左右显示的页码数
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
      
      // 是否显示省略号
      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
      
      // 始终显示第一页和最后一页
      if (shouldShowLeftDots && shouldShowRightDots) {
        // 中间情况: 当前页在中间位置
        return [1, 'leftDots', leftSiblingIndex, currentPage, rightSiblingIndex, 'rightDots', totalPages];
      } else if (!shouldShowLeftDots && shouldShowRightDots) {
        // 左边情况: 当前页靠近开始
        const leftItems = Array.from({ length: 5 }, (_, i) => i + 1);
        return [...leftItems, 'rightDots', totalPages];
      } else if (shouldShowLeftDots && !shouldShowRightDots) {
        // 右边情况: 当前页靠近结束
        const rightItems = Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
        return [1, 'leftDots', ...rightItems];
      }
      
      // 默认情况，不应该到达这里
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    };
    
    const sizeClasses = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
    };
    
    const shapeClasses = {
      rounded: 'rounded-md',
      pill: 'rounded-full',
      square: 'rounded-none',
    };
    
    const paginationItems = generatePagination();
    
    return (
      <nav
        ref={ref}
        className={cn(
          'flex flex-wrap gap-2',
          centered && 'justify-center',
          className
        )}
        aria-label="Pagination"
        {...props}
      >
        {showPrevNextButtons && (
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={cn(
              'flex items-center justify-center border border-gray-300 dark:border-gray-700',
              'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200',
              'hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed',
              sizeClasses[size],
              shapeClasses[shape]
            )}
            aria-label="上一页"
          >
            {prevButtonContent || <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
  
        {paginationItems.map((item, index) => {
          if (item === 'leftDots' || item === 'rightDots') {
            return (
              <span
                key={`dots-${index}`}
                className={cn(
                  'flex items-center justify-center text-gray-500 dark:text-gray-400',
                  sizeClasses[size]
                )}
              >
                <MoreHorizontal className="w-4 h-4" />
              </span>
            );
          }
  
          const page = item as number;
          const isActive = page === currentPage;
  
          return (
            <button
              key={page}
              onClick={() => !isActive && onPageChange(page)}
              className={cn(
                'flex items-center justify-center border',
                isActive
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700',
                sizeClasses[size],
                shapeClasses[shape]
              )}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`第 ${page} 页`}
            >
              {page}
            </button>
          );
        })}
  
        {showPrevNextButtons && (
          <button
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={cn(
              'flex items-center justify-center border border-gray-300 dark:border-gray-700',
              'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200',
              'hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed',
              sizeClasses[size],
              shapeClasses[shape]
            )}
            aria-label="下一页"
          >
            {nextButtonContent || <ChevronRight className="w-4 h-4" />}
          </button>
        )}
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination'; 