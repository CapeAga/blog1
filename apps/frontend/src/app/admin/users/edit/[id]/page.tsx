'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import AdminLayout from '@/components/admin/layout/admin-layout';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // 表单数据
  const [formData, setFormData] = useState({
    name: '',
    role: 'USER' as 'ADMIN' | 'USER',
  });

  // 获取用户信息
  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const response = await apiClient.admin.getUser(params.id);
        const userData = response as unknown as User;
        setUser(userData);
        
        // 设置表单初始值
        setFormData({
          name: userData.name || '',
          role: userData.role,
        });
      } catch (err) {
        console.error('获取用户详情失败:', err);
        setError('获取用户详情失败');
        
        // 错误时返回列表页
        setTimeout(() => {
          router.push('/admin/users');
        }, 2000);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchUser();
    }
  }, [params.id, router]);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 保存用户信息
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      await apiClient.admin.updateUser(params.id, formData);
      
      setMessage({ type: 'success', text: '用户信息已更新' });
      
      // 更新成功后短暂延迟
      setTimeout(() => {
        router.push('/admin/users');
      }, 1500);
    } catch (error) {
      console.error('更新用户失败:', error);
      setMessage({ type: 'error', text: '更新用户失败' });
    } finally {
      setSaving(false);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout 
      title="编辑用户" 
      description="修改用户信息"
    >
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      ) : user ? (
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
          
          {/* 用户信息卡片 */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-6 flex items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-700 dark:text-blue-300 font-medium text-lg">
                    {user.name ? user.name.substring(0, 1).toUpperCase() : user.email.substring(0, 1).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {user.email}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    注册时间：{formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 姓名 */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    姓名
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="用户姓名"
                  />
                </div>
                
                {/* 角色 */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    角色
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="USER">普通用户</option>
                    <option value="ADMIN">管理员</option>
                  </select>
                </div>
                
                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => router.push('/admin/users')}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    取消
                  </button>
                  
                  <button
                    type="submit"
                    disabled={saving}
                    className={cn(
                      "px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                      saving && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {saving ? '保存中...' : '保存更改'}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </AdminLayout>
  );
} 