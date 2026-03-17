'use client';

import { useAuthStore } from '@/store/auth.store';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="flex h-[60px] items-center justify-between border-b border-neutral-200 dark:border-neutral-700 bg-neutral-0 dark:bg-neutral-800 px-6 sticky top-0 z-30 shadow-sm transition-colors duration-200">
      <div className="flex items-center">
        <button className="text-neutral-500 hover:text-neutral-600 md:hidden p-1 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700">
          <Menu className="h-6 w-6" />
        </button>
        <div className="ml-4 md:ml-0">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Dashboard</h3>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        <button className="relative rounded-full p-2 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-neutral-700 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-error" />
        </button>
        
        <div className="flex items-center space-x-3 border-l border-neutral-200 dark:border-neutral-700 pl-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-700 text-white font-semibold text-sm">
            {user?.name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{user?.name || 'User'}</p>
            <p className="text-xs text-neutral-500 capitalize">{user?.role?.toLowerCase().replace('_', ' ') || 'Guest'}</p>
          </div>
        </div>
        <button 
          onClick={logout} 
          className="p-2 text-neutral-500 hover:text-error hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
