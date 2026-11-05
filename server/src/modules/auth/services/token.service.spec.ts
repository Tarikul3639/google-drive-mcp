import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service.js';
import { ConfigService } from '../../../config/config.service.js';

describe('TokenService', () => {
    let service: TokenService;
    let jwtService: {
        signAsync: ReturnType<typeof vi.fn>;
        verifyAsync: ReturnType<typeof vi.fn>;
    };

    const configService = {
        jwtAccessSecret: 'test-secret',
        jwtAccessTtl: '15m',
        refreshTokenTtl: 30 * 24 * 60 * 60 * 1000,
    };

    beforeEach(async () => {
        jwtService = {
            signAsync: vi.fn(),
            verifyAsync: vi.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TokenService,
                {
                    provide: JwtService,
                    useValue: jwtService,
                },
                {
                    provide: ConfigService,
                    useValue: configService,
                },
            ],
        }).compile();

        service = module.get<TokenService>(TokenService);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('generateAccessToken', () => {
        it('should generate an access token', async () => {
            jwtService.signAsync.mockResolvedValue('mock-access-token');

            const token = await service.generateAccessToken(
                'user-123',
                'session-123',
            );

            expect(token).toBe('mock-access-token');
            expect(jwtService.signAsync).toHaveBeenCalledWith(
                {
                    sub: 'user-123',
                    sid: 'session-123',
                },
                {
                    secret: configService.jwtAccessSecret,
                    expiresIn: configService.jwtAccessTtl,
                },
            );
        });
    });

    describe('generateRefreshToken', () => {
        it('should generate a refresh token with its hash and expiry', () => {
            const before = Date.now();

            const result = service.generateRefreshToken();

            const after = Date.now();

            expect(result.token).toBeDefined();
            expect(result.hash).toBeDefined();
            expect(result.expiresAt).toBeInstanceOf(Date);

            expect(result.token).not.toBe(result.hash);
            expect(result.hash).toMatch(/^[a-f0-9]{64}$/);

            expect(result.expiresAt.getTime()).toBeGreaterThanOrEqual(
                before + configService.refreshTokenTtl,
            );
            expect(result.expiresAt.getTime()).toBeLessThanOrEqual(
                after + configService.refreshTokenTtl,
            );
        });
    });

    describe('hashRefreshToken', () => {
        it('should hash a refresh token', () => {
            const hash = service.hashRefreshToken('test-refresh-token');

            expect(hash).toMatch(/^[a-f0-9]{64}$/);
        });

        it('should generate the same hash for the same token', () => {
            const token = 'test-refresh-token';

            expect(service.hashRefreshToken(token)).toBe(
                service.hashRefreshToken(token),
            );
        });
    });

    describe('verifyAccessToken', () => {
        it('should verify an access token', async () => {
            const payload = {
                sub: 'user-123',
                sid: 'session-123',
            };

            jwtService.verifyAsync.mockResolvedValue(payload);

            const result = await service.verifyAccessToken('mock-access-token');

            expect(result).toEqual(payload);
            expect(jwtService.verifyAsync).toHaveBeenCalledWith(
                'mock-access-token',
                {
                    secret: configService.jwtAccessSecret,
                },
            );
        });
    });
});