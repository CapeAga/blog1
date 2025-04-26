'use client';

import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="bg-background border-t border-border py-8 sm:py-10">
      <div className="px-4 sm:px-6 md:container md:mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} 个人博客. 保留所有权利.
            </p>
          </div>
          <div className="flex space-x-6 text-sm">
            <Link href="/about" className="text-muted-foreground hover:text-foreground no-underline">
              关于
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground no-underline">
              隐私政策
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground no-underline">
              服务条款
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 