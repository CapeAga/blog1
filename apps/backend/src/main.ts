import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 配置全局前缀
  app.setGlobalPrefix('api');
  
  // 配置CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });
  
  // 添加全局验证管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // 自动移除未定义的属性
    forbidNonWhitelisted: true, // 拒绝包含未定义属性的请求
    transform: true, // 自动转换类型
  }));
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap();
