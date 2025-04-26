import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Alert } from '@/components/ui/alert';
import PostDetail from '@/components/blog/post-detail';
import { Loader2 } from 'lucide-react';

// 动态生成文章元数据
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
      return {
        title: '文章不存在',
        description: '抱歉，您访问的文章不存在或已被删除。'
      };
    }
    
    return {
      title: post.title,
      description: post.excerpt || `阅读 ${post.title}`,
      openGraph: {
        title: post.title,
        description: post.excerpt || `阅读 ${post.title}`,
        images: post.featuredImage ? [{ url: post.featuredImage }] : [],
        type: 'article',
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        authors: post.author ? [post.author.name] : undefined,
        tags: post.tags?.map(tag => tag.name) || []
      }
    };
  } catch (error) {
    console.error('获取文章元数据失败:', error);
    return {
      title: '文章加载失败',
      description: '抱歉，文章加载过程中出现错误。'
    };
  }
}

// 生成静态参数
export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    return posts.map(post => ({
      slug: post.slug
    }));
  } catch (error) {
    console.error('生成静态参数失败:', error);
    return [];
  }
}

// 获取文章的API
async function getPostBySlug(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}`);
    if (!response.ok) return null;
    const post = await response.json();
    return post;
  } catch (error) {
    console.error('获取文章失败:', error);
    return null;
  }
}

// 获取所有文章的API
async function getAllPosts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
    if (!response.ok) return [];
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('获取所有文章失败:', error);
    return [];
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  
  // 处理文章不存在的情况
  if (!post) {
    notFound();
  }
  
  // 构建面包屑
  const breadcrumbItems = [
    { label: '首页', href: '/' },
    { label: '博客', href: '/blog' },
    { label: post.title, href: `/blog/${params.slug}`, active: true }
  ];
  
  return (
    <div className="min-h-screen">
      <Container maxWidth="xl" className="py-4">
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
      </Container>
      
      <PostDetail post={post} />
      
      {/* 可以在这里添加评论组件、相关文章等内容 */}
    </div>
  );
} 