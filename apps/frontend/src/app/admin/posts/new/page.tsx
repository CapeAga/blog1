'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/layout/admin-layout';
import PostForm from '@/components/admin/posts/post-form';

export default function NewPostPage() {
  return (
    <AdminLayout 
      title="新建文章" 
      description="创建新的博客文章内容"
    >
      <PostForm />
    </AdminLayout>
  );
} 