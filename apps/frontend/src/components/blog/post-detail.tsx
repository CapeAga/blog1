'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import { Alert } from '@/components/ui/alert';
import { X, Calendar, RefreshCw, Share2, Heart, Bookmark, MessageSquare } from 'lucide-react';

interface PostDetailProps {
  post: {
    id: string;
    title: string;
    content: string;
    featuredImage?: string | {
      url: string;
      alt?: string;
    };
    publishedAt: string;
    updatedAt?: string;
    author?: {
      id?: string;
      name: string;
      avatar?: string;
    };
    categories?: {
      id: string;
      name: string;
      slug: string;
    }[];
    tags?: {
      id: string;
      name: string;
      slug: string;
    }[];
    viewCount?: number;
    likeCount?: number;
    commentCount?: number;
  };
}

export default function PostDetail({ post }: PostDetailProps) {
  const [imageOpen, setImageOpen] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
    enhanceContentWithImageLightbox();
  }, []);
  
  if (!post) return null;
  
  const { 
    title, 
    content, 
    featuredImage, 
    publishedAt, 
    updatedAt, 
    author, 
    categories, 
    tags,
    viewCount,
    likeCount,
    commentCount
  } = post;
  
  // 处理图片URL和alt文本
  const featuredImageUrl = typeof featuredImage === 'string' 
    ? featuredImage 
    : featuredImage?.url;
  
  const featuredImageAlt = typeof featuredImage === 'object' 
    ? featuredImage?.alt || title 
    : title;
  
  // 检查文章是否被更新过
  const isUpdated = updatedAt && new Date(updatedAt).getTime() > new Date(publishedAt).getTime();
  
  // 简单的 Lightbox 效果
  const handleImageClick = (imageUrl: string) => {
    setImageOpen(imageUrl);
  };
  
  // 处理文章内容中的图片点击事件
  const enhanceContentWithImageLightbox = () => {
    if (typeof document !== 'undefined') {
      setTimeout(() => {
        const articleImages = document.querySelectorAll('.post-content img');
        articleImages.forEach(img => {
          img.classList.add('cursor-pointer', 'hover:opacity-90', 'transition-opacity');
          img.addEventListener('click', () => {
            const src = img.getAttribute('src');
            if (src) handleImageClick(src);
          });
        });
      }, 500);
    }
  };
  
  return (
    <Container maxWidth="lg" className="py-6">
      <article className="max-w-3xl mx-auto">
        {/* 文章头部 */}
        <header className="mb-6 sm:mb-8">
          <Text 
            variant="h1" 
            className="mb-4 text-2xl sm:text-3xl md:text-4xl leading-tight"
          >
            {title}
          </Text>
          
          {/* 作者信息和日期 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-4 sm:mb-6">
            {author && (
              <div className="flex items-center gap-2">
                <Avatar
                  src={author.avatar}
                  fallback={author.name.substring(0, 2)}
                  size="sm"
                  alt={author.name}
                  className="border-2 border-primary/10"
                />
                <Text variant="body-sm" className="font-medium">{author.name}</Text>
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{formatDate(publishedAt)}</span>
              </div>
              
              {isUpdated && (
                <div className="flex items-center gap-1">
                  <RefreshCw size={14} />
                  <span>{formatDate(updatedAt!)}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* 统计信息 */}
          {(viewCount !== undefined || likeCount !== undefined || commentCount !== undefined) && (
            <div className="flex gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
              {viewCount !== undefined && (
                <div className="flex items-center gap-1">
                  <span>阅读 {viewCount}</span>
                </div>
              )}
              {likeCount !== undefined && (
                <div className="flex items-center gap-1">
                  <Heart size={14} />
                  <span>{likeCount}</span>
                </div>
              )}
              {commentCount !== undefined && (
                <div className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  <span>{commentCount}</span>
                </div>
              )}
            </div>
          )}
          
          {/* 特色图片 */}
          {featuredImageUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-6 sm:mb-8 shadow-md">
              <Image
                src={featuredImageUrl}
                alt={featuredImageAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 800px"
                className="object-cover cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:brightness-105"
                onClick={() => handleImageClick(featuredImageUrl)}
                priority
              />
            </div>
          )}
          
          {/* 分类和标签 */}
          <div className="space-y-3">
            {categories && categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Text variant="body-sm" color="muted" className="mr-1">分类:</Text>
                {categories.map(category => (
                  <Link
                    key={category.id}
                    href={`/blog/categories/${category.slug}`}
                  >
                    <Badge variant="default" size="sm">
                      {category.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
            
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Text variant="body-sm" color="muted" className="mr-1">标签:</Text>
                {tags.map(tag => (
                  <Link
                    key={tag.id}
                    href={`/blog/tags/${tag.slug}`}
                  >
                    <Badge variant="secondary" size="sm">
                      #{tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>
        
        {/* 文章内容 */}
        <div 
          className="post-content prose prose-sm sm:prose lg:prose-lg max-w-none prose-img:rounded-md prose-img:shadow-md prose-headings:mt-8 prose-headings:mb-4 prose-p:my-4 prose-a:text-primary hover:prose-a:text-primary/80 dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        
        {/* 文章底部 */}
        <footer className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
            {/* 社交分享按钮 */}
            <div className="flex items-center gap-4">
              <button className="text-gray-500 hover:text-primary transition-colors" aria-label="收藏文章">
                <Bookmark size={20} />
              </button>
              <button className="text-gray-500 hover:text-red-500 transition-colors" aria-label="喜欢文章">
                <Heart size={20} />
              </button>
              <button className="text-gray-500 hover:text-primary transition-colors" aria-label="分享文章">
                <Share2 size={20} />
              </button>
            </div>
          </div>
          
          <Alert variant="info" className="mb-8">
            <Text variant="body-sm">
              感谢阅读！如果您喜欢这篇文章，欢迎分享给您的朋友或收藏以便再次阅读。
            </Text>
          </Alert>
        </footer>
      </article>
      
      {/* 图片灯箱 */}
      {isLoaded && imageOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setImageOpen(null)}
        >
          <div className="relative max-w-full max-h-full">
            <Image
              src={imageOpen}
              alt="放大图片"
              width={1200}
              height={800}
              className="object-contain max-h-[90vh] max-w-[90vw] animate-scaleIn"
            />
            <button 
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setImageOpen(null);
              }}
              aria-label="关闭图片"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </Container>
  );
} 