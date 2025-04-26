'use client';

import { useParams } from 'next/navigation';
import ToolView from '@/components/ai-tools/tool-view';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AIToolPage() {
  const params = useParams();
  const router = useRouter();
  const toolId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  // 如果没有 toolId，重定向到工具列表页面
  useEffect(() => {
    if (!toolId) {
      router.push('/ai-tools');
    }
  }, [toolId, router]);
  
  // 如果没有 toolId，不渲染内容
  if (!toolId) {
    return null;
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <ToolView toolId={toolId} />
    </div>
  );
} 