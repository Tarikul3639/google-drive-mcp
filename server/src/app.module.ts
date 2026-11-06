import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module.js';
import { McpModule } from './modules/mcp/mcp.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { ConfigModule } from './config/config.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { RedisModule } from './redis/redis.module.js';
import { GoogleDriveModule } from './modules/google-drive/google-drive.module.js';
import { GoogleIntegrationModule } from './modules/google-integration/google-integration.module.js';

@Module({
  imports: [
    AuthModule,
    McpModule,
    UsersModule,
    HealthModule,
    ConfigModule,
    PrismaModule,
    RedisModule,
    GoogleDriveModule,
    GoogleIntegrationModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule { }
