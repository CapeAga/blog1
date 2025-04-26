'use client';

import SiteSettingsForm from '@/components/admin/site-settings/site-settings-form';
import AdminLayout from '@/components/admin/layout/admin-layout';

export default function SiteSettingsPage() {
  return (
    <AdminLayout 
      title="站点设置" 
      description="管理网站基本信息和外观配置"
    >
      <SiteSettingsForm />
    </AdminLayout>
  );
} 