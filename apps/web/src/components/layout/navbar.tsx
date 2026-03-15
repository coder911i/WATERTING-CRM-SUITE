'use client';

import { useAuthStore } from '@/store/auth.store';
import { Menu, Bell, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      <div className="flex items-center">
        <button className="text-gray-500 hover:text-gray-600 md:hidden">
          <Menu className="h-6 w-6" />
        </button>
        <div className="ml-4 md:ml-0">
          <h3 className="text-lg font-semibold text-gray-800">Dashboard</h3>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
          <Bell className="h-6 w-6" />
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-white font-medium">
            {user?.name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase().replace('_', ' ') || 'Guest'}</p>
          </div>
        </div>
        <button onClick={logout} className="text-sm font-medium text-red-500 hover:underline">
          Logout
        </button>
      </div>
    </header>
  );
}
