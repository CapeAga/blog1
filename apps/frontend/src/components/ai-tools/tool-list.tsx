import Link from 'next/link';
import Image from 'next/image';
import { useAITools } from '@/hooks/use-api';

interface AITool {
  id: string;
  name: string;
  description?: string;
  embedUrl: string;
  iconUrl?: string;
}

export default function ToolList() {
  const { aiTools, isLoading, isError } = useAITools();

  // 加载状态
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-5/6"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mt-6 w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  // 错误状态
  if (isError) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg">
        <h3 className="text-lg font-medium mb-2">加载失败</h3>
        <p>无法加载AI工具列表，请稍后再试。</p>
      </div>
    );
  }

  // 没有工具
  if (aiTools.length === 0) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-800 text-center rounded-lg">
        <h3 className="text-lg font-medium mb-2">暂无AI工具</h3>
        <p className="text-gray-600 dark:text-gray-400">
          目前还没有添加任何AI工具或嵌入网页，请稍后再来查看。
        </p>
      </div>
    );
  }

  // 显示工具列表
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {aiTools.map((tool: AITool) => (
        <div key={tool.id} className="card hover:shadow-lg transition-shadow">
          {tool.iconUrl ? (
            <div className="relative h-40 mb-4">
              <Image
                src={tool.iconUrl}
                alt={tool.name}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          )}
          
          <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
          
          {tool.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {tool.description}
            </p>
          )}
          
          <Link 
            href={`/ai-tools/${tool.id}`}
            className="btn btn-primary inline-block mt-4"
          >
            立即使用
          </Link>
        </div>
      ))}
    </div>
  );
} 