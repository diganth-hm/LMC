import { apiClient } from './client';
import { AuthResponse, User } from '../../types';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

export const authService = {
  login: async (email: string, role: 'platform_admin' | 'corporate_buyer'): Promise<AuthResponse> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 400));
      const user: User = {
        id: role === 'platform_admin' ? 'usr-platform-01' : 'usr-buyer-01',
        name: role === 'platform_admin' ? 'Swiggy Ops Admin' : 'Manipal Group ESG Lead',
        email,
        role,
        companyName: role === 'platform_admin' ? 'Swiggy' : 'Manipal Group',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      };
      return { token: 'mock-jwt-token-12345', user };
    }
    const res = await apiClient.post<AuthResponse>('/auth/login', { email, role });
    return res.data;
  },
};
