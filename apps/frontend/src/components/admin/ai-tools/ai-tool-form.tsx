import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// AI工具数据类型
interface AIToolData {
  id?: string;
  name: string;
  description: string;
  embedUrl: string;
  iconUrl?: string;
  isActive: boolean;
}

interface AIToolFormProps {
  tool?: any; // 编辑模式下的工具数据
  isEditing?: boolean;
}

export default function AIToolForm({ tool, isEditing = false }: AIToolFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploading, setUploading] = useState(false);
  const [iconPreview, setIconPreview] = useState('');
  
  // 表单数据
  const [formData, setFormData] = useState<AIToolData>({
    name: '',
    description: '',
    embedUrl: '',
    iconUrl: '',
    isActive: true,
  });

  // 初始化表单数据
  useEffect(() => {
    if (isEditing && tool) {
      setFormData({
        id: tool.id,
        name: tool.name || '',
        description: tool.description || '',
        embedUrl: tool.embedUrl || '',
        iconUrl: tool.iconUrl || '',
        isActive: tool.isActive !== undefined ? tool.isActive : true,
      });
      
      if (tool.iconUrl) {
        setIconPreview(tool.iconUrl);
      }
    }
  }, [isEditing, tool]);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理复选框变化
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // 处理图标上传
  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setUploading(true);
      
      // 文件类型检查
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        setMessage({ type: 'error', text: '只支持 JPG、PNG、GIF、WebP 和 SVG 图片格式' });
        return;
      }
      
      // 获取预签名上传URL
      const fileInfo = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        purpose: 'ai-tool-icon',
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
      setFormData(prev => ({ ...prev, iconUrl: mediaData.url }));
      setIconPreview(mediaData.url);
      
    } catch (error) {
      console.error('上传图标失败:', error);
      setMessage({ type: 'error', text: '上传图标失败' });
    } finally {
      setUploading(false);
    }
  };

  // 保存AI工具
  const saveTool = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      // 验证必填字段
      if (!formData.name) {
        setMessage({ type: 'error', text: '名称不能为空' });
        return;
      }
      
      if (!formData.description) {
        setMessage({ type: 'error', text: '描述不能为空' });
        return;
      }
      
      if (!formData.embedUrl) {
        setMessage({ type: 'error', text: '嵌入URL不能为空' });
        return;
      }
      
      // 发送请求
      if (isEditing) {
        await apiClient.admin.updateAITool(formData.id!, formData);
        setMessage({ type: 'success', text: 'AI工具已更新' });
      } else {
        const response = await apiClient.admin.createAITool(formData);
        const newTool = response as unknown as { id: string };
        
        setMessage({ type: 'success', text: 'AI工具已创建' });
        
        // 新建工具成功后跳转到列表页
        setTimeout(() => {
          router.push('/admin/ai-tools');
        }, 1500);
      }
    } catch (error) {
      console.error('保存AI工具失败:', error);
      setMessage({ type: 'error', text: '保存AI工具失败' });
    } finally {
      setSaving(false);
    }
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
            {/* 名称 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                名称 <span className="text-red-500">*</span>
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
            
            {/* 描述 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                required
              ></textarea>
            </div>
            
            {/* 嵌入URL */}
            <div>
              <label htmlFor="embedUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                嵌入URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="embedUrl"
                name="embedUrl"
                value={formData.embedUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                placeholder="https://example.com/embed"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                输入要嵌入的网页URL，该URL将在iframe中加载
              </p>
            </div>
            
            {/* 图标 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                图标
              </label>
              <div className="flex items-center gap-4">
                {iconPreview && (
                  <div className="relative w-20 h-20 border rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={iconPreview} 
                      alt="AI工具图标" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <label htmlFor="iconUpload" className={cn(
                    "inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none",
                    uploading && "opacity-50 cursor-not-allowed"
                  )}>
                    {uploading ? '上传中...' : iconPreview ? '更换图标' : '选择图标'}
                    <input
                      id="iconUpload"
                      name="iconUpload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      disabled={uploading}
                      onChange={handleIconUpload}
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    建议尺寸: 512x512 像素，支持 PNG, JPG, SVG 格式
                  </p>
                </div>
              </div>
            </div>
            
            {/* 是否启用 */}
            <div className="flex items-center">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                启用此AI工具
              </label>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button
            type="button"
            onClick={() => router.push('/admin/ai-tools')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            取消
          </button>
          
          <button
            type="button"
            onClick={saveTool}
            disabled={saving}
            className={cn(
              "px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
              saving && "opacity-50 cursor-not-allowed"
            )}
          >
            {saving ? '保存中...' : isEditing ? '更新' : '创建'}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
} 