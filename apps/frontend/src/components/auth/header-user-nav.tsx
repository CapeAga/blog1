'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeaderUserNav() {
    return (
      <div className="flex items-center space-x-3">
        <Link href="/login" className="text-sm hover:text-blue-600 dark:hover:text-blue-400">
          登录
        </Link>
        <Link 
          href="/register" 
          className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 hover:no-underline"
        >
          注册
        </Link>
    </div>
  );
} 