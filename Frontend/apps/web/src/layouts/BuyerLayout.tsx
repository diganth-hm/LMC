import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Award, Settings, Menu, X, LogOut, ChevronRight, BarChart3 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const navItems = [
  { to: '/buyer', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/buyer/inventory', icon: Package, label: 'Credit Inventory' },
  { to: '/buyer/history', icon: ShoppingCart, label: 'Purchase History' },
  { to: '/buyer/impact', icon: BarChart3, label: 'Impact Summary' },
  { to: '/buyer/settings', icon: Settings, label: 'Settings' },
];

export const BuyerLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, switchRole } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-[#b84b26] ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center shrink-0">
          <Award className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-white whitespace-nowrap">LastMile Carbon</h1>
            <p className="text-[10px] text-white/60 whitespace-nowrap">Buyer Portal</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            <item.icon className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[#b84b26] px-3 py-4 space-y-2">
        {!collapsed && (
          <button
            onClick={() => { switchRole('platform_admin'); navigate('/platform'); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Switch to Platform</span>
          </button>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 w-full px-3 py-2 text-xs text-white/60 hover:text-red-300 hover:bg-white/10 rounded-md transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden">
      <aside className={`hidden lg:flex flex-col bg-[#D85A30] transition-all duration-300 shrink-0 ${collapsed ? 'w-[68px]' : 'w-[240px]'}`}>
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-[#D85A30] z-50 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => { if (window.innerWidth < 1024) setMobileOpen(!mobileOpen); else setCollapsed(!collapsed); }} className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
              {mobileOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 hidden sm:block">{user.companyName || user.name}</span>
                <div className="w-8 h-8 rounded-full bg-[#D85A30] text-white text-xs font-bold flex items-center justify-center">
                  {(user.companyName || user.name)?.charAt(0)}
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
