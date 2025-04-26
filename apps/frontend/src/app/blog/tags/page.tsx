'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchTags() {
      try {
        setLoading(true);
        const response = await apiClient.blog.getTags();
        const data = response as unknown as { items: Tag[] };
        
        // 按照文章数量排序
        const sortedTags = [...(data.items || [])].sort((a, b) => b.postCount - a.postCount);
        setTags(sortedTags);
      } catch (err) {
        console.error('获取标签列表失败:', err);
        setError('获取标签列表失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    }
    
    fetchTags();
  }, []);
  
  // 根据文章数量计算标签的大小
  const getTagSize = (postCount: number): string => {
    const max = Math.max(...tags.map(t => t.postCount));
    const min = Math.min(...tags.map(t => t.postCount));
    
    if (max === min) return 'text-base sm:text-lg';
    
    const range = max - min;
    const normalized = (postCount - min) / range;
    
    if (normalized > 0.8) return 'text-xl sm:text-2xl font-semibold';
    if (normalized > 0.6) return 'text-lg sm:text-xl font-medium';
    if (normalized > 0.4) return 'text-base sm:text-lg';
    if (normalized > 0.2) return 'text-sm sm:text-base';
    return 'text-xs sm:text-sm';
  };
  
  return (
    <div className="px-4 py-6 sm:px-6 md:container md:mx-auto md:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">文章标签</h1>
      
      {loading ? (
        <div className="flex justify-center py-10 sm:py-16">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10 sm:py-16">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      ) : tags.length === 0 ? (
        <div className="text-center py-10 sm:py-16">
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">暂无标签</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sm:p-8">
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {tags.map(tag => (
              <Link 
                key={tag.id}
                href={`/blog/tags/${tag.slug}`}
                className={`inline-block px-3 sm:px-4 py-1 sm:py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors ${getTagSize(tag.postCount)}`}
              >
                {tag.name}
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  ({tag.postCount})
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 