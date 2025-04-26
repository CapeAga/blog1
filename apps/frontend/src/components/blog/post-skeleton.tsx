export default function PostSkeleton() {
  return (
    <div className="card overflow-hidden flex flex-col h-full animate-pulse">
      {/* 图片骨架 */}
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>
      
      <div className="flex-1 p-6">
        {/* 分类骨架 */}
        <div className="flex gap-2 mb-3">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
        
        {/* 标题骨架 */}
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        
        {/* 摘要骨架 */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
        
        {/* 作者和日期骨架 */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
} 