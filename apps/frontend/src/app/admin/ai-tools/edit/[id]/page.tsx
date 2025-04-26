'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import AdminLayout from '@/components/admin/layout/admin-layout';
import AIToolForm from '@/components/admin/ai-tools/ai-tool-form';

interface AITool {
  id: string;
  name: string;
  description: string;
  embedUrl: string;
  iconUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EditAIToolPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [tool, setTool] = useState<AITool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTool() {
      try {
        setLoading(true);
        const response = await apiClient.aiTools.getTool(params.id);
        setTool(response as unknown as AITool);
      } catch (err) {
        console.error('获取AI工具详情失败:', err);
        setError('获取AI工具详情失败');
        
        // 错误时返回列表页
        setTimeout(() => {
          router.push('/admin/ai-tools');
        }, 2000);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchTool();
    }
  }, [params.id, router]);

  return (
    <AdminLayout 
      title="编辑AI工具" 
      description="修改AI工具信息"
    >
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      ) : tool ? (
        <AIToolForm tool={tool} isEditing={true} />
      ) : null}
    </AdminLayout>
  );
} 