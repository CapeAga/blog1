'use client';

// 注意：这是在Next.js 13+ App Router中使用的metadata组件
// 基于React组件的方式扩展了App Router的metadata功能

import { useEffect } from 'react';

interface MetaHeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  canonicalUrl?: string;
}

/**
 * SEO元数据组件 - 客户端版本
 * 用于在客户端组件中动态更新页面标题和描述
 * 
 * 注意：在Next.js 13+ App Router中，最好是在layout.tsx或page.tsx中使用metadata导出
 * 这个组件仅用于在客户端组件中需要动态更新标题的情况
 */
export default function MetaHead({
  title = '个人博客',
  description = '这是一个分享技术、知识和见解的个人博客',
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonicalUrl,
}: MetaHeadProps) {
  // 构建完整标题
  const fullTitle = title ? `${title} | 个人博客` : '个人博客';

  // 使用useEffect在客户端更新document.title
  useEffect(() => {
    // 更新标题
    document.title = fullTitle;
    
    // 更新描述
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
    
    // 更新Open Graph标签
    updateMetaTag('property', 'og:title', fullTitle);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:type', ogType);
    if (ogImage) {
      updateMetaTag('property', 'og:image', ogImage);
    }
    
    // 更新Twitter卡片
    updateMetaTag('name', 'twitter:card', twitterCard);
    updateMetaTag('name', 'twitter:title', fullTitle);
    updateMetaTag('name', 'twitter:description', description);
    if (ogImage) {
      updateMetaTag('name', 'twitter:image', ogImage);
    }
    
    // 更新规范链接
    if (canonicalUrl) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', canonicalUrl);
    }
  }, [fullTitle, description, ogImage, ogType, twitterCard, canonicalUrl]);

  // 辅助函数：更新或创建meta标签
  function updateMetaTag(attributeName: string, attributeValue: string, content: string) {
    let metaTag = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute(attributeName, attributeValue);
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', content);
  }

  // 这个组件不渲染任何可见内容
  return null;
} 