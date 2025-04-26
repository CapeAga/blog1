'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import AdminLayout from '@/components/admin/layout/admin-layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SiteSettings {
  title: string;
  description: string;
  keywords: string;
  logo: string;
  favicon: string;
  footerText: string;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    github?: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    title: '',
    description: '',
    keywords: '',
    logo: '',
    favicon: '',
    footerText: '',
    socialLinks: {}
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [logoPreview, setLogoPreview] = useState('');
  const [faviconPreview, setFaviconPreview] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 获取站点设置
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const response = await apiClient.admin.getSiteSettings();
        const data = response as unknown as SiteSettings;
        
        setSettings(data);
        
        if (data.logo) {
          setLogoPreview(data.logo);
        }
        
        if (data.favicon) {
          setFaviconPreview(data.favicon);
        }
      } catch (error) {
        console.error('获取站点设置失败:', error);
        setMessage({ type: 'error', text: '获取站点设置失败' });
      } finally {
        setLoading(false);
      }
    }
    
    fetchSettings();
  }, []);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('social.')) {
      const socialKey = name.split('.')[1] as keyof typeof settings.socialLinks;
      setSettings(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value
        }
      }));
    } else {
      setSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  // 处理Logo上传点击
  const handleLogoUploadClick = () => {
    logoInputRef.current?.click();
  };

  // 处理Favicon上传点击
  const handleFaviconUploadClick = () => {
    faviconInputRef.current?.click();
  };

  // 处理Logo文件上传
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setUploadingLogo(true);
      setMessage({ type: '', text: '' });
      
      // 文件类型检查
      const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        setMessage({ type: 'error', text: '只支持 JPG、PNG 和 SVG 图片格式' });
        return;
      }
      
      // 获取预签名上传URL
      const fileInfo = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        purpose: 'site-logo',
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
      
      // 更新预览和设置
      setLogoPreview(mediaData.url);
      setSettings(prev => ({ ...prev, logo: mediaData.url }));
      
    } catch (error) {
      console.error('上传Logo失败:', error);
      setMessage({ type: 'error', text: '上传Logo失败' });
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) {
        logoInputRef.current.value = '';
      }
    }
  };

  // 处理Favicon文件上传
  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setUploadingFavicon(true);
      setMessage({ type: '', text: '' });
      
      // 文件类型检查
      const validTypes = ['image/png', 'image/x-icon', 'image/vnd.microsoft.icon'];
      if (!validTypes.includes(file.type)) {
        setMessage({ type: 'error', text: '只支持 PNG 和 ICO 图标格式' });
        return;
      }
      
      // 获取预签名上传URL
      const fileInfo = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        purpose: 'site-favicon',
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
      
      // 更新预览和设置
      setFaviconPreview(mediaData.url);
      setSettings(prev => ({ ...prev, favicon: mediaData.url }));
      
    } catch (error) {
      console.error('上传Favicon失败:', error);
      setMessage({ type: 'error', text: '上传Favicon失败' });
    } finally {
      setUploadingFavicon(false);
      if (faviconInputRef.current) {
        faviconInputRef.current.value = '';
      }
    }
  };

  // 保存设置
  const saveSettings = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      // 验证必填字段
      if (!settings.title) {
        setMessage({ type: 'error', text: '网站标题不能为空' });
        return;
      }
      
      // 发送请求保存设置
      await apiClient.admin.updateSiteSettings(settings);
      
      setMessage({ type: 'success', text: '站点设置已保存' });
    } catch (error) {
      console.error('保存设置失败:', error);
      setMessage({ type: 'error', text: '保存设置失败' });
    } finally {
      setSaving(false);
    }
  };

  // 处理加载中状态
  if (loading) {
    return (
      <AdminLayout 
        title="站点设置" 
        description="配置网站的基本信息和外观"
      >
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="站点设置" 
      description="配置网站的基本信息和外观"
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
        
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                网站标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={settings.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                网站描述
              </label>
              <textarea
                id="description"
                name="description"
                value={settings.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                placeholder="简短的网站介绍，用于SEO和网站首页"
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                关键词
              </label>
              <input
                type="text"
                id="keywords"
                name="keywords"
                value={settings.keywords}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                placeholder="用英文逗号分隔的关键词，用于SEO"
              />
            </div>
            
            <div>
              <label htmlFor="footerText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                页脚文本
              </label>
              <input
                type="text"
                id="footerText"
                name="footerText"
                value={settings.footerText}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                placeholder="网站底部显示的文字，如版权信息"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>网站标识</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Logo
              </label>
              <div className="flex items-center gap-4">
                {logoPreview && (
                  <div className="relative h-20 border rounded-md overflow-hidden flex-shrink-0 bg-white p-2">
                    <img 
                      src={logoPreview} 
                      alt="网站Logo" 
                      className="h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <label htmlFor="logo" className={cn(
                    "inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none",
                    uploadingLogo && "opacity-50 cursor-not-allowed"
                  )}>
                    {uploadingLogo ? '上传中...' : logoPreview ? '更换Logo' : '选择Logo'}
                    <input
                      id="logo"
                      name="logo"
                      type="file"
                      className="sr-only"
                      accept="image/png,image/jpeg,image/svg+xml"
                      disabled={uploadingLogo}
                      onChange={handleLogoUpload}
                      ref={logoInputRef}
                    />
                  </label>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    推荐尺寸: 200x50 像素，支持 PNG、JPG 和 SVG 格式
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Favicon
              </label>
              <div className="flex items-center gap-4">
                {faviconPreview && (
                  <div className="relative w-10 h-10 border rounded-md overflow-hidden flex-shrink-0 bg-white p-1">
                    <img 
                      src={faviconPreview} 
                      alt="网站图标" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <label htmlFor="favicon" className={cn(
                    "inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none",
                    uploadingFavicon && "opacity-50 cursor-not-allowed"
                  )}>
                    {uploadingFavicon ? '上传中...' : faviconPreview ? '更换图标' : '选择图标'}
                    <input
                      id="favicon"
                      name="favicon"
                      type="file"
                      className="sr-only"
                      accept="image/png,image/x-icon"
                      disabled={uploadingFavicon}
                      onChange={handleFaviconUpload}
                      ref={faviconInputRef}
                    />
                  </label>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    推荐尺寸: 32x32 或 16x16 像素，支持 PNG 和 ICO 格式
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>社交媒体链接</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="social.twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Twitter
              </label>
              <input
                type="url"
                id="social.twitter"
                name="social.twitter"
                value={settings.socialLinks.twitter || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                placeholder="https://twitter.com/yourusername"
              />
            </div>
            
            <div>
              <label htmlFor="social.facebook" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Facebook
              </label>
              <input
                type="url"
                id="social.facebook"
                name="social.facebook"
                value={settings.socialLinks.facebook || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            
            <div>
              <label htmlFor="social.instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Instagram
              </label>
              <input
                type="url"
                id="social.instagram"
                name="social.instagram"
                value={settings.socialLinks.instagram || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                placeholder="https://instagram.com/yourusername"
              />
            </div>
            
            <div>
              <label htmlFor="social.github" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GitHub
              </label>
              <input
                type="url"
                id="social.github"
                name="social.github"
                value={settings.socialLinks.github || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                placeholder="https://github.com/yourusername"
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            className={cn(
              "px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
              saving && "opacity-50 cursor-not-allowed"
            )}
          >
            {saving ? '正在保存...' : '保存设置'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
} 