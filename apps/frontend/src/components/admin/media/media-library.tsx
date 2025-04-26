import { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// 媒体文件类型
interface MediaItem {
  id: string;
  fileName: string;
  url: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

// 分页和筛选状态
interface MediaQuery {
  page: number;
  limit: number;
  type?: string;
  search?: string;
}

export default function MediaLibrary() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [query, setQuery] = useState<MediaQuery>({
    page: 1,
    limit: 24,
  });
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 获取媒体文件列表
  useEffect(() => {
    fetchMediaItems();
  }, [query]);

  const fetchMediaItems = async () => {
    try {
      setLoading(true);
      // 构建查询参数
      const params = { ...query };
      
      const response = await apiClient.media.getMediaList(params);
      const data = response as unknown as { 
        items: MediaItem[]; 
        total: number; 
        pages: number; 
      };
      
      setMediaItems(data.items || []);
      setTotalItems(data.total || 0);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error('获取媒体列表失败:', error);
      setMessage({ type: 'error', text: '获取媒体列表失败' });
    } finally {
      setLoading(false);
    }
  };

  // 选中/取消选中媒体项
  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedItems.length === mediaItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(mediaItems.map(item => item.id));
    }
  };

  // 处理文件上传点击
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // 处理文件选择
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      setUploading(true);
      setMessage({ type: '', text: '' });
      
      // 处理多个文件上传
      const uploadPromises = Array.from(files).map(async file => {
        // 文件类型检查
        const validTypes = [
          'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml',
          'video/mp4', 'video/quicktime', 'video/x-msvideo',
          'application/pdf'
        ];
        
        if (!validTypes.includes(file.type)) {
          throw new Error(`不支持的文件类型: ${file.type}`);
        }
        
        // 获取预签名上传URL
        const fileInfo = {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        };
        
        const response = await apiClient.media.getUploadUrl(fileInfo);
        const uploadUrlData = response as unknown as {
          url: string;
          fields: Record<string, string>;
        };
        
        // 上传文件
        const formData = new FormData();
        Object.entries(uploadUrlData.fields || {}).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append('file', file);
        
        await fetch(uploadUrlData.url, {
          method: 'POST',
          body: formData,
        });
        
        // 确认上传
        return await apiClient.media.confirmUpload({
          key: uploadUrlData.fields.key,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        });
      });
      
      // 等待所有上传完成
      await Promise.all(uploadPromises);
      
      // 重新获取媒体列表
      fetchMediaItems();
      setMessage({ type: 'success', text: '文件上传成功' });
      
      // 清空文件选择
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('文件上传失败:', error);
      setMessage({ type: 'error', text: error instanceof Error ? error.message : '文件上传失败' });
    } finally {
      setUploading(false);
    }
  };

  // 删除选中项
  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    
    if (!confirm(`确定要删除选中的 ${selectedItems.length} 个文件吗？此操作不可恢复。`)) {
      return;
    }
    
    try {
      setLoading(true);
      
      // 逐个删除
      const deletePromises = selectedItems.map(id => 
        apiClient.media.deleteMedia(id)
      );
      
      await Promise.all(deletePromises);
      
      // 更新列表
      fetchMediaItems();
      setSelectedItems([]);
      setMessage({ type: 'success', text: '文件删除成功' });
    } catch (error) {
      console.error('删除文件失败:', error);
      setMessage({ type: 'error', text: '删除文件失败' });
    } finally {
      setLoading(false);
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

  // 处理类型筛选
  const handleTypeFilter = (type: string | undefined) => {
    setQuery(prev => ({
      ...prev,
      page: 1, // 重置到第一页
      type,
    }));
  };

  // 分页处理
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setQuery(prev => ({ ...prev, page: newPage }));
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <button 
            onClick={handleUploadClick}
            disabled={uploading}
            className={cn(
              "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              uploading && "opacity-50 cursor-not-allowed"
            )}
          >
            {uploading ? '上传中...' : '上传文件'}
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            onChange={handleFileChange}
            multiple
            accept="image/*,video/*,application/pdf"
          />
          
          {selectedItems.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              删除选中 ({selectedItems.length})
            </button>
          )}
        </div>
        
        <div className="flex gap-2">
          {/* 视图切换 */}
          <div className="flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-700">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "px-3 py-2 focus:outline-none",
                viewMode === 'grid' 
                  ? "bg-blue-600 text-white" 
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              )}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "px-3 py-2 focus:outline-none",
                viewMode === 'list' 
                  ? "bg-blue-600 text-white" 
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              )}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* 类型筛选 */}
          <select
            value={query.type || ''}
            onChange={(e) => handleTypeFilter(e.target.value || undefined)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部类型</option>
            <option value="image">图片</option>
            <option value="video">视频</option>
            <option value="pdf">PDF</option>
          </select>
          
          {/* 搜索框 */}
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              name="search"
              placeholder="搜索文件名..."
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
      
      {/* 媒体文件列表 */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>媒体文件</CardTitle>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              共 {totalItems} 个文件
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : mediaItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              暂无媒体文件
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mediaItems.map((item) => (
                <div 
                  key={item.id}
                  className={cn(
                    "relative border rounded-md overflow-hidden group cursor-pointer",
                    selectedItems.includes(item.id) && "ring-2 ring-blue-500"
                  )}
                  onClick={() => toggleSelectItem(item.id)}
                >
                  {/* 预览区域 */}
                  <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    {item.fileType.startsWith('image/') ? (
                      <img 
                        src={item.url} 
                        alt={item.fileName}
                        className="w-full h-full object-cover"
                      />
                    ) : item.fileType.startsWith('video/') ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                        <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                        <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* 选择指示器 */}
                    <div className={cn(
                      "absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center",
                      selectedItems.includes(item.id) 
                        ? "bg-blue-500 text-white" 
                        : "bg-white dark:bg-gray-800 text-transparent group-hover:text-gray-500 border border-gray-300 dark:border-gray-600"
                    )}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* 文件信息 */}
                  <div className="p-2 text-xs">
                    <div className="truncate font-medium text-gray-700 dark:text-gray-300">
                      {item.fileName}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {formatFileSize(item.fileSize)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left">
                      <input 
                        type="checkbox" 
                        checked={selectedItems.length === mediaItems.length && mediaItems.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 dark:border-gray-700"
                      />
                    </th>
                    <th className="px-3 py-2 text-left">文件</th>
                    <th className="px-3 py-2 text-left">类型</th>
                    <th className="px-3 py-2 text-left">大小</th>
                    <th className="px-3 py-2 text-left">上传时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {mediaItems.map((item) => (
                    <tr 
                      key={item.id}
                      className={cn(
                        "hover:bg-gray-50 dark:hover:bg-gray-800",
                        selectedItems.includes(item.id) && "bg-blue-50 dark:bg-blue-900/20"
                      )}
                    >
                      <td className="px-3 py-2">
                        <input 
                          type="checkbox" 
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                          className="rounded border-gray-300 dark:border-gray-700"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 mr-3 flex-shrink-0">
                            {item.fileType.startsWith('image/') ? (
                              <img 
                                src={item.url} 
                                alt={item.fileName}
                                className="w-full h-full object-cover"
                              />
                            ) : item.fileType.startsWith('video/') ? (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="truncate max-w-xs">
                            {item.fileName}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        {item.fileType.split('/')[0]}
                      </td>
                      <td className="px-3 py-2">
                        {formatFileSize(item.fileSize)}
                      </td>
                      <td className="px-3 py-2">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        
        {/* 分页 */}
        {totalPages > 1 && (
          <CardFooter className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              第 {query.page} 页，共 {totalPages} 页
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
          </CardFooter>
        )}
      </Card>
    </div>
  );
} 