'use client';

import useSWR from 'swr';
import { apiClient } from '@/lib/api';
import { cacheConfig } from '@/config';

// 通用的请求函数
const fetcher = async (url: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': typeof window !== 'undefined' && localStorage.getItem('token')
          ? `Bearer ${localStorage.getItem('token')}`
          : '',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// 博客文章相关的hooks
export function usePosts(page = 1, pageSize = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    `/posts?page=${page}&limit=${pageSize}`,
    fetcher,
    { 
      revalidateOnFocus: false,
      dedupingInterval: cacheConfig.cachePolicies.posts,
    }
  );
  
  return {
    posts: data?.data || [],
    totalPosts: data?.total || 0,
    isLoading,
    isError: error,
    mutate,
  };
}

export function usePost(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/posts/${id}` : null,
    fetcher,
    { 
      revalidateOnFocus: false,
      dedupingInterval: cacheConfig.cachePolicies.posts,
    }
  );
  
  return {
    post: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// 分类相关hooks
export function useCategories() {
  const { data, error, isLoading } = useSWR(
    '/categories',
    fetcher,
    { 
      revalidateOnFocus: false,
      dedupingInterval: cacheConfig.cachePolicies.categories,
    }
  );
  
  return {
    categories: data || [],
    isLoading,
    isError: error,
  };
}

// 标签相关hooks
export function useTags() {
  const { data, error, isLoading } = useSWR(
    '/tags',
    fetcher,
    { 
      revalidateOnFocus: false,
      dedupingInterval: cacheConfig.cachePolicies.tags,
    }
  );
  
  return {
    tags: data || [],
    isLoading,
    isError: error,
  };
}

// AI工具相关hooks
export function useAITools() {
  const { data, error, isLoading } = useSWR(
    '/ai-tools',
    fetcher,
    { 
      revalidateOnFocus: false,
      dedupingInterval: cacheConfig.cachePolicies.aiTools,
    }
  );
  
  return {
    aiTools: data || [],
    isLoading,
    isError: error,
  };
}

export function useAITool(id: string | null) {
  const { data, error, isLoading } = useSWR(
    id ? `/ai-tools/${id}` : null,
    fetcher,
    { 
      revalidateOnFocus: false,
      dedupingInterval: cacheConfig.cachePolicies.aiTools,
    }
  );
  
  return {
    aiTool: data,
    isLoading,
    isError: error,
  };
}

// 用户相关hooks
export function useUserProfile() {
  const { data, error, isLoading, mutate } = useSWR(
    typeof window !== 'undefined' && localStorage.getItem('token')
      ? '/users/profile'
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  
  return {
    userProfile: data,
    isLoading,
    isError: error,
    mutate,
  };
} 