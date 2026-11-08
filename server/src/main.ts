import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { ConfigService } from './config/config.service.js';
import cookieParser from 'cookie-parser';

// import { startMemoryMonitor } from './common/utils/memory-monitor.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    logger.log('[BOOT] Starting application...');

    // startMemoryMonitor();

    logger.log('[BOOT] Creating NestJS application...');
    const app = await NestFactory.create(AppModule);
    logger.log('[BOOT] NestJS application created successfully.');

    // Enable cookie parsing middleware
    app.use(cookieParser());
    logger.log('[BOOT] Cookie parser configured.');

    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    logger.log('[BOOT] CORS configured.');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    logger.log('[BOOT] Global validation pipe configured.');

    app.setGlobalPrefix('api', {
      exclude: ['.well-known/{*path}'],
    });
    logger.log('[BOOT] Global API prefix configured.');

    logger.log('[BOOT] Loading application configuration...');
    const configService = app.get(ConfigService);
    const port = configService.port;
    logger.log(`[BOOT] Configuration loaded. Port: ${port}`);

    const swaggerConfig = new DocumentBuilder()
      .setTitle('Google Drive MCP API')
      .setDescription('API documentation for the Google Drive MCP service.')
      .setVersion('1.0.0')
      .addCookieAuth(
        'access_token',
        {
          type: 'apiKey',
          in: 'cookie',
        },
        'access-cookie',
      )
      .build();

    logger.log('[BOOT] Generating Swagger documentation...');
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('api/docs', app, swaggerDocument, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
    logger.log('[BOOT] Swagger documentation configured.');

    logger.log('[BOOT] Starting HTTP server...');
    await app.listen(port);

    logger.log(`Server is running on port ${port}/api`);
    logger.log(`Swagger docs: /api/docs`);
    logger.log(`Swagger JSON: /api/docs-json`);
    logger.log('[BOOT] Application started successfully.');
  } catch (error) {
    logger.error(
      '[BOOT] Application startup failed!',
      error instanceof Error ? error.stack : String(error),
    );

    throw error;
  }
}

bootstrap().catch((error) => {
  console.error('[FATAL] Bootstrap failed:', error);
  process.exit(1);
});