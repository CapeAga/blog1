import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiConfig } from '@/config';

// API基础URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// 创建axios实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10秒超时
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 获取存储的token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // 如果有token，添加到请求头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 处理常见错误
    if (error.response) {
      const { status } = error.response;
      
      // 401未授权，清除token并重定向到登录页
      if (status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          
          // 仅在非登录页时重定向
          if (!window.location.pathname.includes('/login')) {
            // 使用history API进行导航，避免全页面刷新
            window.history.pushState({}, '', '/login');
            // 触发路由变化事件
            window.dispatchEvent(new Event('popstate'));
          }
        }
      }
      
      // 可以添加其他错误处理逻辑
    }
    
    return Promise.reject(error);
  }
);

// 通用请求方法
async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axiosInstance(config);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

// API客户端
export const apiClient = {
  // 认证相关
  auth: {
    // 用户登录
    login: (data: { email: string; password: string }) => {
      return request({
        url: '/auth/login',
        method: 'POST',
        data,
      });
    },
    // 管理员登录
    adminLogin: (data: { email: string; password: string }) => {
      return request({
        url: '/auth/admin-login',
        method: 'POST',
        data,
      });
    },
    // 用户注册
    register: (data: { email: string; password: string; name: string }) => {
      return request({
        url: '/auth/register',
        method: 'POST',
        data,
      });
    },
    // 重置密码请求
    forgotPassword: (data: { email: string }) => {
      return request({
        url: '/auth/forgot-password',
        method: 'POST',
        data,
      });
    },
    // 验证当前token
    verify: () => {
      return request({
        url: '/auth/verify',
        method: 'GET',
      });
    },
    // 登出
    logout: () => {
      localStorage.removeItem('token');
      return Promise.resolve();
    },
  },
  
  // 用户相关
  users: {
    // 获取用户个人资料
    getUserProfile: () => {
      return request({
        url: '/users/profile',
        method: 'GET',
      });
    },
    // 更新用户个人资料
    updateUserProfile: (data: { name?: string; email?: string }) => {
      return request({
        url: '/users/profile',
        method: 'PUT',
        data,
      });
    },
  },
  
  // 博客相关
  blog: {
    // 获取文章列表
    getPosts: (params?: {
      page?: number;
      limit?: number;
      category?: string;
      tag?: string;
      search?: string;
      slug?: string;
    }) => {
      return request({
        url: '/posts',
        method: 'GET',
        params,
      });
    },
    // 获取文章详情
    getPostById: (id: string) => {
      return request({
        url: `/posts/${id}`,
        method: 'GET',
      });
    },
    // 创建文章
    createPost: (data: any) => {
      return request({
        url: '/posts',
        method: 'POST',
        data,
      });
    },
    // 更新文章
    updatePost: (id: string, data: any) => {
      return request({
        url: `/posts/${id}`,
        method: 'PUT',
        data,
      });
    },
    // 删除文章
    deletePost: (id: string) => {
      return request({
        url: `/posts/${id}`,
        method: 'DELETE',
      });
    },
    // 获取分类列表
    getCategories: () => {
      return request({
        url: '/categories',
        method: 'GET',
      });
    },
    // A获取标签列表
    getTags: () => {
      return request({
        url: '/tags',
        method: 'GET',
      });
    },
  },
  
  // AI工具相关
  aiTools: {
    // 获取AI工具列表
    getAITools: (params?: { page?: number; limit?: number }) => {
      return request({
        url: '/ai-tools',
        method: 'GET',
        params,
      });
    },
    // 获取AI工具详情
    getAIToolById: (id: string) => {
      return request({
        url: `/ai-tools/${id}`,
        method: 'GET',
      });
    },
    // 创建AI工具
    createAITool: (data: any) => {
      return request({
        url: '/ai-tools',
        method: 'POST',
        data,
      });
    },
    // 更新AI工具
    updateAITool: (id: string, data: any) => {
      return request({
        url: `/ai-tools/${id}`,
        method: 'PUT',
        data,
      });
    },
    // 删除AI工具
    deleteAITool: (id: string) => {
      return request({
        url: `/ai-tools/${id}`,
        method: 'DELETE',
      });
    },
  },
  
  // 媒体文件相关
  media: {
    // 上传媒体文件
    uploadMedia: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      return request({
        url: '/media',
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      });
    },
    // 获取媒体文件列表
    getMediaList: (params?: { page?: number; limit?: number; type?: string }) => {
      return request({
        url: '/media',
        method: 'GET',
        params,
      });
    },
    // 删除媒体文件
    deleteMedia: (id: string) => {
      return request({
        url: `/media/${id}`,
        method: 'DELETE',
      });
    },
    // 获取上传URL（预签名URL）
    getUploadUrl: (fileInfo: { fileName: string; fileType: string; fileSize?: number; purpose?: string }) => {
      return request({
        url: '/media/upload-url',
        method: 'POST',
        data: fileInfo,
      });
    },
    // 确认上传完成
    confirmUpload: (fileInfo: { key: string; fileName: string; fileType: string; fileSize?: number }) => {
      return request({
        url: '/media/confirm-upload',
        method: 'POST',
        data: fileInfo,
      });
    },
  },

  // 管理员相关
  admin: {
    // 获取管理员仪表盘数据
    getDashboardStats: () => {
      return request({
        url: '/admin/dashboard',
        method: 'GET',
      });
    },
    // 获取系统设置
    getSettings: () => {
      return request({
        url: '/admin/settings',
        method: 'GET',
      });
    },
    // 更新系统设置
    updateSettings: (data: any) => {
      return request({
        url: '/admin/settings',
        method: 'PUT',
        data,
      });
    },
    // 创建文章
    createPost: (data: any) => {
      return request({
        url: '/admin/posts',
        method: 'POST',
        data,
      });
    },
    // 更新文章
    updatePost: (id: string, data: any) => {
      return request({
        url: `/admin/posts/${id}`,
        method: 'PUT',
        data,
      });
    },
    // 删除文章
    deletePost: (id: string) => {
      return request({
        url: `/admin/posts/${id}`,
        method: 'DELETE',
      });
    },
    // 获取用户列表
    getUsers: () => {
      return request({
        url: '/admin/users',
        method: 'GET',
      });
    },
    // 获取单个用户信息
    getUser: (id: string) => {
      return request({
        url: `/admin/users/${id}`,
        method: 'GET',
      });
    },
    // 创建用户
    createUser: (data: any) => {
      return request({
        url: '/admin/users',
        method: 'POST',
        data,
      });
    },
    // 更新用户信息
    updateUser: (id: string, data: any) => {
      return request({
        url: `/admin/users/${id}`,
        method: 'PUT',
        data,
      });
    },
    // 删除用户
    deleteUser: (id: string) => {
      return request({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      });
    },
  },
};

export default axiosInstance; 