'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import AIToolsGrid from '@/components/ai-tools/ai-tools-grid';

interface AITool {
  id: string;
  name: string;
  description: string;
  embedUrl: string;
  iconUrl?: string;
  isActive: boolean;
}

export default function AIToolsPage() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTools() {
      try {
        setLoading(true);
        const response = await apiClient.aiTools.getTools();
        const data = response as unknown as { items: AITool[] };
        
        // 只显示已激活的工具
        setTools(data.items.filter(tool => tool.isActive) || []);
      } catch (err) {
        console.error('获取AI工具列表失败:', err);
        setError('获取AI工具列表失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    }

    fetchTools();
  }, []);

  return (
    <div className="px-4 py-6 sm:px-6 md:container md:mx-auto md:py-8 lg:py-12">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
          AI工具中心
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          探索我们精选的AI工具，提升您的效率和创造力
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 sm:py-16">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 sm:py-16">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      ) : (
        <AIToolsGrid tools={tools} />
      )}
    </div>
  );
} 