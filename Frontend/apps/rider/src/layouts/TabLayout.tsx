import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Wallet, History, User } from 'lucide-react';

const tabs = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/wallet', icon: Wallet, label: 'Wallet' },
  { to: '/co2-history', icon: History, label: 'History' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export const TabLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen max-w-[430px] mx-auto bg-[#FBFAF7] shadow-2xl">
      <Outlet />
      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 z-30 safe-area-pb">
        <div className="flex items-center justify-around py-2">
          {tabs.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-md transition-colors ${
                  isActive ? 'text-[#0F6E56]' : 'text-gray-400 hover:text-gray-600'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
