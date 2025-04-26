import React from 'react';
import Link from 'next/link';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronRight } from 'lucide-react';

// 定义本地的cn函数
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BreadcrumbProps {
  /**
   * 分隔符
   * @default <ChevronRight />
   */
  separator?: React.ReactNode;
  
  /**
   * 分隔符的类名
   */
  separatorClassName?: string;
  
  /**
   * 子元素
   */
  children?: React.ReactNode;
  
  /**
   * 面包屑容器的类名
   */
  className?: string;
}

export interface BreadcrumbItemProps {
  /**
   * 导航链接
   */
  href?: string;
  
  /**
   * 是否为当前活动项
   * @default false
   */
  active?: boolean;
  
  /**
   * 图标
   */
  icon?: React.ReactNode;
  
  /**
   * 子元素
   */
  children?: React.ReactNode;
  
  /**
   * 面包屑项的类名
   */
  className?: string;
  
  /**
   * 是否为当前页面
   */
  isCurrentPage?: boolean;
}

export interface BreadcrumbLinkProps {
  /**
   * 链接地址
   */
  href?: string;
  
  /**
   * 子元素
   */
  children?: React.ReactNode;
  
  /**
   * 链接的类名
   */
  className?: string;
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      children,
      separator = <ChevronRight className="h-4 w-4" />,
      separatorClassName,
      className,
    }, 
    ref
  ) => {
    // 克隆子项并添加分隔符
    const items = React.Children.toArray(children).filter(Boolean);
    
    const itemsWithSeparators = items.map((item, index) => {
      const isLast = index === items.length - 1;
      
      // 准备分隔符
      const separatorElement = (
        <span className={cn('mx-2', separatorClassName)}>
          {separator}
        </span>
      );
      
      return (
        <React.Fragment key={index}>
          {item}
          {!isLast && separatorElement}
        </React.Fragment>
      );
    });
    
    return (
      <nav
        aria-label="Breadcrumb"
        ref={ref}
      >
        <ol
          className={cn(
            'flex flex-wrap items-center text-sm',
            className
          )}
        >
          {itemsWithSeparators}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  (
    {
      children,
      href,
      active = false,
      icon,
      className,
      isCurrentPage = false,
    }, 
    ref
  ) => {
    return (
      <li
        ref={ref}
        className={cn('flex items-center', className)}
      >
        {icon && (
          <span className="mr-1.5">{icon}</span>
        )}
        
        {href && !active && !isCurrentPage ? (
          <Link 
            href={href}
            className={cn(
              'text-muted-foreground hover:text-foreground hover:underline transition-colors',
              active && 'text-foreground font-medium pointer-events-none'
            )}
          >
            {children}
          </Link>
        ) : (
          <span
            className={cn(
              'text-muted-foreground',
              (active || isCurrentPage) && 'text-foreground font-medium'
            )}
            aria-current={(active || isCurrentPage) ? 'page' : undefined}
          >
            {children}
          </span>
        )}
      </li>
    );
  }
);

BreadcrumbItem.displayName = 'BreadcrumbItem';

// 为了向后兼容，创建一个BreadcrumbLink组件
const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  (
    {
      href,
      children,
      className,
    },
    ref
  ) => {
    if (href) {
      return (
        <Link
          ref={ref}
          href={href}
          className={cn(
            'text-muted-foreground hover:text-foreground hover:underline transition-colors',
            className
          )}
        >
          {children}
        </Link>
      );
    }
    
    return (
      <span
        className={cn(
          'text-foreground font-medium',
          className
        )}
      >
        {children}
      </span>
    );
  }
);

BreadcrumbLink.displayName = 'BreadcrumbLink';

export { Breadcrumb, BreadcrumbItem, BreadcrumbLink }; 