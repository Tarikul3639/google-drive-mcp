import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module.js';
import { GoogleModule } from './modules/google/google.module.js';
import { DriveModule } from './modules/drive/drive.module.js';
import { McpModule } from './modules/mcp/mcp.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { ConfigModule } from './config/config.module.js';

@Module({
  imports: [
    AuthModule,
    GoogleModule,
    DriveModule,
    McpModule,
    UsersModule,
    HealthModule,
    ConfigModule,
  ],
})
export class AppModule {}
