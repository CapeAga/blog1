# 个人博客网站

基于 Next.js 和 NestJS 构建的个人博客网站，包含博客内容发布展示和 AI 工具嵌入功能。

## 技术栈

### 前端
- Next.js (React) - 基于 App Router
- TypeScript
- Tailwind CSS
- ESLint

### 后端
- NestJS (Node.js)
- TypeScript
- PostgreSQL (数据库)
- Redis (缓存)

## 项目结构

```
blog1/                      # 项目根目录
├── apps/                   # 应用程序目录
│   ├── frontend/           # Next.js 前端应用
│   └── backend/            # NestJS 后端应用
├── docker-compose.dev.yml  # 本地开发环境 Docker Compose 配置
├── package.json            # 根项目配置
└── pnpm-workspace.yaml     # PNPM 工作区配置
```

## 环境要求

- Node.js >= 18 (LTS 版本推荐)
- PNPM >= 8
- Docker 和 Docker Compose
- Git

## 本地开发环境设置

### 1. 克隆项目

```bash
git clone https://github.com/CapeAga/blog1.git
cd blog1
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 启动开发环境

启动 PostgreSQL 和 Redis 容器：

```bash
pnpm docker:up
```

启动前端和后端开发服务器：

```bash
# 同时启动前端和后端
pnpm dev

# 或者分别启动
pnpm dev:frontend
pnpm dev:backend
```

### 4. 访问应用

- 前端: http://localhost:3000
- 后端 API: http://localhost:3001

### 5. 关闭开发环境

```bash
pnpm docker:down
```

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
```

## 部署

本项目计划使用以下部署方案：

- 前端: Vercel/Netlify
- 后端: AWS ECS/Cloud Run/Heroku
- 数据库: 托管的 PostgreSQL 服务
- 缓存: 托管的 Redis 服务
- 对象存储: AWS S3 或兼容的对象存储服务 