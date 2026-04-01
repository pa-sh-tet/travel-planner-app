import { api } from './api.js';
import { tokenStorage } from './storage.js';

const DEMO_USER = {
  name: 'Demo Student',
  email: 'demo@travelplanner.local',
  password: 'demo12345',
};

export const authService = {
  async ensureSession() {
    const existingToken = tokenStorage.get();
    if (existingToken) {
      try {
        await api.get('/auth/me');
        return;
      } catch {
        tokenStorage.clear();
      }
    }

    try {
      const loginResult = await api.post('/auth/login', {
        email: DEMO_USER.email,
        password: DEMO_USER.password,
      });
      tokenStorage.set(loginResult.token);
    } catch {
      await api.post('/auth/register', DEMO_USER);
      const loginResult = await api.post('/auth/login', {
        email: DEMO_USER.email,
        password: DEMO_USER.password,
      });
      tokenStorage.set(loginResult.token);
    }
  },
  logout() {
    tokenStorage.clear();
  },
};
