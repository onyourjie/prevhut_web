import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Vite frontend
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', '*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Enable global validation pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Setup Swagger OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('FIRELINE Core Backend API')
    .setDescription(
      'Core REST API untuk Platform FIRELINE (WIA MIA 2026): Auth 3 Role (Warga, Relawan, Admin), Feed Komunitas & Laporan Warga, Penugasan Relawan Lapangan, Notifikasi, dan Integrasi Geospasial.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🔥 FIRELINE Core Backend running on http://localhost:${port}`);
  console.log(`📖 Swagger API documentation available at http://localhost:${port}/api/docs`);
}
await bootstrap();
