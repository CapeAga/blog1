'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import PostCard from '@/components/blog/post-card';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/layout/page-header';
import { Pagination } from '@/components/ui/pagination';
import { Text } from '@/components/ui/text';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { TagIcon, FolderIcon, Search } from 'lucide-react';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  publishedAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  categories?: {
    id: string;
    name: string;
    slug: string;
  }[];
  tags?: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      const pageNumber = parseInt(pageParam, 10);
      if (!isNaN(pageNumber) && pageNumber > 0) {
        setCurrentPage(pageNumber);
      }
    } else {
      setCurrentPage(1); // 重置为第一页，如果没有页码参数
    }
  }, [searchParams]);
  
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await apiClient.blog.getPosts({
          page: currentPage,
          limit: 9,
        });
        
        const data = response as unknown as {
          items: Post[];
          meta: {
            totalItems: number;
            itemsPerPage: number;
            totalPages: number;
            currentPage: number;
          };
        };
        
        setPosts(data.items || []);
        setTotalPages(data.meta.totalPages || 1);
      } catch (err) {
        console.error('获取文章列表失败:', err);
        setError('获取文章列表失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPosts();
  }, [currentPage]);
  
  const handlePageChange = (page: number) => {
    router.push(`/blog?page=${page}`);
    setCurrentPage(page);
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // 页面标题操作按钮
  const pageActions = [
    {
      label: '分类',
      icon: <FolderIcon size={16} />,
      onClick: () => router.push('/blog/categories'),
      variant: 'outline' as const,
    },
    {
      label: '标签',
      icon: <TagIcon size={16} />,
      onClick: () => router.push('/blog/tags'),
      variant: 'outline' as const,
    },
    {
      label: '搜索',
      icon: <Search size={16} />,
      onClick: () => router.push('/blog/search'),
      variant: 'primary' as const,
    },
  ];

  return (
    <Container maxWidth="default">
      <PageHeader
        title="博客文章"
        description="探索最新的技术文章、教程和见解"
        actions={pageActions}
      />
      
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <Alert 
          variant="error" 
          title="加载错误" 
          className="my-8"
        >
          {error}
        </Alert>
      ) : posts.length === 0 ? (
        <Alert variant="info" className="my-8">
          暂无文章发布，请稍后再来查看。
        </Alert>
      ) : (
        <>
          {/* 放置第一篇文章作为特色文章 */}
          {posts.length > 0 && (
            <div className="mb-8">
              <PostCard post={posts[0]} variant="featured" />
            </div>
          )}
          
          {/* 其余文章列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(1).map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          
          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className="mt-10">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                showPrevNextButtons
                centered
              />
            </div>
          )}
        </>
      )}
    </Container>
  );
} 