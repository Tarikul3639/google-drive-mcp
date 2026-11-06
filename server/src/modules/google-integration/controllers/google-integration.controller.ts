import {
    Controller,
    Get,
    Delete,
    UseGuards,
    Req,
    UnauthorizedException,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';

import type { Request } from 'express';

import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';

import { AccessTokenGuard } from '../../auth/guards/access-token.guard.js';
import { GoogleDriveGuard } from '../guards/google-drive.guard.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { GoogleIntegrationService } from '../services/google-integration.service.js';
import type { UserResponseDto } from '../../users/dto/user-response.dto.js';

interface GoogleIntegrationRequest extends Request {
    oauthStateData?: {
        userId: string | null;
        redirectTo: string | null;
    };
}

@ApiTags('Google Integration')
@Controller('google-integration')
export class GoogleIntegrationController {
    constructor(
        private readonly googleIntegrationService: GoogleIntegrationService,
    ) { }

    /**
     * Initiates Google Drive authorization.
     *
     * AccessTokenGuard authenticates the application user.
     * GoogleDriveGuard creates OAuth state and redirects to Google.
     */
    @Get('connect')
    @UseGuards(AccessTokenGuard, GoogleDriveGuard)
    @ApiCookieAuth()
    @ApiOperation({
        summary: 'Connect Google Drive account',
    })
    connect(): void {
        // Passport handles Google authorization redirect.
    }

    /**
     * Handles Google Drive OAuth callback.
     *
     * GoogleDriveGuard validates and consumes OAuth state.
     * GoogleDriveStrategy attaches Google account information to request.user.
     */
    @Get('callback')
    @UseGuards(GoogleDriveGuard)
    @ApiOperation({
        summary: 'Google Drive authorization callback',
    })
    async callback(
        @Req() request: GoogleIntegrationRequest,
    ): Promise<{ message: string }> {
        const stateData = request.oauthStateData;

        if (!stateData?.userId) {
            throw new UnauthorizedException('Invalid Google OAuth state.');
        }

        const googleAccount = request.user;

        if (!googleAccount?.googleId || !googleAccount?.accessToken) {
            throw new UnauthorizedException(
                'Google Drive account information not found.',
            );
        }

        await this.googleIntegrationService.connect(
            stateData.userId,
            googleAccount,
        );

        return {
            message: 'Google Drive connected successfully.',
        };
    }

    /**
     * Returns Google Drive connection status.
     */
    @Get('status')
    @UseGuards(AccessTokenGuard)
    @ApiCookieAuth()
    @ApiOperation({
        summary: 'Get Google Drive connection status',
    })
    async status(
        @CurrentUser() user: UserResponseDto,
    ): Promise<{ connected: boolean }> {
        const connected = await this.googleIntegrationService.isConnected(user.id);

        return { connected };
    }

    /**
     * Disconnects Google Drive account.
     */
    @Delete('disconnect')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiCookieAuth()
    @ApiOperation({
        summary: 'Disconnect Google Drive account',
    })
    async disconnect(
        @CurrentUser() user: UserResponseDto,
    ): Promise<{ message: string }> {
        await this.googleIntegrationService.disconnect(user.id);

        return {
            message: 'Google Drive disconnected successfully.',
        };
    }
}
