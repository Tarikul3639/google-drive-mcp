import { Module, Global } from '@nestjs/common';
import { ConfigService } from './config.service.js';
import { ConfigModule as AppConfigService } from '@nestjs/config';
import { validationSchema } from './env.schema.js';

@Global()
@Module({
  imports: [
    AppConfigService.forRoot({
      isGlobal: true,
      validationSchema,
      envFilePath: ['.env', '.env.local', '.env.prod', '.env.test'],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
