import React from "react";
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';

// 如果已经有utils文件，可以使用下面导入替代
// import { cn } from "@/lib/utils";

// 定义本地的cn函数，以防utils不可用
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 按钮的变体类型
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger' | 'accent';
  
  /**
   * 按钮的大小
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  
  /**
   * 是否显示加载状态
   * @default false
   */
  loading?: boolean;
  
  /**
   * 是否占满父容器宽度
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * 如果提供href，按钮将渲染为链接
   */
  href?: string;
  
  /**
   * 链接打开方式
   */
  target?: string;

  /**
   * 渲染为其他元素类型
   * 当设置为 'a' 时，按钮将渲染为链接
   */
  as?: 'a' | 'button' | string;
}

/**
 * 按钮组件
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      href,
      target,
      as,
      ...props
    },
    ref
  ) => {
    // 基础样式
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    // 变体样式
    const variantStyles: Record<string, string> = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent",
      ghost: "hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent",
      link: "text-primary underline-offset-4 hover:underline focus-visible:ring-primary",
      danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
      accent: "bg-accent text-accent-foreground hover:bg-accent/90",
    };
    
    // 尺寸样式
    const sizeStyles: Record<string, string> = {
      sm: "h-9 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-11 px-6 py-3 text-base",
      xl: "h-12 px-8 py-3 text-base",
      icon: "h-10 w-10 p-0"
    };
    
    // 宽度样式
    const widthClass = fullWidth ? 'w-full' : 'w-auto';
    
    // 公共样式
    const baseClasses = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      loading && "opacity-70 cursor-wait",
      widthClass,
      className
    );
    
    // 如果as='a'或者有href，渲染为链接
    if (as === 'a' || href) {
      return (
        <Link 
          href={href || '#'}
          className={baseClasses} 
          target={target}
          onClick={(e) => {
            if (loading || disabled) {
              e.preventDefault();
            }
          }}
        >
          {renderButtonContent(loading, children)}
        </Link>
      );
    }
    
    return (
      <button
        className={baseClasses}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {renderButtonContent(loading, children)}
      </button>
    );
  }
);

// 辅助函数：渲染按钮内容
function renderButtonContent(loading: boolean, children: React.ReactNode) {
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span>{children}</span>
      </div>
    );
  }
  
  return children;
}

Button.displayName = 'Button';

export { Button }; 