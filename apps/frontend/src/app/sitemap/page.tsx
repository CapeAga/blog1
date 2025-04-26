import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Text } from '@/components/ui/text';

export const metadata: Metadata = {
  title: '网站地图 | 个人博客',
  description: '浏览我们网站的所有页面和内容分类，快速导航到您感兴趣的内容',
};

export default function SitemapPage() {
  return (
    <Container maxWidth="2xl" paddingX={true}>
      <Text variant="h1" weight="bold" className="mb-6">
        网站地图
      </Text>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        <div className="mb-4 sm:mb-0">
          <Text variant="h2" weight="semibold" className="mb-3 border-b pb-2">
            主要页面
          </Text>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>首页</Text>
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>博客</Text>
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>关于我</Text>
              </Link>
            </li>
            <li>
              <Link href="/portfolio" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>作品集</Text>
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>联系我</Text>
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="mb-4 sm:mb-0">
          <Text variant="h2" weight="semibold" className="mb-3 border-b pb-2">
            博客分类
          </Text>
          <ul className="space-y-2">
            <li>
              <Link href="/blog/category/technology" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>技术</Text>
              </Link>
            </li>
            <li>
              <Link href="/blog/category/programming" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>编程</Text>
              </Link>
            </li>
            <li>
              <Link href="/blog/category/design" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>设计</Text>
              </Link>
            </li>
            <li>
              <Link href="/blog/category/ai" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>人工智能</Text>
              </Link>
            </li>
            <li>
              <Link href="/blog/category/career" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>职业发展</Text>
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="mb-4 sm:mb-0">
          <Text variant="h2" weight="semibold" className="mb-3 border-b pb-2">
            资源
          </Text>
          <ul className="space-y-2">
            <li>
              <Link href="/resources/tools" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>推荐工具</Text>
              </Link>
            </li>
            <li>
              <Link href="/resources/books" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>推荐书籍</Text>
              </Link>
            </li>
            <li>
              <Link href="/resources/courses" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>在线课程</Text>
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="mb-4 sm:mb-0">
          <Text variant="h2" weight="semibold" className="mb-3 border-b pb-2">
            法律与支持
          </Text>
          <ul className="space-y-2">
            <li>
              <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>隐私政策</Text>
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>服务条款</Text>
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>常见问题</Text>
              </Link>
            </li>
            <li>
              <Link href="/support" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>获取支持</Text>
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="mb-4 sm:mb-0">
          <Text variant="h2" weight="semibold" className="mb-3 border-b pb-2">
            社交媒体
          </Text>
          <ul className="space-y-2">
            <li>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Text>GitHub</Text>
              </a>
            </li>
            <li>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Text>Twitter</Text>
              </a>
            </li>
            <li>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Text>LinkedIn</Text>
              </a>
            </li>
            <li>
              <a 
                href="https://zhihu.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Text>知乎</Text>
              </a>
            </li>
            <li>
              <a 
                href="https://juejin.cn" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Text>掘金</Text>
              </a>
            </li>
          </ul>
        </div>
        
        <div className="mb-4 sm:mb-0">
          <Text variant="h2" weight="semibold" className="mb-3 border-b pb-2">
            管理
          </Text>
          <ul className="space-y-2">
            <li>
              <Link href="/admin" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>管理后台</Text>
              </Link>
            </li>
            <li>
              <Link href="/admin/blog" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>博客管理</Text>
              </Link>
            </li>
            <li>
              <Link href="/admin/media" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>媒体库</Text>
              </Link>
            </li>
            <li>
              <Link href="/admin/comments" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>评论管理</Text>
              </Link>
            </li>
            <li>
              <Link href="/admin/settings" className="text-blue-600 dark:text-blue-400 hover:underline">
                <Text>网站设置</Text>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </Container>
  );
} 