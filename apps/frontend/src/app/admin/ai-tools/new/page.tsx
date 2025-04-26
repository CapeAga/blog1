'use client';

import AdminLayout from '@/components/admin/layout/admin-layout';
import AIToolForm from '@/components/admin/ai-tools/ai-tool-form';

export default function NewAIToolPage() {
  return (
    <AdminLayout 
      title="创建AI工具" 
      description="添加新的AI工具到您的网站"
    >
      <AIToolForm />
    </AdminLayout>
  );
} 