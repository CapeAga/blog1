'use client';

import { usePosts } from '@/hooks/use-api';
import { useRouter } from 'next/navigation';
import PostCard from './post-card';
import PostSkeleton from './post-skeleton';
import type { Post } from './post-card';

interface PostListProps {
  categoryId?: string;
  tagId?: string;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

export default function PostList({
  categoryId,
  tagId,
  searchQuery,
  page = 1,
  pageSize = 10,
}: PostListProps) {
  // 根据不同的过滤条件获取文章列表
  const {
    posts,
    totalPosts,
    isLoading,
    isError,
  } = usePosts(page, pageSize);
  const router = useRouter();

  // 分页处理
  const handlePageChange = (newPage: number) => {
    // 构建查询参数
    const searchParams = new URLSearchParams();
    searchParams.set('page', newPage.toString());
    
    if (categoryId) searchParams.set('category', categoryId);
    if (tagId) searchParams.set('tag', tagId);
    if (searchQuery) searchParams.set('q', searchQuery);
    
    // 使用客户端导航
    router.push(`?${searchParams.toString()}`);
  };

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <PostSkeleton key={index} />
        ))}
      </div>
    );
  }

  // 显示错误信息
  if (isError) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg">
        <h3 className="text-lg font-medium mb-2">加载失败</h3>
        <p>无法加载文章列表，请稍后再试。</p>
      </div>
    );
  }

  // 没有文章时显示提示
  if (posts.length === 0) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-800 text-center rounded-lg">
        <h3 className="text-lg font-medium mb-2">没有找到文章</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {searchQuery
            ? `没有找到与"${searchQuery}"相关的文章。`
            : categoryId
            ? '此分类下没有文章。'
            : tagId
            ? '此标签下没有文章。'
            : '暂时没有文章。'}
        </p>
      </div>
    );
  }

  // 显示文章列表
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* 分页器 - 简单版本 */}
      {totalPosts > pageSize && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              disabled={page === 1}
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
              onClick={() => handlePageChange(page - 1)}
            >
              上一页
            </button>
            
            <span className="px-3 py-1 text-sm">
              第 {page} 页，共 {Math.ceil(totalPosts / pageSize)} 页
            </span>
            
            <button
              disabled={page >= Math.ceil(totalPosts / pageSize)}
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
              onClick={() => handlePageChange(page + 1)}
            >
              下一页
            </button>
          </nav>
        </div>
      )}
    </div>
  );
} 