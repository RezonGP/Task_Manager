import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      //whitelist: true, // chỉ cho phép các trường có trong DTO được truyền vào
      whitelist: true,
      //transform: true, // chuyển đổi dữ liệu vào DTO
      transform: true,
      //forbidNonWhitelisted: true, // nếu request gửi field không có trong DTO thì báo lỗi luôn
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// 1. Enable CORS: cho phép truy cập từ các domain khác