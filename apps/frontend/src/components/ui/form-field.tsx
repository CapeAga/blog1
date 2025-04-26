import React from 'react';
import { cn } from '@/lib/utils';
import { Input, InputProps } from './input';

export interface FormFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * 表单控件ID
   */
  id: string;
  
  /**
   * 表单控件标签
   */
  label: string;
  
  /**
   * 错误消息
   */
  error?: string;
  
  /**
   * 帮助文本
   */
  helpText?: string;
  
  /**
   * 是否必填
   * @default false
   */
  isRequired?: boolean;
  
  /**
   * 表单字段方向
   * @default "vertical"
   */
  direction?: 'vertical' | 'horizontal';
  
  /**
   * 输入框属性
   */
  inputProps?: InputProps;
  
  /**
   * 自定义输入组件（替代默认的Input）
   */
  inputComponent?: React.ReactNode;
}

/**
 * 表单字段组件，包含标签、输入框和错误消息提示
 */
export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      id,
      label,
      error,
      helpText,
      isRequired = false,
      direction = 'vertical',
      inputProps,
      inputComponent,
      className,
      ...rest
    },
    ref
  ) => {
    // 根据错误状态设置输入框状态
    const inputStatus = error ? 'error' : 'default';
    
    // 方向样式
    const directionClasses = {
      vertical: 'flex flex-col space-y-1.5',
      horizontal: 'sm:flex sm:items-center sm:space-x-4',
    };
    
    // 标签样式（根据方向）
    const labelClasses = {
      vertical: 'block text-sm font-medium text-gray-700 dark:text-gray-300',
      horizontal: 'block text-sm font-medium text-gray-700 dark:text-gray-300 sm:w-1/3',
    };
    
    // 输入区域样式（根据方向）
    const inputAreaClasses = {
      vertical: 'w-full',
      horizontal: 'w-full sm:w-2/3 mt-1 sm:mt-0',
    };
    
    return (
      <div 
        ref={ref}
        className={cn('mb-4', directionClasses[direction], className)} 
        {...rest}
      >
        <label 
          htmlFor={id} 
          className={labelClasses[direction]}
        >
          {label}
          {isRequired && <span className="ml-1 text-red-500">*</span>}
        </label>
        
        <div className={inputAreaClasses[direction]}>
          {inputComponent || (
            <Input
              id={id}
              status={inputStatus}
              isFullWidth
              aria-invalid={!!error}
              aria-describedby={error ? `${id}-error` : helpText ? `${id}-description` : undefined}
              {...inputProps}
            />
          )}
          
          {helpText && !error && (
            <p 
              id={`${id}-description`} 
              className="mt-1 text-xs text-gray-500 dark:text-gray-400"
            >
              {helpText}
            </p>
          )}
          
          {error && (
            <p 
              id={`${id}-error`} 
              className="mt-1 text-xs text-red-500 dark:text-red-400"
            >
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

FormField.displayName = 'FormField'; 