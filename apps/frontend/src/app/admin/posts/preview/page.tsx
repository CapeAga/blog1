'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/layout/admin-layout';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import Link from 'next/link';

// 文章预览页面
export default function PostPreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 从URL参数中获取文章数据
    try {
      const postData = searchParams.get('data');
      if (postData) {
        const decodedData = JSON.parse(decodeURIComponent(postData));
        setPost(decodedData);
      }
    } catch (error) {
      console.error('解析文章数据失败:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      return format(new Date(dateString), 'yyyy年MM月dd日', { locale: zhCN });
    } catch (error) {
      return '';
    }
  };
  
  // 返回按钮点击处理
  const handleBackClick = () => {
    router.back();
  };
  
  if (loading) {
    return (
      <AdminLayout title="文章预览" description="预览文章内容">
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }
  
  if (!post) {
    return (
      <AdminLayout title="文章预览" description="预览文章内容">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          未找到文章数据，请返回编辑页面
        </div>
        <div className="mt-4">
          <button
            onClick={handleBackClick}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            返回
          </button>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title="文章预览" description="预览文章内容">
      {/* 操作栏 */}
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={handleBackClick}
          className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
        >
          返回编辑
        </button>
        
        <div className="space-x-2">
          <span className="text-sm text-gray-500">这是预览视图，以下是文章发布后的效果</span>
        </div>
      </div>
      
      {/* 文章内容预览 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* 特色图片 */}
        {post.featuredImage && (
          <div className="w-full h-64 md:h-80 overflow-hidden">
            <img 
              src={post.featuredImage} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6 md:p-8">
          {/* 文章标题 */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {post.title}
          </h1>
          
          {/* 文章元信息 */}
          <div className="flex flex-wrap gap-2 md:gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center">
              <span className="mr-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </span>
              <span>{formatDate(post.createdAt || new Date().toISOString())}</span>
            </div>
            
            {post.categoryId && (
              <div className="flex items-center">
                <span className="mr-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                </span>
                <span>{post.categoryName || '未分类'}</span>
              </div>
            )}
            
            <div className="flex items-center">
              <span className="mr-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </span>
              <span>预览模式</span>
            </div>
          </div>
          
          {/* 摘要 */}
          {post.excerpt && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md border-l-4 border-blue-500 dark:border-blue-400">
              <p className="text-gray-700 dark:text-gray-300 italic">
                {post.excerpt}
              </p>
            </div>
          )}
          
          {/* 正文内容 */}
          <div 
            className="prose prose-lg dark:prose-invert prose-blue max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
          
          {/* 标签 */}
          {post.tagIds && post.tagIds.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {post.tagIds.map((tagId: string) => (
                  <span 
                    key={tagId} 
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                  >
                    {tagId}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
} 