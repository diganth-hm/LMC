import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Leaf, Trophy, Truck, Receipt, FileText, Menu, X, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const navItems = [
  { to: '/platform', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/platform/fleet-analytics', icon: Users, label: 'Fleet Analytics' },
  { to: '/platform/emissions', icon: Leaf, label: 'Emissions' },
  { to: '/platform/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { to: '/platform/delivery-analytics', icon: Truck, label: 'Delivery Analytics' },
  { to: '/platform/billing', icon: Receipt, label: 'Billing' },
  { to: '/platform/reports', icon: FileText, label: 'Reports' },
];

export const PlatformLayout: React.FC = () => {
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
      {/* Logo area */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-md bg-brand-teal flex items-center justify-center shrink-0 shadow-card">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-white whitespace-nowrap tracking-tight">LastMile Carbon</h1>
            <p className="text-[10px] text-white/50 whitespace-nowrap">Platform Dashboard</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto" aria-label="Platform navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span aria-hidden="true" className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-emerald-400" />}
                <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-emerald-400' : ''}`} />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/10 px-3 py-4 space-y-1">
        {!collapsed && (
          <button
            onClick={() => { switchRole('corporate_buyer'); navigate('/buyer'); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Switch to Buyer Portal</span>
          </button>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 w-full px-3 py-2 text-xs text-white/60 hover:text-red-300 hover:bg-white/5 rounded-md transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden">
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col bg-brand-charcoal transition-all duration-300 shrink-0 ${collapsed ? 'w-[68px]' : 'w-[240px]'}`}>
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-brand-charcoal z-50 shadow-pop animate-slide-in-left">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="h-14 bg-white/80 backdrop-blur border-b border-gray-200/80 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { if (window.innerWidth < 1024) setMobileOpen(!mobileOpen); else setCollapsed(!collapsed); }}
              aria-label="Toggle navigation"
              aria-expanded={window.innerWidth < 1024 ? mobileOpen : !collapsed}
              className="p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2.5">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-gray-800 leading-tight">{user.name}</p>
                  <p className="text-[10px] text-gray-400 leading-tight">Platform Admin</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-brand-charcoal text-white text-xs font-bold flex items-center justify-center ring-2 ring-brand-teal/30">
                  {user.name?.charAt(0)}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-6 lg:py-8 animate-fade-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
