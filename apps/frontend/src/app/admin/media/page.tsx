'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/admin-layout';
import MediaLibrary from '@/components/admin/media/media-library';

export default function MediaPage() {
  return (
    <AdminLayout 
      title="媒体库" 
      description="管理所有上传的图片、视频等媒体文件"
    >
      <MediaLibrary />
    </AdminLayout>
  );
} 