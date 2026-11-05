import {
    Controller,
    Get,
    Post,
    UseGuards,
    Req,
    Res,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { ApiTags, ApiCookieAuth, ApiOperation } from '@nestjs/swagger';

import { AuthGuard } from '../guards/auth.guard.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import type { UserResponseDto } from '../../users/dto/user-response.dto.js';
import { LoginService } from '../services/login.service.js';
import { LogoutService } from '../services/logout.service.js';
import { ConfigService } from '../../../config/config.service.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly loginService: LoginService,
        private readonly logoutService: LogoutService,
        private readonly configService: ConfigService,
    ) { }

    // Endpoint to get the authenticated user's information
    @Get('me')
    @UseGuards(AuthGuard)
    @ApiCookieAuth()
    @ApiOperation({ summary: 'Get authenticated user' })
    getMe(@CurrentUser() user: UserResponseDto) {
        return user;
    }

    // Login endpoint
    @Post('logout')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ): Promise<void> {
        // Get the session ID from the request cookies
        const sessionId = request.cookies?.[this.configService.sessionCookieName];
        // Call the logout service to destroy the session
        await this.logoutService.logout(sessionId);
        // Clear the session cookie
        response.clearCookie(this.configService.sessionCookieName);
    }
}
