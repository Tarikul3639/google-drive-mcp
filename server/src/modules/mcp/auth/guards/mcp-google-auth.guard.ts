
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class McpGoogleAuthGuard extends AuthGuard('mcp-google') {}
