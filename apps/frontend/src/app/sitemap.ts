import { MetadataRoute } from 'next';
import { apiClient } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 基础URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  
  // 静态页面
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ai-tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ] as MetadataRoute.Sitemap;

  try {
    // 获取所有文章
    const response = await apiClient.blog.getPosts();
    const postsData = response as unknown as { items: any[] };
    const posts = postsData.items;

    // 获取所有分类
    const catResponse = await apiClient.blog.getCategories();
    const categoriesData = catResponse as unknown as { items: any[] };
    const categories = categoriesData.items;

    // 获取所有标签
    const tagResponse = await apiClient.blog.getTags();
    const tagsData = tagResponse as unknown as { items: any[] };
    const tags = tagsData.items;

    // 文章页面
    const postPages = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // 分类页面
    const categoryPages = categories.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(category.updatedAt || category.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // 标签页面
    const tagPages = tags.map((tag) => ({
      url: `${baseUrl}/tags/${tag.slug}`,
      lastModified: new Date(tag.updatedAt || tag.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // 合并所有页面
    return [...staticPages, ...postPages, ...categoryPages, ...tagPages];
  } catch (error) {
    console.error('生成网站地图失败:', error);
    // 如果API请求失败，只返回静态页面
    return staticPages;
  }
} 