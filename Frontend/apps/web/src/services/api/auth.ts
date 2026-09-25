import { apiClient } from './client';
import { AuthResponse, User } from '../../types';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export const authService = {
  login: async (email: string, password: string, role?: 'platform_admin' | 'corporate_buyer'): Promise<AuthResponse> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 400));
      const effectiveRole = role || 'platform_admin';
      const user: User = {
        id: effectiveRole === 'platform_admin' ? 'usr-platform-01' : 'usr-buyer-01',
        name: effectiveRole === 'platform_admin' ? 'Swiggy Ops Admin' : 'Manipal Group ESG Lead',
        email,
        role: effectiveRole,
        companyName: effectiveRole === 'platform_admin' ? 'Swiggy' : 'Manipal Group',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      };
      return { token: 'mock-jwt-token-12345', user };
    }
    // Backend POST /auth/login expects { email, password }, returns { token, user }
    const res = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    return res.data;
  },

  signup: async (data: { email: string; password: string; role: 'platform_admin' | 'corporate_buyer'; companyName?: string }): Promise<AuthResponse> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 400));
      const user: User = {
        id: `usr-${Date.now()}`,
        name: data.companyName || (data.role === 'platform_admin' ? 'Fleet Admin' : 'ESG Lead'),
        email: data.email,
        role: data.role,
        companyName: data.companyName || 'New Company',
      };
      return { token: 'mock-jwt-token-12345', user };
    }
    const res = await apiClient.post<AuthResponse>('/auth/signup', data);
    return res.data;
  },

  getMe: async (): Promise<User> => {
    if (USE_MOCKS) {
      return {
        id: 'usr-platform-01',
        name: 'Swiggy Ops Admin',
        email: 'ops@swiggy.in',
        role: 'platform_admin',
        companyName: 'Swiggy',
      };
    }
    // Backend GET /auth/me returns { user } (unwrapped from envelope by interceptor)
    const res = await apiClient.get<{ user: User }>('/auth/me');
    return res.data.user || (res.data as unknown as User);
  },

  logout: async (): Promise<void> => {
    if (USE_MOCKS) {
      return;
    }
    await apiClient.post('/auth/logout');
  },
};
