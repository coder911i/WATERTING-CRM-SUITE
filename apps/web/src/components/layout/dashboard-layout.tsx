'use client';

import Sidebar from './sidebar';
import Navbar from './navbar';
import { AuthGuard } from '@/components/auth-guard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-200">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 bg-neutral-50 dark:bg-neutral-900">
          {children}
        </main>
      </div>
    </div>
    </AuthGuard>
  );
}
