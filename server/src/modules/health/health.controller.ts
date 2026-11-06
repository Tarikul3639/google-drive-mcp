import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { HealthService } from './health.service.js';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
  ) { }

  @Get('live')
  @ApiOperation({
    summary: 'Check application liveness',
    description: 'Checks whether the application process is running.',
  })
  checkLiveness() {
    return this.healthService.checkLiveness();
  }

  @Get('database')
  @ApiOperation({
    summary: 'Check database health',
    description: 'Checks PostgreSQL database connectivity.',
  })
  checkDatabase() {
    return this.healthService.checkDatabase();
  }

  @Get('redis')
  @ApiOperation({
    summary: 'Check Redis health',
    description: 'Checks Redis connectivity.',
  })
  checkRedis() {
    return this.healthService.checkRedis();
  }

  @Get('memory')
  @ApiOperation({
    summary: 'Check memory health',
    description: 'Checks application memory usage.',
  })
  checkMemory() {
    return this.healthService.checkMemory();
  }
}