import { GoogleAuthGuard } from './google-auth.guard.js';
import { OAuthStateService } from '../services/oauth-state.service.js';

describe('GoogleAuthGuard', () => {
  it('should be defined', () => {
    expect(new GoogleAuthGuard({} as OAuthStateService)).toBeDefined();
  });
});
