import React from "react";
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 定义本地的cn函数
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * 文本的变体
   * @default 'body'
   */
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'body-sm' | 'body1' | 'body2' | 'caption' | 'overline';
  
  /**
   * 文本颜色
   * @default 'default'
   */
  color?: 'default' | 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'error';
  
  /**
   * 文本粗细
   */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  
  /**
   * 文本对齐方式
   */
  align?: 'left' | 'center' | 'right' | 'justify';
  
  /**
   * 文本截断
   */
  truncate?: boolean;
  
  /**
   * 文本变换
   */
  transform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  
  /**
   * 是否应用响应式字体大小
   * @default true
   */
  responsive?: boolean;
  
  /**
   * 作为HTML元素
   */
  as?: React.ElementType;
}

/**
 * 文本组件
 */
const Text = React.forwardRef<HTMLElement, TextProps>(({
  variant = 'body',
  color = 'default',
  weight = 'normal',
  align = 'left',
  truncate = false,
  transform = 'none',
  responsive = true,
  as,
  className,
  children,
  ...props
}, ref) => {
  // 变体样式
  const variantClasses = {
    h1: 'text-3xl font-bold leading-tight',
    h2: 'text-2xl font-bold leading-tight',
    h3: 'text-xl font-bold leading-tight',
    h4: 'text-lg font-bold leading-tight',
    h5: 'text-base font-bold leading-tight',
    h6: 'text-sm font-bold leading-tight',
    body: 'text-base leading-normal',
    'body-sm': 'text-sm leading-normal',
    body1: 'text-base leading-normal',
    body2: 'text-sm leading-normal',
    caption: 'text-xs leading-normal',
    overline: 'text-xs uppercase tracking-wider'
  };

  // 响应式变体样式
  const responsiveVariantClasses = {
    h1: 'text-2xl sm:text-3xl md:text-4xl font-bold leading-tight',
    h2: 'text-xl sm:text-2xl md:text-3xl font-bold leading-tight',
    h3: 'text-lg sm:text-xl md:text-2xl font-bold leading-tight',
    h4: 'text-base sm:text-lg md:text-xl font-bold leading-tight',
    h5: 'text-sm sm:text-base md:text-lg font-bold leading-tight',
    h6: 'text-xs sm:text-sm md:text-base font-bold leading-normal',
    body: 'text-sm sm:text-base leading-normal',
    'body-sm': 'text-xs sm:text-sm leading-normal',
    body1: 'text-sm sm:text-base leading-normal',
    body2: 'text-xs sm:text-sm leading-normal',
    caption: 'text-xs leading-normal',
    overline: 'text-xs uppercase tracking-wider'
  };

  // 颜色样式
  const colorClasses = {
    default: 'text-gray-900 dark:text-gray-100',
    primary: 'text-blue-600 dark:text-blue-400',
    secondary: 'text-gray-600 dark:text-gray-400',
    muted: 'text-gray-500 dark:text-gray-500',
    accent: 'text-purple-600 dark:text-purple-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    error: 'text-red-600 dark:text-red-400'
  };

  // 字重样式
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  // 对齐样式
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  // 文本变换样式
  const transformClasses = {
    none: '',
    capitalize: 'capitalize',
    uppercase: 'uppercase',
    lowercase: 'lowercase'
  };

  const classes = twMerge(
    responsive ? responsiveVariantClasses[variant] : variantClasses[variant],
    colorClasses[color],
    variant.startsWith('h') ? '' : weightClasses[weight], // 标题已包含font-bold
    alignClasses[align],
    transformClasses[transform],
    truncate ? 'truncate' : '',
    className
  );

  const Component = as || (
    variant === 'h1' ? 'h1' :
    variant === 'h2' ? 'h2' :
    variant === 'h3' ? 'h3' :
    variant === 'h4' ? 'h4' :
    variant === 'h5' ? 'h5' :
    variant === 'h6' ? 'h6' :
    variant === 'overline' ? 'span' :
    variant === 'caption' ? 'span' :
    variant === 'body1' ? 'p' :
    variant === 'body2' ? 'p' : 'p'
  );

  return (
    <Component ref={ref} className={classes} {...props}>
      {children}
    </Component>
  );
});

Text.displayName = 'Text';

export { Text }; 