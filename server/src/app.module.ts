import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { RedisModule } from './redis/redis.module.js';

import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { GoogleIntegrationModule } from './modules/google-integration/google-integration.module.js';
import { GoogleDriveModule } from './modules/google-drive/google-drive.module.js';
import { McpModule } from './modules/mcp/mcp.module.js';
import { HealthModule } from './modules/health/health.module.js';

@Module({
  imports: [
    // Core
    ConfigModule,
    PrismaModule,
    RedisModule,

    // Business modules
    UsersModule,
    AuthModule,
    GoogleIntegrationModule,
    GoogleDriveModule,

    // Application
    McpModule,
    HealthModule,
  ],
})
export class AppModule {}
