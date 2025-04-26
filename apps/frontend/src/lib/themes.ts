// 设计系统 - 主题变量定义
// 这个文件定义了应用中使用的所有设计变量
// 所有组件都应该引用这里的值，而不是直接使用硬编码的颜色或尺寸

export const theme = {
  // 颜色系统
  colors: {
    // 主要颜色 - 蓝色系列
    primary: {
      50: '#ebf5ff',
      100: '#e1efff',
      200: '#c3defe',
      300: '#93befa',
      400: '#609df4',
      500: '#3b82f6', // 默认主色
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    
    // 灰色系列 - 用于文本、边框、背景等
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712',
    },
    
    // 成功状态
    success: {
      light: '#ecfdf5',
      main: '#10b981',
      dark: '#065f46',
    },
    
    // 警告状态
    warning: {
      light: '#fffbeb',
      main: '#f59e0b',
      dark: '#92400e',
    },
    
    // 错误状态
    error: {
      light: '#fef2f2',
      main: '#ef4444',
      dark: '#b91c1c',
    },
    
    // 信息状态
    info: {
      light: '#eff6ff',
      main: '#0ea5e9',
      dark: '#0369a1',
    },
    
    // 背景颜色
    background: {
      light: '#ffffff',
      main: '#f9fafb',
      dark: '#111827',
    },
    
    // 文本颜色
    text: {
      primary: '#111827',
      secondary: '#4b5563',
      disabled: '#9ca3af',
      light: '#ffffff',
    },
  },
  
  // 字体系统
  typography: {
    // 字体家族
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Georgia', 'serif'],
      mono: ['Fira Code', 'monospace'],
    },
    
    // 字体大小 (rem)
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    
    // 行高
    lineHeight: {
      none: '1',
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
      loose: '2',
    },
    
    // 字重
    fontWeight: {
      thin: '100',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },
  
  // 间距系统 (rem)
  spacing: {
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    3: '0.75rem',     // 12px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    8: '2rem',        // 32px
    10: '2.5rem',     // 40px
    12: '3rem',       // 48px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
  },
  
  // 边框半径
  borderRadius: {
    none: '0',
    sm: '0.125rem',    // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem',     // 6px
    lg: '0.5rem',       // 8px
    xl: '0.75rem',      // 12px
    '2xl': '1rem',      // 16px
    '3xl': '1.5rem',    // 24px
    full: '9999px',
  },
  
  // 阴影
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
  },
  
  // 断点 (px)
  breakpoints: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  
  // z-index层级
  zIndex: {
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    auto: 'auto',
    dropdown: 1000,
    sticky: 1100,
    modal: 1300,
    popover: 1400,
    tooltip: 1500,
  },

  // 动画时间
  animation: {
    fast: '0.15s',
    normal: '0.3s',
    slow: '0.5s',
  },
};

// 主题的类型定义
export type Theme = typeof theme;

// 帮助函数，用于在组件中获取主题变量
export const getThemeValue = (path: string): unknown => {
  const parts = path.split('.');
  let result: any = theme;
  
  for (const part of parts) {
    if (result === undefined || result[part] === undefined) {
      console.warn(`主题变量路径 "${path}" 不存在`);
      return undefined;
    }
    result = result[part];
  }
  
  return result;
};

export default theme; 