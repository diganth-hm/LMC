import { create } from 'zustand';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const defaultPlatformUser: User = {
  id: 'usr-platform-01',
  name: 'Swiggy Ops Admin',
  email: 'ops@swiggy.in',
  role: 'platform_admin',
  companyName: 'Swiggy',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
};

export const useAuthStore = create<AuthState>((set) => ({
  user: defaultPlatformUser,
  token: 'mock-jwt-token-12345',
  isAuthenticated: true,
  login: (user, token) => {
    localStorage.setItem('lmc_auth_token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('lmc_auth_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  switchRole: (role) => {
    const newUser: User = role === 'platform_admin'
      ? defaultPlatformUser
      : {
          id: 'usr-buyer-01',
          name: 'Manipal Group ESG Lead',
          email: 'esg-procurement@manipal.edu',
          role: 'corporate_buyer',
          companyName: 'Manipal Group ESG Solutions',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        };
    set({ user: newUser });
  },
}));
