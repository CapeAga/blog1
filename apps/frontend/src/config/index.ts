// 网站基本配置
export const siteConfig = {
  name: '个人博客网站',
  description: '基于Next.js和NestJS的个人博客网站',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
}

// API配置
export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
}

// 分页配置
export const paginationConfig = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
}

// 媒体配置
export const mediaConfig = {
  uploadUrl: `${apiConfig.baseUrl}/media/upload`,
  maxSize: 10 * 1024 * 1024, // 10MB
  acceptedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ],
}

// 缓存配置
export const cacheConfig = {
  staleTime: 60 * 1000, // 1分钟
  cachePolicies: {
    posts: 5 * 60 * 1000, // 5分钟
    categories: 10 * 60 * 1000, // 10分钟
    tags: 10 * 60 * 1000, // 10分钟
    aiTools: 30 * 60 * 1000, // 30分钟
  },
} 