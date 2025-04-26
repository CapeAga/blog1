'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardImage } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { Avatar } from '@/components/ui/avatar';

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  featuredImage?: string | {
    url: string;
    alt: string;
  };
  publishedAt: string;
  updatedAt?: string;
  author?: {
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
}

export interface PostCardProps {
  post: Post;
  variant?: 'default' | 'compact' | 'featured';
}

export default function PostCard({ post, variant = 'default' }: PostCardProps) {
  const {
    slug,
    title,
    excerpt,
    featuredImage,
    publishedAt,
    author,
    categories,
    tags
  } = post;

  // 根据变体调整显示内容
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';
  
  // 处理图片URL
  const imageUrl = typeof featuredImage === 'string' 
    ? featuredImage 
    : featuredImage?.url;
  
  // 处理图片alt文本
  const imageAlt = typeof featuredImage === 'object' 
    ? featuredImage?.alt || title 
    : title;

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      {imageUrl && !isCompact && (
        <Link href={`/blog/${slug}`} className="block relative overflow-hidden">
          <CardImage
            src={imageUrl}
            alt={imageAlt}
            position="top"
            className={`object-cover transition-transform duration-300 hover:scale-105 ${
              isFeatured ? 'h-60 sm:h-72' : 'h-48'
            }`}
          />
        </Link>
      )}
      
      <CardContent className={`${isCompact ? 'p-3' : 'p-4 sm:p-6'}`}>
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.slice(0, isCompact ? 1 : 3).map((category) => (
              <Link 
                key={category.id} 
                href={`/blog/categories/${category.slug}`}
              >
                <Badge variant="primary" size="sm">
                  {category.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}
        
        <Link href={`/blog/${slug}`}>
          <Text 
            variant={isFeatured ? 'h2' : isCompact ? 'h4' : 'h3'} 
            className="mb-2 hover:text-primary transition-colors line-clamp-2"
          >
            {title}
          </Text>
        </Link>
        
        {!isCompact && (
          <Text 
            variant="body-sm" 
            color="muted" 
            className={`mb-4 line-clamp-${isFeatured ? '4' : '3'}`}
          >
            {excerpt}
          </Text>
        )}
        
        <CardFooter className="px-0 pt-3 pb-0 mt-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {author && (
              <>
                <Avatar
                  src={author.avatar}
                  fallbackText={author.name.substring(0, 2)}
                  size={isCompact ? 'xs' : 'sm'}
                  alt={author.name}
                />
                <Text variant="caption" color="muted">
                  {author.name}
                </Text>
              </>
            )}
          </div>
          
          <Text variant="caption" color="muted">
            {formatDate(publishedAt)}
          </Text>
        </CardFooter>
      </CardContent>
    </Card>
  );
} 