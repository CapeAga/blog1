'use client';

import { useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/use-api';
import { apiClient } from '@/lib/api';
import Link from 'next/link';

export default function UserProfile() {
  const { userProfile, isLoading, isError, mutate } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  
  // 当用户数据加载完成后，填充表单
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
      });
    }
  }, [userProfile]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSaving(true);
    
    try {
      // 调用API更新用户信息
      await apiClient.users.updateUserProfile(formData);
      
      // 刷新用户数据
      mutate();
      
      // 显示成功消息
      setSuccessMessage('个人信息更新成功');
      
      // 退出编辑模式
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || '更新个人信息失败');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleLogout = () => {
    // 清除本地存储的令牌
    localStorage.removeItem('token');
    
    // 重定向到首页
    window.location.href = '/';
  };
  
  // 显示加载状态
  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-6"></div>
      </div>
    );
  }
  
  // 显示错误状态
  if (isError) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4">无法加载个人信息</h2>
        <p className="text-red-600 dark:text-red-400 mb-4">加载个人信息时出错，请稍后再试。</p>
        <p className="mb-4">可能的原因：</p>
        <ul className="list-disc list-inside mb-6">
          <li>您的登录会话已过期</li>
          <li>服务器暂时不可用</li>
        </ul>
        <Link href="/login" className="btn btn-primary">重新登录</Link>
      </div>
    );
  }
  
  // 未登录状态
  if (!userProfile) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4">您尚未登录</h2>
        <p className="mb-6">请登录或注册以访问个人中心</p>
        <div className="flex gap-4">
          <Link href="/login" className="btn btn-primary">登录</Link>
          <Link href="/register" className="btn btn-secondary">注册</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card">
      <h1 className="text-2xl font-bold mb-6">个人中心</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          {successMessage}
        </div>
      )}
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">个人信息</h2>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            {isEditing ? '取消' : '编辑'}
          </button>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                姓名
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                电子邮箱
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">邮箱地址不可更改</p>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="btn btn-primary mr-2"
              >
                {isSaving ? '保存中...' : '保存修改'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
              >
                取消
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">姓名</h3>
              <p className="mt-1">{userProfile.name || '未设置'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">电子邮箱</h3>
              <p className="mt-1">{userProfile.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">注册时间</h3>
              <p className="mt-1">
                {new Date(userProfile.createdAt).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">安全设置</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">修改密码</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">定期更改密码可以提高账号安全性</p>
            </div>
            <Link href="/change-password" className="btn btn-secondary">
              修改密码
            </Link>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <button
          onClick={handleLogout}
          className="btn btn-secondary text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800"
        >
          退出登录
        </button>
      </div>
    </div>
  );
} 