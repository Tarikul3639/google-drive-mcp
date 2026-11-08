import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module.js';
import { ConfigService } from './config/config.service.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Create the NestJS application
  const app = await NestFactory.create(AppModule);

  // Parse cookies from incoming HTTP requests
  app.use(cookieParser());

  // Enable Cross-Origin Resource Sharing (CORS)
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Validate and transform incoming request data
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Set the global API prefix and exclude the well-known routes
  app.setGlobalPrefix('api', {
    exclude: ['.well-known/{*path}'],
  });

  // Get application configuration
  const configService = app.get(ConfigService);

  // Configure Swagger API documentation
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

  // Generate the Swagger documentation
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  // Register Swagger UI and API documentation routes
  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Start the HTTP server
  await app.listen(configService.port);

  logger.log(`Application running on port ${configService.port}`);
  logger.log('Swagger: /api/docs');
}

// Handle application startup errors
bootstrap().catch((error: unknown) => {
  console.error('[FATAL] Application startup failed:', error);
  process.exit(1);
});