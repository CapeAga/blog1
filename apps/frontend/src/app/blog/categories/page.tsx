'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const response = await apiClient.blog.getCategories();
        const data = response as unknown as { items: Category[] };
        
        setCategories(data.items || []);
      } catch (err) {
        console.error('获取分类列表失败:', err);
        setError('获取分类列表失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    }
    
    fetchCategories();
  }, []);
  
  return (
    <div className="px-4 py-6 sm:px-6 md:container md:mx-auto md:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">文章分类</h1>
      
      {loading ? (
        <div className="flex justify-center py-10 sm:py-16">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10 sm:py-16">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-10 sm:py-16">
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">暂无分类</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {categories.map(category => (
            <Link 
              key={category.id}
              href={`/blog/categories/${category.slug}`}
              className="block p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-2">{category.name}</h2>
              
              {category.description && (
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {category.description}
                </p>
              )}
              
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-auto">
                {category.postCount} 篇文章
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 