'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import AdminLayout from '@/components/admin/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// 标签数据类型
interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
  createdAt: string;
  updatedAt: string;
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    slug: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 获取标签数据
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await apiClient.blog.getTags();
      const data = response as unknown as { items: Tag[] };
      setTags(data.items || []);
    } catch (error) {
      console.error('获取标签失败:', error);
      setMessage({ type: 'error', text: '获取标签失败' });
    } finally {
      setLoading(false);
    }
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setMessage({ type: 'error', text: '标签名称不能为空' });
        return;
      }
      
      if (!formData.slug) {
        setMessage({ type: 'error', text: 'URL别名不能为空' });
        return;
      }
      
      if (isEditing) {
        // 更新标签
        await apiClient.admin.updateTag(formData.id, formData);
        setMessage({ type: 'success', text: '标签已更新' });
      } else {
        // 创建标签
        await apiClient.admin.createTag(formData);
        setMessage({ type: 'success', text: '标签已创建' });
      }
      
      // 重置表单并刷新列表
      resetForm();
      fetchTags();
    } catch (error) {
      console.error('保存标签失败:', error);
      setMessage({ type: 'error', text: '保存标签失败' });
    } finally {
      setSubmitting(false);
    }
  };

  // 编辑标签
  const handleEdit = (tag: Tag) => {
    setFormData({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    });
    setIsEditing(true);
  };

  // 删除标签
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此标签吗？如果有文章关联到此标签，它们将失去这个标签关联。')) {
      return;
    }
    
    try {
      setLoading(true);
      await apiClient.admin.deleteTag(id);
      
      // 更新列表
      fetchTags();
      setMessage({ type: 'success', text: '标签已删除' });
    } catch (error) {
      console.error('删除标签失败:', error);
      setMessage({ type: 'error', text: '删除标签失败' });
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
      title="标签管理" 
      description="管理博客文章的标签"
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
                <CardTitle>{isEditing ? '编辑标签' : '添加标签'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      标签名称 <span className="text-red-500">*</span>
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
                  
                  <div className="flex justify-between pt-4">
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
                      {submitting ? '保存中...' : (isEditing ? '更新标签' : '添加标签')}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* 列表 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>标签列表</CardTitle>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  总计: {tags.length} 个标签
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : tags.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    暂无标签，请添加第一个标签
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
                        {tags.map((tag) => (
                          <tr key={tag.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{tag.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{tag.slug}</td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{tag.postCount || 0}</td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatDate(tag.createdAt)}</td>
                            <td className="px-4 py-3 text-sm text-right">
                              <button
                                onClick={() => handleEdit(tag)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => handleDelete(tag.id)}
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
            
            {/* 标签云 */}
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>标签云预览</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span 
                        key={tag.id} 
                        className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                      >
                        {tag.name}
                        {tag.postCount ? <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({tag.postCount})</span> : null}
                      </span>
                    ))}
                    {tags.length === 0 && (
                      <span className="text-gray-500 dark:text-gray-400">没有标签可以显示</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 