'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { useAuthStore } from '@/store/auth.store';

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-sm text-gray-500">Manage your profile and workspace preferences.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Full Name</label>
              <p className="mt-1 text-sm text-gray-900 font-medium">{user?.name || 'User'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Email Address</label>
              <p className="mt-1 text-sm text-gray-900">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Role</label>
              <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 capitalize">
                {user?.role?.toLowerCase().replace('_', ' ') || 'Guest'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
