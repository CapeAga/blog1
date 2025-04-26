'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import AdminLayout from '@/components/admin/layout/admin-layout';
import PostForm from '@/components/admin/posts/post-form';

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const response = await apiClient.blog.getPost(params.id);
        const postData = response as unknown as any;
        setPost(postData);
      } catch (err) {
        console.error('获取文章失败:', err);
        setError('无法加载文章，请稍后再试');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [params.id]);

  // 处理加载中状态
  if (loading) {
    return (
      <AdminLayout 
        title="编辑文章" 
        description="编辑现有的博客文章内容"
      >
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  // 处理错误状态
  if (error || !post) {
    return (
      <AdminLayout 
        title="编辑文章" 
        description="编辑现有的博客文章内容"
      >
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || '未找到文章'}
        </div>
        <div className="mt-4">
          <button
            onClick={() => router.push('/admin/posts')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            返回文章列表
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title={`编辑文章: ${post.title}`} 
      description="编辑现有的博客文章内容"
    >
      <PostForm post={post} isEditing={true} />
    </AdminLayout>
  );
} 