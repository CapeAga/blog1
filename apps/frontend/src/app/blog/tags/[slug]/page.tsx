'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import PostCard from '@/components/blog/post-card';
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import type { Post } from '@/components/blog/post-card';

interface Tag {
  id: string;
  name: string;
  slug: string;
}

export default function TagPostsPage({ params }: { params: { slug: string } }) {
  const [tag, setTag] = useState<Tag | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  
  useEffect(() => {
    async function fetchTagAndPosts() {
      try {
        setLoading(true);
        
        // 获取标签信息
        const tagsResponse = await apiClient.blog.getTags();
        const tagsData = tagsResponse as unknown as { items: Tag[] };
        const foundTag = tagsData.items.find(t => t.slug === params.slug);
        
        if (!foundTag) {
          setError('未找到该标签');
          setLoading(false);
          return;
        }
        
        setTag(foundTag);
        
        // 获取该标签下的文章
        const postsResponse = await apiClient.blog.getPosts({
          page,
          limit: 9,
          tag: foundTag.id
        });
        
        const postsData = postsResponse as unknown as {
          items: Post[];
          meta: {
            totalItems: number;
            totalPages: number;
          }
        };
        
        setPosts(postsData.items || []);
        setTotalPages(postsData.meta.totalPages || 1);
      } catch (err) {
        console.error('获取标签文章失败:', err);
        setError('获取标签文章失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    }
    
    fetchTagAndPosts();
  }, [params.slug, page]);
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="px-4 py-6 sm:px-6 md:container md:mx-auto md:py-8">
      {/* 面包屑导航 */}
      <Breadcrumb className="mb-4">
        <BreadcrumbItem>
          <Link href="/" className="text-muted-foreground hover:text-foreground hover:underline transition-colors">首页</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href="/blog" className="text-muted-foreground hover:text-foreground hover:underline transition-colors">博客</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href="/blog/tags" className="text-muted-foreground hover:text-foreground hover:underline transition-colors">标签</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <span className="text-foreground font-medium">{tag?.name || '加载中...'}</span>
        </BreadcrumbItem>
      </Breadcrumb>
      
      {/* 标签标题 */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center">
          <span className="mr-2">标签:</span>
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
            {tag?.name || '加载中...'}
          </span>
        </h1>
      </div>
      
      {/* 文章列表 */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">该标签下暂无文章</p>
          <Link
            href="/blog"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            返回博客首页
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          
          {/* 分页 */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-1 sm:gap-2">
                {page > 1 && (
                  <Link
                    href={`/blog/tags/${params.slug}?page=${page - 1}`}
                    className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page - 1);
                    }}
                  >
                    上一页
                  </Link>
                )}
                
                <span className="text-sm">第 {page} 页，共 {totalPages} 页</span>
                
                {page < totalPages && (
                  <Link
                    href={`/blog/tags/${params.slug}?page=${page + 1}`}
                    className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page + 1);
                    }}
                  >
                    下一页
                  </Link>
                )}
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
} 