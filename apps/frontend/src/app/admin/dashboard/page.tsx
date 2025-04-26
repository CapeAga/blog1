'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  DonutChart,
  Metric, 
  Text, 
  Flex, 
  Grid
} from '@tremor/react';
import { Activity, Users, FileText, Image } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

const StatCard = ({ title, value, icon, description }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

interface RecentActivityProps {
  activities: {
    id: string;
    action: string;
    target: string;
    timestamp: Date;
    user: string;
  }[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => (
  <Card className="col-span-1 md:col-span-2">
    <CardHeader>
      <CardTitle>最近活动</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {activity.user} {activity.action} {activity.target}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(activity.timestamp, 'PPpp', { locale: zhCN })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const chartdata = [
  {
    date: '2023-01-01',
    访问量: 2890,
    点赞: 1322,
    评论: 501,
  },
  {
    date: '2023-02-01',
    访问量: 3868,
    点赞: 1509,
    评论: 635,
  },
  {
    date: '2023-03-01',
    访问量: 4021,
    点赞: 1892,
    评论: 710,
  },
  {
    date: '2023-04-01',
    访问量: 3561,
    点赞: 1459,
    评论: 602,
  },
  {
    date: '2023-05-01',
    访问量: 4238,
    点赞: 1903,
    评论: 689,
  },
  {
    date: '2023-06-01',
    访问量: 4501,
    点赞: 2215,
    评论: 772,
  },
];

const categoryData = [
  {
    category: '技术',
    posts: 35,
  },
  {
    category: '生活',
    posts: 27,
  },
  {
    category: '阅读',
    posts: 19,
  },
  {
    category: '摄影',
    posts: 12,
  },
  {
    category: '旅行',
    posts: 8,
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activities, setActivities] = useState<RecentActivityProps['activities']>([
    {
      id: '1',
      action: '发布了文章',
      target: '《如何提高代码质量》',
      timestamp: new Date(2023, 5, 15, 9, 30),
      user: '管理员',
    },
    {
      id: '2',
      action: '更新了文章',
      target: '《React 18新特性解析》',
      timestamp: new Date(2023, 5, 14, 15, 45),
      user: '管理员',
    },
    {
      id: '3',
      action: '删除了评论',
      target: 'ID:12345',
      timestamp: new Date(2023, 5, 14, 11, 20),
      user: '管理员',
    },
    {
      id: '4',
      action: '更新了网站设置',
      target: '首页banner',
      timestamp: new Date(2023, 5, 13, 16, 10),
      user: '管理员',
    },
    {
      id: '5',
      action: '上传了媒体文件',
      target: 'summer_vacation.jpg',
      timestamp: new Date(2023, 5, 12, 10, 5),
      user: '管理员',
    },
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
      </div>
      
      <Grid numItemsMd={2} numItemsLg={4} className="gap-6 mt-6">
        <StatCard
          title="总文章数"
          value={89}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          description="较上月增长 12%"
        />
        <StatCard
          title="总访问量"
          value="23,543"
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          description="较上月增长 8.2%"
        />
        <StatCard
          title="用户数"
          value="1,245"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="较上月增长 5.1%"
        />
        <StatCard
          title="媒体文件"
          value={342}
          icon={<Image className="h-4 w-4 text-muted-foreground" />}
          description="总占用空间 2.4GB"
        />
      </Grid>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>访问统计</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={chartdata}
              index="date"
              categories={["访问量", "点赞", "评论"]}
              colors={["blue", "red", "green"]}
              yAxisWidth={40}
              className="h-72"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>文章分类</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={categoryData}
              category="posts"
              index="category"
              colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
              className="h-52"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <RecentActivity activities={activities} />
        
        <Card>
          <CardHeader>
            <CardTitle>待办事项</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    完成"夏季旅行推荐"文章
                  </p>
                  <p className="text-xs text-muted-foreground">今天截止</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    审核新用户评论
                  </p>
                  <p className="text-xs text-muted-foreground">共15条待审核</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    更新网站SEO设置
                  </p>
                  <p className="text-xs text-muted-foreground">优先级：中</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    备份数据库
                  </p>
                  <p className="text-xs text-muted-foreground">每周例行任务</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 