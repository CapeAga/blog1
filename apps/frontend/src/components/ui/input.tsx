import React from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// 如果已经有utils文件，可以使用下面导入替代
// import { cn } from "@/lib/utils";

// 定义本地的cn函数，以防utils不可用
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      error,
      label,
      helperText,
      startIcon,
      endIcon,
      type,
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    // 动态样式
    const inputWrapperClasses = cn(
      "flex items-center relative",
      fullWidth && "w-full",
      error ? "border-red-500 focus-within:border-red-500" : ""
    );

    const inputClasses = cn(
      "flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "placeholder:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      startIcon && "pl-10",
      endIcon && "pr-10",
      error && "border-red-500 focus-visible:ring-red-500",
      fullWidth && "w-full",
      className
    );

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label
            className={cn(
              "block text-sm font-medium mb-1.5",
              error ? "text-red-500" : "text-foreground"
            )}
          >
            {label}
          </label>
        )}
        <div className={inputWrapperClasses}>
          {startIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none">
              {startIcon}
            </div>
          )}
          <input
            type={type}
            className={inputClasses}
            ref={ref}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3 flex items-center">
              {endIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={cn(
              "mt-1.5 text-xs",
              error ? "text-red-500" : "text-muted-foreground"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input }; 