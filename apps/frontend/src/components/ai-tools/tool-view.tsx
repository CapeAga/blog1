import { useState, useEffect } from 'react';
import { useAITool } from '@/hooks/use-api';
import Link from 'next/link';

interface ToolViewProps {
  toolId: string;
}

export default function ToolView({ toolId }: ToolViewProps) {
  const { aiTool, isLoading, isError } = useAITool(toolId);
  const [iframeHeight, setIframeHeight] = useState('600px');
  
  // 根据屏幕尺寸调整iframe高度
  useEffect(() => {
    const updateIframeHeight = () => {
      const height = window.innerHeight * 0.75;
      setIframeHeight(`${height}px`);
    };
    
    // 初始设置
    updateIframeHeight();
    
    // 监听窗口大小变化
    window.addEventListener('resize', updateIframeHeight);
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', updateIframeHeight);
    };
  }, []);
  
  // 加载状态
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }
  
  // 错误状态
  if (isError || !aiTool) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg">
        <h3 className="text-lg font-medium mb-2">加载失败</h3>
        <p className="mb-4">无法加载AI工具，请稍后再试。</p>
        <Link href="/ai-tools" className="btn btn-secondary">
          返回工具列表
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{aiTool.name}</h1>
        {aiTool.description && (
          <p className="text-gray-600 dark:text-gray-300">{aiTool.description}</p>
        )}
      </div>
      
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <iframe
          src={aiTool.embedUrl}
          title={aiTool.name}
          width="100%"
          height={iframeHeight}
          className="bg-white"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      
      <div className="mt-6">
        <Link href="/ai-tools" className="btn btn-secondary">
          返回工具列表
        </Link>
      </div>
    </div>
  );
} 