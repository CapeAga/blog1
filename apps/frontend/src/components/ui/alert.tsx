import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

// 定义本地的cn函数
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 警告框变体
   * @default "info"
   */
  variant?: 'info' | 'success' | 'warning' | 'error';
  
  /**
   * 警告框标题
   */
  title?: string;
  
  /**
   * 是否显示关闭按钮
   * @default false
   */
  dismissible?: boolean;
  
  /**
   * 关闭按钮点击事件
   */
  onDismiss?: () => void;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    className, 
    variant = 'info', 
    title, 
    children, 
    dismissible = false, 
    onDismiss, 
    ...props 
  }, ref) => {
    
    // 根据变体定义样式
    const variantStyles = {
      info: {
        container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
        icon: <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
        title: 'text-blue-800 dark:text-blue-300',
        content: 'text-blue-700 dark:text-blue-300',
      },
      success: {
        container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
        icon: <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />,
        title: 'text-green-800 dark:text-green-300',
        content: 'text-green-700 dark:text-green-300',
      },
      warning: {
        container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
        icon: <AlertTriangle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />,
        title: 'text-yellow-800 dark:text-yellow-300',
        content: 'text-yellow-700 dark:text-yellow-300',
      },
      error: {
        container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
        icon: <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />,
        title: 'text-red-800 dark:text-red-300',
        content: 'text-red-700 dark:text-red-300',
      },
    };
    
    const currentStyle = variantStyles[variant];
    
    return (
      <div
        ref={ref}
        className={cn(
          'flex gap-3 p-4 border rounded-md relative',
          currentStyle.container,
          className
        )}
        role="alert"
        {...props}
      >
        <div className="flex-shrink-0">
          {currentStyle.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={cn('text-sm font-medium mb-1', currentStyle.title)}>
              {title}
            </h3>
          )}
          
          <div className={cn('text-sm', currentStyle.content)}>
            {children}
          </div>
        </div>
        
        {dismissible && (
          <button
            type="button"
            className={cn(
              'p-1 rounded-md absolute top-2 right-2 hover:bg-black/5 dark:hover:bg-white/5',
              currentStyle.title
            )}
            onClick={onDismiss}
            aria-label="关闭"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export { Alert }; 