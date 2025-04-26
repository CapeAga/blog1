'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { apiClient } from '@/lib/api';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

// 动态导入富文本编辑器，确保它只在客户端运行
const Editor = dynamic(() => import('@/components/editor/rich-text-editor'), {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md"></div>
});

// 文章数据类型
interface PostData {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'PUBLISHED' | 'DRAFT' | 'PREVIEW';
  featuredImage?: string;
  categoryId?: string;
  tagIds?: string[];
}

// 分类和标签类型
interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface PostFormProps {
  post?: any; // 编辑模式下的文章数据
  isEditing?: boolean;
  initialData?: PostData;
  categories: Category[];
  tags: Tag[];
}

export default function PostForm({ post, isEditing = false, initialData, categories: propCategories, tags: propTags }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [categories, setCategories] = useState<Category[]>(propCategories || []);
  const [tags, setTags] = useState<Tag[]>(propTags || []);
  
  // 表单数据
  const [formData, setFormData] = useState<PostData>({
    title: post?.title || '',
    slug: post?.slug || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    status: post?.status || 'DRAFT',
    featuredImage: post?.featuredImage || '',
    categoryId: post?.categoryId || '',
    tagIds: post?.tagIds || [],
  });

  // 初始化表单数据
  useEffect(() => {
    if (isEditing && post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        status: post.status,
        featuredImage: post.featuredImage,
        categoryId: post.categoryId,
        tagIds: post.tagIds || [],
      });
      
      if (post.featuredImage) {
        setPreviewUrl(post.featuredImage);
      }
    }
  }, [isEditing, post]);

  // 获取分类和标签数据
  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        setLoading(true);
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/tags')
        ]);
        
        if (categoriesRes.ok && tagsRes.ok) {
          const categoriesData = await categoriesRes.json();
          const tagsData = await tagsRes.json();
          
          setCategories(categoriesData);
          setTags(tagsData);
        }
      } catch (error) {
        console.error('Failed to fetch categories and tags:', error);
        setMessage({ type: 'error', text: '获取分类和标签失败' });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoriesAndTags();
  }, []);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理富文本编辑器内容变化
  const handleEditorChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  // 处理多选标签变化
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      tagIds: checked
        ? [...(prev.tagIds || []), value]
        : (prev.tagIds || []).filter(id => id !== value)
    }));
  };

  // 从标题生成slug
  const generateSlug = useCallback(() => {
    if (!formData.title) return;
    
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-') // 将非字母数字字符和中文替换为连字符
      .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符
      .substring(0, 60); // 限制长度
    
    setFormData(prev => ({ ...prev, slug }));
  }, [formData.title]);

  // 处理特色图片上传
  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setUploading(true);
      
      // 文件类型检查
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setMessage({ type: 'error', text: '只支持 JPG、PNG、GIF 和 WebP 图片格式' });
        return;
      }
      
      // 获取预签名上传URL
      const fileInfo = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        purpose: 'featured-image',
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
      const confirmResponse = await apiClient.media.confirmUpload({
        key: uploadUrlData.fields.key,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });
      
      const mediaData = confirmResponse as unknown as { url: string };
      
      // 更新表单数据和预览
      setFormData(prev => ({ ...prev, featuredImage: mediaData.url }));
      setPreviewUrl(mediaData.url);
      
    } catch (error) {
      console.error('上传特色图片失败:', error);
      setMessage({ type: 'error', text: '上传特色图片失败' });
    } finally {
      setUploading(false);
    }
  };

  // 保存草稿
  const saveDraft = async () => {
    await savePost('DRAFT');
  };

  // 发布文章
  const publishPost = async () => {
    await savePost('PUBLISHED');
  };

  // 保存文章
  const savePost = async (status: 'DRAFT' | 'PUBLISHED') => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      // 验证必填字段
      if (!formData.title) {
        setMessage({ type: 'error', text: '标题不能为空' });
        return;
      }
      
      if (!formData.content) {
        setMessage({ type: 'error', text: '内容不能为空' });
        return;
      }
      
      // 准备提交的数据
      const postData = {
        ...formData,
        status,
      };
      
      // 发送请求
      if (isEditing) {
        await apiClient.admin.updatePost(formData.id!, postData);
        setMessage({ type: 'success', text: status === 'PUBLISHED' ? '文章已更新并发布' : '文章草稿已保存' });
      } else {
        const response = await apiClient.admin.createPost(postData);
        const newPost = response as unknown as { id: string };
        
        setMessage({ type: 'success', text: status === 'PUBLISHED' ? '文章已发布' : '文章草稿已保存' });
        
        // 新建文章成功后跳转到编辑页
        if (newPost.id) {
          setTimeout(() => {
            router.push(`/admin/posts/edit/${newPost.id}`);
          }, 1500);
        }
      }
    } catch (error) {
      console.error('保存文章失败:', error);
      setMessage({ type: 'error', text: '保存文章失败' });
    } finally {
      setSaving(false);
    }
  };

  // 预览文章
  const previewPost = () => {
    // 检查必填字段
    if (!formData.title) {
      toast.error('请输入文章标题');
      return;
    }
    
    if (!formData.content) {
      toast.error('请输入文章内容');
      return;
    }
    
    // 构建预览数据
    const previewData = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      slug: formData.slug,
      categoryId: formData.categoryId,
      tagIds: formData.tagIds,
      featuredImage: formData.featuredImage,
      status: 'PREVIEW'
    };
    
    // 将数据编码为URL参数
    const encodedData = encodeURIComponent(JSON.stringify(previewData));
    
    // 跳转到预览页面
    router.push(`/admin/posts/preview?data=${encodedData}`);
  };

  return (
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
      
      <Card>
        <CardContent className="p-6">
          <form className="space-y-6">
            {/* 标题 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
            
            {/* Slug */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL别名 (Slug)
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="sm:self-end">
                <button 
                  type="button" 
                  onClick={generateSlug}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  从标题生成
                </button>
              </div>
            </div>
            
            {/* 内容 */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                内容 <span className="text-red-500">*</span>
              </label>
              <div className="min-h-[400px] border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
                <Editor 
                  initialValue={formData.content} 
                  onChange={handleEditorChange} 
                />
              </div>
            </div>
            
            {/* 摘要 */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                摘要
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                placeholder="简短的文章摘要，会显示在文章列表中"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 分类 */}
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  分类
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">-- 选择分类 --</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* 特色图片 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  特色图片
                </label>
                <div className="flex items-center gap-4">
                  {previewUrl && (
                    <div className="relative w-20 h-20 border rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={previewUrl} 
                        alt="特色图片" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <label htmlFor="featuredImage" className={cn(
                      "inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none",
                      uploading && "opacity-50 cursor-not-allowed"
                    )}>
                      {uploading ? '上传中...' : previewUrl ? '更换图片' : '选择图片'}
                      <input
                        id="featuredImage"
                        name="featuredImage"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        disabled={uploading}
                        onChange={handleFeaturedImageUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 标签 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                标签
              </label>
              <div className="border border-gray-300 dark:border-gray-700 rounded-md p-3 max-h-40 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {tags.map(tag => (
                    <div key={tag.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`tag-${tag.id}`}
                        value={tag.id}
                        checked={(formData.tagIds || []).includes(tag.id)}
                        onChange={handleTagChange}
                        className="rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`tag-${tag.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {tag.name}
                      </label>
                    </div>
                  ))}
                  {tags.length === 0 && (
                    <div className="text-gray-500 dark:text-gray-400 col-span-full text-sm">
                      暂无标签，请先在标签管理页面创建
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        
        {/* 表单底部按钮 */}
        <div className="flex justify-between mt-6">
          <div className="space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/admin/posts')}
              disabled={saving}
            >
              返回
            </Button>
            
            <Button 
              type="button" 
              variant="secondary" 
              onClick={previewPost}
              disabled={saving}
            >
              预览
            </Button>
          </div>
          
          <div className="space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => savePost('DRAFT')}
              disabled={saving}
            >
              保存草稿
            </Button>
            
            <Button 
              type="button" 
              onClick={() => savePost('PUBLISHED')}
              disabled={saving}
            >
              发布
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 