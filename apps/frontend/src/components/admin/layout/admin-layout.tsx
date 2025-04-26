'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUserProfile } from '@/hooks/use-api';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile, isLoading } = useUserProfile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // 检查用户是否是管理员，如果不是则重定向
  useEffect(() => {
    if (!isLoading && userProfile && userProfile.role !== 'ADMIN') {
      router.push('/');
    }
    if (!isLoading && !userProfile) {
      router.push('/login');
    }
  }, [userProfile, isLoading, router]);
  
  // 如果正在加载用户数据，显示加载状态
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">加载中...</p>
        </div>
      </div>
    );
  }
  
  // 如果用户不是管理员或未登录，不显示内容
  if ((!userProfile || userProfile.role !== 'ADMIN') && !isLoading) {
    return null;
  }
  
  // 导航项目
  const navItems = [
    { name: '仪表盘', path: '/admin/dashboard', icon: 'chart-pie' },
    { name: '文章管理', path: '/admin/posts', icon: 'document-text' },
    { name: '分类管理', path: '/admin/categories', icon: 'tag' },
    { name: '标签管理', path: '/admin/tags', icon: 'tag' },
    { name: 'AI工具管理', path: '/admin/ai-tools', icon: 'chip' },
    { name: '媒体库', path: '/admin/media', icon: 'photograph' },
    { name: '用户管理', path: '/admin/users', icon: 'users' },
    { name: '站点设置', path: '/admin/settings', icon: 'cog' },
  ];
  
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* 侧边栏 */}
      <aside className={`fixed inset-y-0 z-50 flex flex-col flex-shrink-0 w-64 max-h-screen overflow-hidden transition-all transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 lg:static lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between flex-shrink-0 p-4">
          <Link href="/admin/dashboard" className="text-lg font-semibold">
            管理后台
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 transition-colors duration-200 rounded-md lg:hidden text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 导航链接 */}
        <nav className="flex-1 overflow-auto">
          <ul className="p-2 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.path);
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-3">
                      <IconComponent name={item.icon} />
                    </span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* 底部用户区域 */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-blue-700 dark:text-blue-300 font-medium">
                {userProfile?.name ? userProfile.name.substring(0, 1).toUpperCase() : 'A'}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {userProfile?.name || '管理员'}
              </p>
              <Link
                href="/"
                className="text-xs text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
              >
                返回网站
              </Link>
            </div>
          </div>
        </div>
      </aside>
      
      {/* 遮罩层 - 移动端显示 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      {/* 主内容区域 */}
      <div className="flex flex-col flex-1 overflow-x-hidden">
        {/* 顶部导航 */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-gray-600 rounded-md hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="ml-4 lg:ml-0 text-xl font-semibold text-gray-800 dark:text-gray-200">
                {title}
              </h1>
            </div>
          </div>
        </header>
        
        {/* 页面内容 */}
        <main className="flex-1 p-4 sm:p-6">
          {description && (
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {description}
            </p>
          )}
          {children}
        </main>
        
        {/* 页脚 */}
        <footer className="py-4 px-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} 个人博客网站管理后台
          </p>
        </footer>
      </div>
    </div>
  );
}

// 简单的图标组件
function IconComponent({ name }: { name: string }) {
  // 这里简化处理，实际项目中可以使用更完整的图标库如heroicons
  const iconPaths: Record<string, string> = {
    'chart-pie': 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M2.5 19.5L21 3',
    'document-text': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    'tag': 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
    'chip': 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
    'photograph': 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    'users': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    'cog': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  };
  
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPaths[name] || 'M12 6v6m0 0v6m0-6h6m-6 0H6'} />
    </svg>
  );
} 