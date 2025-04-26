'use client';

import Link from 'next/link';
import HeaderUserNav from '@/components/auth/header-user-nav';

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 bg-background border-b border-border">
      <div className="px-4 py-4 sm:px-6 md:container md:mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl sm:text-3xl font-serif font-bold text-foreground hover:text-primary no-underline">
          个人博客
        </Link>
        <nav className="hidden md:flex space-x-8 text-sm tracking-wide">
          <Link href="/" className="text-muted-foreground hover:text-foreground no-underline">首页</Link>
          <Link href="/blog" className="text-muted-foreground hover:text-foreground no-underline">博客</Link>
          <Link href="/ai-tools" className="text-muted-foreground hover:text-foreground no-underline">AI工具</Link>
          <Link href="/about" className="text-muted-foreground hover:text-foreground no-underline">关于</Link>
        </nav>
        <div className="flex items-center space-x-3 sm:space-x-4">
          <HeaderUserNav />
          <button className="md:hidden p-1 text-muted-foreground hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
} 