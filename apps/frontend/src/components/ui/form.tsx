import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';

// 定义本地的cn函数
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={cn('space-y-4', className)}
        {...props}
      >
        {children}
      </form>
    );
  }
);
Form.displayName = 'Form';

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormItem = forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('space-y-2', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
FormItem.displayName = 'FormItem';

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * 是否为必填字段
   * @default false
   */
  required?: boolean;
}

const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, required = false, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium text-gray-700 dark:text-gray-300 block',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );
  }
);
FormLabel.displayName = 'FormLabel';

interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormControl = forwardRef<HTMLDivElement, FormControlProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mt-1', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
FormControl.displayName = 'FormControl';

interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormDescription = forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-xs text-gray-500 dark:text-gray-400 mt-1', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
FormDescription.displayName = 'FormDescription';

interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormError = forwardRef<HTMLParagraphElement, FormErrorProps>(
  ({ className, children, ...props }, ref) => {
    return children ? (
      <p
        ref={ref}
        className={cn('text-xs text-red-500 dark:text-red-400 mt-1', className)}
        {...props}
      >
        {children}
      </p>
    ) : null;
  }
);
FormError.displayName = 'FormError';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * 输入框状态
   * @default "default"
   */
  state?: 'default' | 'error' | 'success';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, state = 'default', type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
          'dark:border-gray-700 dark:bg-gray-800 dark:text-white',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          {
            'border-red-500 ring-red-500 focus:ring-red-500': state === 'error',
            'border-green-500 ring-green-500 focus:ring-green-500': state === 'success',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * 文本框状态
   * @default "default"
   */
  state?: 'default' | 'error' | 'success';
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, state = 'default', ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
          'dark:border-gray-700 dark:bg-gray-800 dark:text-white',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          {
            'border-red-500 ring-red-500 focus:ring-red-500': state === 'error',
            'border-green-500 ring-green-500 focus:ring-green-500': state === 'success',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * 选择框状态
   * @default "default"
   */
  state?: 'default' | 'error' | 'success';
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, state = 'default', children, ...props }, ref) => {
    return (
      <select
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
          'dark:border-gray-700 dark:bg-gray-800 dark:text-white',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          {
            'border-red-500 ring-red-500 focus:ring-red-500': state === 'error',
            'border-green-500 ring-green-500 focus:ring-green-500': state === 'success',
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormError,
  Input,
  Textarea,
  Select,
}; 