import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // 基础URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', // 不允许爬取管理页面
        '/api/',   // 不允许爬取API
        '/login',  // 不允许爬取登录页
        '/register', // 不允许爬取注册页
        '/profile', // 不允许爬取个人资料页
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
} 