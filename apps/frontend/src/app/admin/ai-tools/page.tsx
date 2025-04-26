'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import AdminLayout from '@/components/admin/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// AI工具数据类型
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

export default function AIToolsPage() {
  const router = useRouter();
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // 获取工具列表
  useEffect(() => {
    fetchAITools();
  }, []);

  const fetchAITools = async () => {
    try {
      setLoading(true);
      const response = await apiClient.aiTools.getTools();
      const data = response as unknown as { items: AITool[] };
      setTools(data.items || []);
    } catch (error) {
      console.error('获取AI工具列表失败:', error);
      setMessage({ type: 'error', text: '获取AI工具列表失败' });
    } finally {
      setLoading(false);
    }
  };

  // 创建新工具
  const handleCreate = () => {
    router.push('/admin/ai-tools/new');
  };

  // 编辑工具
  const handleEdit = (id: string) => {
    router.push(`/admin/ai-tools/edit/${id}`);
  };

  // 删除工具
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此AI工具吗？此操作不可恢复。')) {
      return;
    }
    
    try {
      setLoading(true);
      await apiClient.admin.deleteAITool(id);
      
      // 更新列表
      fetchAITools();
      setMessage({ type: 'success', text: 'AI工具已删除' });
    } catch (error) {
      console.error('删除AI工具失败:', error);
      setMessage({ type: 'error', text: '删除AI工具失败' });
    } finally {
      setLoading(false);
    }
  };

  // 切换工具状态
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setLoading(true);
      await apiClient.admin.updateAITool(id, { isActive: !currentStatus });
      
      // 更新列表
      fetchAITools();
      setMessage({ type: 'success', text: `AI工具已${!currentStatus ? '启用' : '禁用'}` });
    } catch (error) {
      console.error('更新AI工具状态失败:', error);
      setMessage({ type: 'error', text: '更新AI工具状态失败' });
    } finally {
      setLoading(false);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AdminLayout 
      title="AI工具管理" 
      description="管理网站嵌入的AI工具和网页"
    >
      <div className="space-y-6">
        {/* 提示消息 */}
        {message.text && (
          <div className={cn(
            "p-4 rounded-md text-sm",
            message.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          )}>
            {message.text}
          </div>
        )}
        
        {/* 顶部操作栏 */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">AI工具列表</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              管理嵌入到网站的AI工具和网页，这些工具将在前台展示给用户
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            添加新工具
          </button>
        </div>
        
        {/* 工具列表 */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : tools.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                暂无AI工具，点击上方"添加新工具"按钮添加第一个AI工具
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">名称</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">描述</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">状态</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">创建日期</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {tools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {tool.iconUrl ? (
                              <img
                                src={tool.iconUrl}
                                alt={tool.name}
                                className="w-8 h-8 rounded-md mr-3 object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center">
                                <span className="text-gray-500 dark:text-gray-400 text-sm">AI</span>
                              </div>
                            )}
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {tool.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {tool.description}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={cn(
                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                            tool.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          )}>
                            {tool.isActive ? '已启用' : '已禁用'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(tool.createdAt)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => handleToggleStatus(tool.id, tool.isActive)}
                            className={cn(
                              "mr-3",
                              tool.isActive
                                ? "text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300"
                                : "text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                            )}
                          >
                            {tool.isActive ? '禁用' : '启用'}
                          </button>
                          <button
                            onClick={() => handleEdit(tool.id)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDelete(tool.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
} 