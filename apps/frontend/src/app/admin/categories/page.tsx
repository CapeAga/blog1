'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import AdminLayout from '@/components/admin/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// 分类数据类型
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    slug: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 获取分类数据
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiClient.blog.getCategories();
      const data = response as unknown as { items: Category[] };
      setCategories(data.items || []);
    } catch (error) {
      console.error('获取分类失败:', error);
      setMessage({ type: 'error', text: '获取分类失败' });
    } finally {
      setLoading(false);
    }
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 从名称生成slug
  const generateSlug = () => {
    if (!formData.name) return;
    
    const slug = formData.name
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-') // 将非字母数字字符和中文替换为连字符
      .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符
      .substring(0, 60); // 限制长度
    
    setFormData(prev => ({ ...prev, slug }));
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setMessage({ type: '', text: '' });
      
      // 验证必填字段
      if (!formData.name) {
        setMessage({ type: 'error', text: '分类名称不能为空' });
        return;
      }
      
      if (!formData.slug) {
        setMessage({ type: 'error', text: 'URL别名不能为空' });
        return;
      }
      
      if (isEditing) {
        // 更新分类
        await apiClient.admin.updateCategory(formData.id, formData);
        setMessage({ type: 'success', text: '分类已更新' });
      } else {
        // 创建分类
        await apiClient.admin.createCategory(formData);
        setMessage({ type: 'success', text: '分类已创建' });
      }
      
      // 重置表单并刷新列表
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('保存分类失败:', error);
      setMessage({ type: 'error', text: '保存分类失败' });
    } finally {
      setSubmitting(false);
    }
  };

  // 编辑分类
  const handleEdit = (category: Category) => {
    setFormData({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
    setIsEditing(true);
  };

  // 删除分类
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此分类吗？如果有文章关联到此分类，它们将失去这个分类关联。')) {
      return;
    }
    
    try {
      setLoading(true);
      await apiClient.admin.deleteCategory(id);
      
      // 更新列表
      fetchCategories();
      setMessage({ type: 'success', text: '分类已删除' });
    } catch (error) {
      console.error('删除分类失败:', error);
      setMessage({ type: 'error', text: '删除分类失败' });
    } finally {
      setLoading(false);
    }
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      slug: '',
      description: '',
    });
    setIsEditing(false);
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
      title="分类管理" 
      description="管理博客文章的分类"
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
        
        {/* 分为两列：表单和列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 表单 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{isEditing ? '编辑分类' : '添加分类'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      分类名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        URL别名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                        required
                      />
                    </div>
                    <div className="sm:self-end">
                      <button 
                        type="button" 
                        onClick={generateSlug}
                        className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        生成
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      描述
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    {isEditing && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        取消
                      </button>
                    )}
                    
                    <button
                      type="submit"
                      disabled={submitting}
                      className={cn(
                        "px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                        submitting && "opacity-50 cursor-not-allowed",
                        isEditing ? "ml-auto" : "w-full"
                      )}
                    >
                      {submitting ? '保存中...' : (isEditing ? '更新分类' : '添加分类')}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* 列表 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>分类列表</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    暂无分类，请添加第一个分类
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">名称</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">别名</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">文章数</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">创建日期</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {categories.map((category) => (
                          <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{category.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{category.slug}</td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{category.postCount || 0}</td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatDate(category.createdAt)}</td>
                            <td className="px-4 py-3 text-sm text-right">
                              <button
                                onClick={() => handleEdit(category)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => handleDelete(category.id)}
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
        </div>
      </div>
    </AdminLayout>
  );
} 