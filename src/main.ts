import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // ✅ 요청과 응답 로깅 미들웨어
  app.use((req, res, next) => {
    console.log(`[요청 받음] ${req.method} ${req.originalUrl}`);

    // 응답이 끝나면 로그 출력
    res.on('finish', () => {
      console.log(
        `[응답 보냄] ${req.method} ${req.originalUrl} - 상태코드: ${res.statusCode}`,
      );
    });

    next();
  });

  app.enableCors({
    origin: ['http://localhost:8080', 'https://recipe-log-eight.vercel.app'],
    credentials: true,
  });

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Recipe API')
    .setDescription('레시피 서비스 API 문서')
    .setVersion('1.0')
    .addBearerAuth() // JWT 인증 시 필요
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
