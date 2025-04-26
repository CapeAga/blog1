import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// 文章项类型
interface Post {
  id: string;
  title: string;
  slug: string;
  status: 'PUBLISHED' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
  };
  category?: {
    id: string;
    name: string;
  };
}

// 分页和筛选类型
interface PostQuery {
  page: number;
  limit: number;
  status?: string;
  categoryId?: string;
  search?: string;
}

export default function PostList() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [query, setQuery] = useState<PostQuery>({
    page: 1,
    limit: 10,
    status: 'all'
  });
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  // 获取文章列表
  useEffect(() => {
    fetchPosts();
  }, [query]);

  // 获取分类列表
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // 构建查询参数
      const params: Record<string, any> = {
        page: query.page,
        limit: query.limit,
      };
      
      // 添加可选过滤条件
      if (query.status && query.status !== 'all') {
        params.status = query.status;
      }
      
      if (query.categoryId) {
        params.categoryId = query.categoryId;
      }
      
      if (query.search) {
        params.search = query.search;
      }
      
      // 注意：这里使用blog.getPosts而不是admin.getPosts
      const response = await apiClient.blog.getPosts(params);
      const data = response as unknown as {
        items: Post[];
        total: number;
        pages: number;
      };
      
      setPosts(data.items || []);
      setTotalItems(data.total || 0);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error('获取文章列表失败:', error);
      setMessage({ type: 'error', text: '获取文章列表失败' });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.blog.getCategories();
      const data = response as unknown as { items: {id: string, name: string}[] };
      setCategories(data.items || []);
    } catch (error) {
      console.error('获取分类列表失败:', error);
    }
  };

  // 编辑文章
  const handleEditPost = (id: string) => {
    router.push(`/admin/posts/edit/${id}`);
  };

  // 删除文章
  const handleDeletePost = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
      return;
    }
    
    try {
      await apiClient.admin.deletePost(id);
      // 更新列表，删除已删除的文章
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      setMessage({ type: 'success', text: '文章已成功删除' });
    } catch (error) {
      console.error('删除文章失败:', error);
      setMessage({ type: 'error', text: '删除文章失败' });
    }
  };

  // 删除选中的文章
  const handleDeleteSelected = async () => {
    if (selectedPosts.length === 0) return;
    
    if (!confirm(`确定要删除选中的 ${selectedPosts.length} 篇文章吗？此操作不可恢复。`)) {
      return;
    }
    
    try {
      setLoading(true);
      
      // 逐个删除
      const deletePromises = selectedPosts.map(id => 
        apiClient.admin.deletePost(id)
      );
      
      await Promise.all(deletePromises);
      
      // 更新列表
      setPosts(prevPosts => prevPosts.filter(post => !selectedPosts.includes(post.id)));
      setSelectedPosts([]);
      setMessage({ type: 'success', text: '文章删除成功' });
    } catch (error) {
      console.error('删除文章失败:', error);
      setMessage({ type: 'error', text: '删除文章失败' });
    } finally {
      setLoading(false);
    }
  };

  // 选中/取消选中文章
  const toggleSelectPost = (id: string) => {
    setSelectedPosts(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map(post => post.id));
    }
  };

  // 处理搜索
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchTerm = formData.get('search') as string;
    
    setQuery(prev => ({
      ...prev,
      page: 1, // 重置到第一页
      search: searchTerm || undefined,
    }));
  };

  // 处理状态筛选
  const handleStatusFilter = (status: string) => {
    setQuery(prev => ({
      ...prev,
      page: 1, // 重置到第一页
      status,
    }));
  };

  // 处理分类筛选
  const handleCategoryFilter = (categoryId: string | undefined) => {
    setQuery(prev => ({
      ...prev,
      page: 1, // 重置到第一页
      categoryId,
    }));
  };

  // 分页处理
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setQuery(prev => ({ ...prev, page: newPage }));
  };

  // 格式化日期
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* 筛选和搜索 */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          {/* 状态筛选 */}
          <select
            value={query.status || 'all'}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">所有状态</option>
            <option value="PUBLISHED">已发布</option>
            <option value="DRAFT">草稿</option>
          </select>
          
          {/* 分类筛选 */}
          <select
            value={query.categoryId || ''}
            onChange={(e) => handleCategoryFilter(e.target.value || undefined)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">所有分类</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          
          {/* 删除选中按钮 */}
          {selectedPosts.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              删除选中 ({selectedPosts.length})
            </button>
          )}
        </div>
        
        {/* 搜索框 */}
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            name="search"
            placeholder="搜索文章标题..."
            defaultValue={query.search || ''}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 border-l-0 rounded-r-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>
      
      {/* 提示消息 */}
      {message.text && (
        <div className={cn(
          "p-4 rounded-md text-sm",
          message.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        )}>
          {message.text}
        </div>
      )}
      
      {/* 文章列表 */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <input 
                    type="checkbox" 
                    checked={selectedPosts.length === posts.length && posts.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-700"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  标题
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  状态
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  分类
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  创建时间
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  更新时间
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    暂无文章
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr 
                    key={post.id}
                    className={cn(
                      "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                      selectedPosts.includes(post.id) && "bg-blue-50 dark:bg-blue-900/20"
                    )}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => toggleSelectPost(post.id)}
                        className="rounded border-gray-300 dark:border-gray-700"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {post.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                        post.status === 'PUBLISHED' 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      )}>
                        {post.status === 'PUBLISHED' ? '已发布' : '草稿'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {post.category?.name || '无分类'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(post.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditPost(post.id)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-6 py-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              第 {query.page} 页，共 {totalPages} 页，总共 {totalItems} 篇文章
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(query.page - 1)}
                disabled={query.page <= 1}
                className={cn(
                  "px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md",
                  query.page <= 1 
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed" 
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
              >
                上一页
              </button>
              <button
                onClick={() => handlePageChange(query.page + 1)}
                disabled={query.page >= totalPages}
                className={cn(
                  "px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md",
                  query.page >= totalPages 
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed" 
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
} 