'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/layout/admin-layout';
import PostList from '@/components/admin/posts/post-list';

export default function PostsPage() {
  const router = useRouter();
  
  const handleCreatePost = () => {
    router.push('/admin/posts/new');
  };

  return (
    <AdminLayout 
      title="文章管理" 
      description="管理博客文章，包括发布、编辑和删除文章"
    >
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">所有文章</h2>
        <button
          onClick={handleCreatePost}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          新建文章
        </button>
      </div>
      
      <PostList />
    </AdminLayout>
  );
} 