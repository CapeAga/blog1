import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import Link from 'next/link';

export default function ChangePasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // 表单验证
    if (formData.newPassword !== formData.confirmPassword) {
      setError('新密码和确认密码不匹配');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('新密码长度不能少于6个字符');
      return;
    }

    setIsLoading(true);

    try {
      // 调用API修改密码
      await apiClient.auth.updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      // 显示成功消息
      setSuccessMessage('密码修改成功');
      
      // 清空表单
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // 3秒后跳转回个人中心
      setTimeout(() => {
        router.push('/profile');
      }, 3000);
    } catch (err: any) {
      setError(err.message || '密码修改失败，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card max-w-md w-full mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">修改密码</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          {successMessage}
          <p className="text-sm mt-1">即将返回个人中心...</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            当前密码
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            required
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="输入当前密码"
          />
        </div>
        
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            新密码
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="至少6个字符"
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            确认新密码
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="再次输入新密码"
          />
        </div>
        
        <div className="pt-2 flex justify-between">
          <Link
            href="/profile"
            className="btn btn-secondary"
          >
            返回个人中心
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? '提交中...' : '修改密码'}
          </button>
        </div>
      </form>
    </div>
  );
} 