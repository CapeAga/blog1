import React from "react";
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 定义本地的cn函数
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 容器的最大宽度
   * @default 'default'
   */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'default';
  
  /**
   * 是否居中
   * @default true
   */
  center?: boolean;
  
  /**
   * 是否添加水平内边距
   * @default true
   */
  paddingX?: boolean;
  
  /**
   * 嵌套内部元素
   */
  as?: React.ElementType;
}

/**
 * 响应式容器组件
 */
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className,
      children,
      maxWidth = 'default',
      center = true,
      paddingX = true,
      as: Component = 'div',
      ...props
    },
    ref
  ) => {
    // 最大宽度样式
    const maxWidthStyles = {
      xs: "max-w-xs",
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      default: "max-w-7xl",
      full: "max-w-full",
    };

    return (
      <Component
        className={cn(
          "w-full",
          maxWidthStyles[maxWidth],
          center && "mx-auto",
          paddingX && "px-4 sm:px-6 md:px-8",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'Container';

export { Container }; 