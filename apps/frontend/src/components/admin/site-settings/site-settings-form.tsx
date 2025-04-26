import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api';
import { cn } from '@/lib/utils';

// 定义API响应类型
interface SiteSettings {
  title: string;
  description: string;
  logo: string;
  favicon: string;
}

interface UploadUrlResponse {
  url: string;
  fields: Record<string, string>;
}

interface MediaResponse {
  url: string;
  id: string;
}

export default function SiteSettingsForm() {
  const [settings, setSettings] = useState<SiteSettings>({
    title: '',
    description: '',
    logo: '',
    favicon: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploading, setUploading] = useState({
    logo: false,
    favicon: false,
  });
  const [logoPreview, setLogoPreview] = useState('');
  const [faviconPreview, setFaviconPreview] = useState('');

  // 加载站点设置
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.admin.getSiteSettings();
      const data = response as unknown as SiteSettings;
      setSettings({
        title: data.title || '',
        description: data.description || '',
        logo: data.logo || '',
        favicon: data.favicon || '',
      });
      
      // 设置预览图
      if (data.logo) setLogoPreview(data.logo);
      if (data.favicon) setFaviconPreview(data.favicon);
      
    } catch (error) {
      console.error('获取站点设置失败:', error);
      setMessage({ type: 'error', text: '获取站点设置失败' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 开始上传状态
      setUploading((prev) => ({ ...prev, [type]: true }));
      
      // 文件类型检查
      const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setMessage({ type: 'error', text: '只支持 JPG、PNG、SVG 和 GIF 图片格式' });
        return;
      }
      
      // 获取预签名上传URL
      const fileInfo = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        purpose: type === 'logo' ? 'site-logo' : 'site-favicon',
      };
      
      const response = await apiClient.media.getUploadUrl(fileInfo);
      const uploadUrlData = response as unknown as UploadUrlResponse;
      
      // 上传到预签名URL
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
      const mediaData = confirmResponse as unknown as MediaResponse;
      
      // 更新表单数据
      setSettings((prev) => ({ ...prev, [type]: mediaData.url }));
      
      // 设置预览
      if (type === 'logo') {
        setLogoPreview(mediaData.url);
      } else {
        setFaviconPreview(mediaData.url);
      }
      
      setMessage({ type: 'success', text: `${type === 'logo' ? 'Logo' : 'Favicon'} 上传成功` });
    } catch (error) {
      console.error(`上传${type === 'logo' ? 'Logo' : 'Favicon'}失败:`, error);
      setMessage({ type: 'error', text: `上传${type === 'logo' ? 'Logo' : 'Favicon'}失败` });
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await apiClient.admin.updateSiteSettings(settings);
      setMessage({ type: 'success', text: '站点设置已更新' });
      
      // 更新页面标题
      if (typeof document !== 'undefined') {
        document.title = settings.title;
      }
    } catch (error) {
      console.error('更新站点设置失败:', error);
      setMessage({ type: 'error', text: '更新站点设置失败' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>站点设置</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 显示反馈信息 */}
          {message.text && (
            <div className={cn(
              "p-4 rounded-md text-sm",
              message.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            )}>
              {message.text}
            </div>
          )}
          
          {/* 网站标题 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              网站标题
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={settings.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          
          {/* 网站描述 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              网站描述
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={settings.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            ></textarea>
          </div>
          
          {/* Logo上传 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              网站Logo
            </label>
            <div className="flex items-center space-x-4">
              {logoPreview && (
                <div className="relative w-24 h-24 border rounded-md overflow-hidden">
                  <img 
                    src={logoPreview} 
                    alt="Site Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                <label htmlFor="logo-upload" className={cn(
                  "inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none", 
                  uploading.logo && "opacity-50 cursor-not-allowed"
                )}>
                  {uploading.logo ? '上传中...' : '选择文件'}
                  <input
                    id="logo-upload"
                    name="logo"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    disabled={uploading.logo}
                    onChange={(e) => handleFileUpload(e, 'logo')}
                  />
                </label>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  推荐尺寸: 200x50 像素，支持 PNG, JPG, SVG 格式
                </p>
              </div>
            </div>
          </div>
          
          {/* Favicon上传 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              网站Favicon
            </label>
            <div className="flex items-center space-x-4">
              {faviconPreview && (
                <div className="relative w-12 h-12 border rounded-md overflow-hidden">
                  <img 
                    src={faviconPreview} 
                    alt="Site Favicon" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                <label htmlFor="favicon-upload" className={cn(
                  "inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none", 
                  uploading.favicon && "opacity-50 cursor-not-allowed"
                )}>
                  {uploading.favicon ? '上传中...' : '选择文件'}
                  <input
                    id="favicon-upload"
                    name="favicon"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    disabled={uploading.favicon}
                    onChange={(e) => handleFileUpload(e, 'favicon')}
                  />
                </label>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  推荐尺寸: 32x32 或 16x16 像素，支持 ICO, PNG 格式
                </p>
              </div>
            </div>
          </div>
          
          {/* 提交按钮 */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? '保存中...' : '保存设置'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 