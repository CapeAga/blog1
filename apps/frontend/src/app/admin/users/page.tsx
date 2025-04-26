'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import AdminLayout from '@/components/admin/layout/admin-layout';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// 用户数据类型
interface User {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // 获取用户列表
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.admin.getUsers();
      setUsers(response as unknown as User[]);
    } catch (error) {
      console.error('获取用户列表失败:', error);
      setMessage({ type: 'error', text: '获取用户列表失败' });
    } finally {
      setLoading(false);
    }
  };

  // 编辑用户
  const handleEdit = (id: string) => {
    router.push(`/admin/users/edit/${id}`);
  };

  // 删除用户
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此用户吗？此操作不可恢复。')) {
      return;
    }
    
    try {
      setLoading(true);
      await apiClient.admin.deleteUser(id);
      
      // 更新列表
      fetchUsers();
      setMessage({ type: 'success', text: '用户已删除' });
    } catch (error) {
      console.error('删除用户失败:', error);
      setMessage({ type: 'error', text: '删除用户失败' });
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
      title="用户管理" 
      description="管理网站的所有注册用户"
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
        
        {/* 顶部信息 */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">用户列表</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              查看和管理所有注册用户
            </p>
          </div>
          <button
            onClick={() => router.push('/admin/users/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            新建用户
          </button>
        </div>
        
        {/* 用户列表 */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                暂无用户数据
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">用户</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">角色</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">注册日期</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-700 dark:text-blue-300 font-medium">
                                {user.name ? user.name.substring(0, 1).toUpperCase() : user.email.substring(0, 1).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              {user.name && (
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {user.name}
                                </div>
                              )}
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={cn(
                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                            user.role === 'ADMIN'
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          )}>
                            {user.role === 'ADMIN' ? '管理员' : '普通用户'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => handleEdit(user.id)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                            disabled={user.role === 'ADMIN'}
                            title={user.role === 'ADMIN' ? '不能删除管理员账号' : ''}
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