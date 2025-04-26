import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

interface AITool {
  id: string;
  name: string;
  description: string;
  embedUrl: string;
  iconUrl?: string;
  isActive: boolean;
}

interface AIToolsGridProps {
  tools: AITool[];
}

export default function AIToolsGrid({ tools }: AIToolsGridProps) {
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);

  // 处理工具卡片点击
  const handleToolClick = (tool: AITool) => {
    setSelectedTool(tool);
  };

  // 关闭iframe
  const handleCloseIframe = () => {
    setSelectedTool(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 工具网格 */}
      {tools.length === 0 ? (
        <div className="text-center py-10 sm:py-16">
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">目前没有可用的AI工具</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {tools.map((tool) => (
            <Card 
              key={tool.id}
              className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
              onClick={() => handleToolClick(tool)}
            >
              <CardContent className="p-0">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    {tool.iconUrl ? (
                      <img 
                        src={tool.iconUrl} 
                        alt={tool.name} 
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-md">
                        <span className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">AI</span>
                      </div>
                    )}
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {tool.name}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {tool.description}
                  </p>
                </div>
                <div className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                  <button className="w-full py-1.5 sm:py-2 flex justify-center items-center text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                    立即使用
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 嵌入式iframe对话框 */}
      {selectedTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                {selectedTool.name}
              </h3>
              <button 
                onClick={handleCloseIframe}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 p-0 sm:p-1 overflow-hidden">
              <iframe 
                src={selectedTool.embedUrl} 
                className="w-full h-full border-0"
                title={selectedTool.name}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                loading="lazy"
                allow="camera; microphone; fullscreen; clipboard-read; clipboard-write; geolocation"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 