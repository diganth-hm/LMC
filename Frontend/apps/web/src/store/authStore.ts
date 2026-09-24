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

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

const defaultPlatformUser: User = {
  id: 'usr-platform-01',
  name: 'Swiggy Ops Admin',
  email: 'ops@swiggy.in',
  role: 'platform_admin',
  companyName: 'Swiggy',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
};

// Try to restore session from localStorage
const storedToken = localStorage.getItem('lmc_auth_token');
const storedUserRaw = localStorage.getItem('lmc_auth_user');
let storedUser: User | null = null;
if (storedUserRaw) {
  try {
    storedUser = JSON.parse(storedUserRaw);
  } catch {
    storedUser = null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  // In mock mode, start pre-authenticated; in real mode, require actual login and restore session
  user: USE_MOCKS ? defaultPlatformUser : storedUser,
  token: USE_MOCKS ? 'mock-jwt-token-12345' : storedToken,
  isAuthenticated: USE_MOCKS ? true : Boolean(storedToken),
  login: (user, token) => {
    localStorage.setItem('lmc_auth_token', token);
    localStorage.setItem('lmc_auth_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('lmc_auth_token');
    localStorage.removeItem('lmc_auth_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  switchRole: (role) => {
    if (USE_MOCKS) {
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
    }
  },
}));
