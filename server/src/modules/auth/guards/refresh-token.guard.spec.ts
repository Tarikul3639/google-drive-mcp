import { RefreshTokenGuard } from './refresh-token.guard.js';
import { SessionService } from '../services/session.service.js';

describe('RefreshTokenGuard', () => {
  it('should be defined', () => {
    expect(new RefreshTokenGuard({} as SessionService)).toBeDefined();
  });
});
