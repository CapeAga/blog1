'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-16 md:gap-24">
      <section className="flex flex-col items-center text-center max-w-3xl gap-4 md:gap-6">
        <h1 className="font-serif">欢迎来到我的个人博客</h1>
          
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            这是一个使用Next.js构建的现代博客平台，提供文章撰写、AI工具集成以及完整的内容管理系统。
        </p>
          
        <div className="text-sm text-muted-foreground mt-4">
          探索下面的主要板块或直接 <Link href="/blog" className="text-primary hover:underline font-medium">阅读博客</Link>.
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
          >
              浏览博客文章
          </Link>
          <Link 
            href="/ai-tools" 
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
          >
              体验AI工具
          </Link>
          </div>
      </section>
        
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 w-full max-w-6xl">
        <div className="border border-border rounded-lg p-6 flex flex-col">
          <h3 className="font-serif mb-3">文章与博客</h3>
          <p className="text-muted-foreground text-sm mb-5 flex-grow">
              分享我的想法、经验和见解，涵盖技术、设计和个人成长等主题。
          </p>
          <Link href="/blog" className="text-sm font-medium text-primary hover:underline mt-auto">
            阅读文章 &rarr;
          </Link>
          </div>
          
        <div className="border border-border rounded-lg p-6 flex flex-col">
          <h3 className="font-serif mb-3">AI工具集</h3>
          <p className="text-muted-foreground text-sm mb-5 flex-grow">
              探索各种AI辅助工具，帮助提高生产力和创造力。
          </p>
          <Link href="/ai-tools" className="text-sm font-medium text-primary hover:underline mt-auto">
            查看工具 &rarr;
          </Link>
          </div>
          
        <div className="border border-border rounded-lg p-6 flex flex-col">
          <h3 className="font-serif mb-3">关于我</h3>
          <p className="text-muted-foreground text-sm mb-5 flex-grow">
              了解我的背景、技能和项目经验。
          </p>
          <Link href="/about" className="text-sm font-medium text-primary hover:underline mt-auto">
            了解更多 &rarr;
          </Link>
        </div>
      </section>
      </div>
  );
}
