import React from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Container } from '../ui/container';

// 定义本地的cn函数
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ContentLayoutProps {
  /**
   * 主内容
   */
  children: React.ReactNode;
  
  /**
   * 侧边栏内容，如果不提供则为单栏布局
   */
  sidebar?: React.ReactNode;
  
  /**
   * 侧边栏位置
   * @default 'left'
   */
  sidebarPosition?: 'left' | 'right';
  
  /**
   * 侧边栏宽度
   * @default 'md'
   */
  sidebarWidth?: 'sm' | 'md' | 'lg';
  
  /**
   * 主内容最大宽度
   * @default 'default'
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'default';
  
  /**
   * 内容内边距
   * @default true
   */
  withPadding?: boolean;
  
  /**
   * 是否包含内容背景
   * @default false
   */
  withBackground?: boolean;
  
  /**
   * 额外类名
   */
  className?: string;
}

export function ContentLayout({
  children,
  sidebar,
  sidebarPosition = 'left',
  sidebarWidth = 'md',
  maxWidth = 'default',
  withPadding = true,
  withBackground = false,
  className,
}: ContentLayoutProps) {
  // 侧边栏宽度
  const sidebarWidthClasses = {
    sm: 'w-full md:w-64',
    md: 'w-full md:w-80',
    lg: 'w-full md:w-96',
  };
  
  // 内容区域背景
  const contentBackground = withBackground 
    ? 'bg-card rounded-lg shadow-sm' 
    : '';
  
  // 内容区域内边距
  const contentPadding = withPadding 
    ? 'p-6' 
    : '';
  
  // 构建布局
  const renderContent = () => {
    // 无侧边栏的情况
    if (!sidebar) {
      return (
        <div 
          className={cn(
            'w-full',
            contentBackground,
            contentPadding,
            className
          )}
        >
          {children}
        </div>
      );
    }
    
    // 有侧边栏的情况
    return (
      <div 
        className={cn(
          'flex flex-col md:flex-row w-full gap-8',
          sidebarPosition === 'right' && 'md:flex-row-reverse',
          className
        )}
      >
        {/* 侧边栏 */}
        <div className={cn(sidebarWidthClasses[sidebarWidth], 'shrink-0')}>
          {sidebar}
        </div>
        
        {/* 主内容 */}
        <div 
          className={cn(
            'flex-1 min-w-0',
            contentBackground,
            contentPadding
          )}
        >
          {children}
        </div>
      </div>
    );
  };
  
  return (
    <Container maxWidth={maxWidth} className="py-6">
      {renderContent()}
    </Container>
  );
} 