import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    app.setGlobalPrefix('api');
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
      }),
    );

    app.enableCors({
      origin: process.env.FRONTEND_URL || '*',
      credentials: true,
    });

    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    
    logger.log(`🚀 API running on port ${port}`);
    logger.log(`✅ Health: http://localhost:${port}/api/health`);
    logger.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    
  } catch (error) {
    const logger = new Logger('Bootstrap');
    logger.error('Failed to start application:', error.message);
    logger.error(error.stack);
    process.exit(1);
  }
}

bootstrap();
