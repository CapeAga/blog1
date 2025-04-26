# 个人博客网站

基于 Next.js 和 NestJS 构建的个人博客网站，包含博客内容发布展示和 AI 工具嵌入功能。

## 技术栈

### 前端
- Next.js (React) - 基于 App Router
- TypeScript
- Tailwind CSS
- ESLint
- TipTap 富文本编辑器
- SWR 数据获取

### 后端
- NestJS (Node.js)
- TypeScript
- PostgreSQL (数据库)
- Redis (缓存)
- Prisma ORM
- Passport (认证)

## 项目结构

```
blog1/                      # 项目根目录
├── apps/                   # 应用程序目录
│   ├── frontend/           # Next.js 前端应用
│   │   ├── src/            # 源代码
│   │   │   ├── app/        # Next.js App Router 页面
│   │   │   ├── components/ # React 组件
│   │   │   ├── lib/        # 工具和辅助函数
│   │   │   └── types/      # TypeScript 类型定义
│   └── backend/            # NestJS 后端应用
│       ├── src/            # 源代码
│       │   ├── modules/    # NestJS 模块
│       │   ├── prisma/     # Prisma 配置和迁移
│       │   └── main.ts     # 应用入口
├── docker-compose.dev.yml  # 本地开发环境 Docker Compose 配置
├── package.json            # 根项目配置
└── pnpm-workspace.yaml     # PNPM 工作区配置
```

## 环境要求

- Node.js >= 18 (LTS 版本推荐)
- PNPM >= 8 (必须使用 PNPM 作为包管理器)
- Docker 和 Docker Compose (用于本地开发数据库)
- Git

## 本地开发环境设置

### 1. 安装 Node.js 和 PNPM

如果尚未安装 Node.js，请从 [官方网站](https://nodejs.org/) 下载并安装 LTS 版本。

安装 PNPM:

```bash
npm install -g pnpm
```

### 2. 克隆项目

```bash
git clone https://github.com/yourusername/blog1.git
cd blog1
```

### 3. 安装依赖

在项目根目录执行:

```bash
pnpm install
```

这将安装根项目及所有子项目的依赖。

### 4. 环境配置

在 `apps/backend/` 目录中创建 `.env` 文件:

```
# 数据库连接
DATABASE_URL="postgresql://pguser:pgpassword@localhost:5432/blog?schema=public"

# Redis 连接
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT 配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# 服务器配置
PORT=3001
```

在 `apps/frontend/` 目录中创建 `.env.local` 文件:

```
# API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. 启动开发环境

#### 启动数据库容器

启动 PostgreSQL 和 Redis 容器:

```bash
pnpm docker:up
```

#### 初始化数据库

初始化 Prisma 和数据库结构:

```bash
cd apps/backend
npx prisma migrate dev --name init
cd ../..
```

#### 启动应用

同时启动前端和后端:

```bash
cd ./blog1
pnpm dev
```

或者分别启动:

```bash
# 前端
pnpm dev:frontend

# 后端
pnpm dev:backend
```

### 6. 访问应用

- 前端: http://localhost:3000
- 后端 API: http://localhost:3001
- API 文档: http://localhost:3001/api

## 常见问题排查

### 样式不显示

如果页面样式没有正确加载:

1. 确保 Tailwind CSS 已正确安装和配置
2. 在前端应用中检查 `globals.css` 是否被正确导入
3. 确保前端组件中使用的是项目定义的 UI 组件
4. 重新启动开发服务器，清除浏览器缓存

### 无法连接数据库

如果遇到数据库连接问题:

1. 确保 Docker 容器正在运行: `docker ps`
2. 验证 `.env` 文件中的数据库连接字符串是否正确
3. 尝试重启数据库容器: `pnpm docker:down && pnpm docker:up`

### API 请求失败

如果前端无法连接到后端 API:

1. 确保后端服务已启动并运行在正确的端口上
2. 检查 `NEXT_PUBLIC_API_URL` 环境变量是否设置正确
3. 查看浏览器控制台中的错误信息

## 其他常用命令

```bash
# 构建所有应用
pnpm build

# 运行测试
pnpm test

# 代码风格检查
pnpm lint

# 查看 Docker 容器日志
pnpm docker:logs

# 停止所有开发容器
pnpm docker:down
```

## 部署

本项目计划使用以下部署方案：

- 前端: Vercel/Netlify
- 后端: AWS ECS/Cloud Run/Heroku
- 数据库: 托管的 PostgreSQL 服务
- 缓存: 托管的 Redis 服务
- 对象存储: AWS S3 或兼容的对象存储服务 