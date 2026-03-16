'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import Link from 'next/link';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Waterting CRM</h1>
          <p className="mt-2 text-gray-600">The AI-Powered Real Estate CRM & Automation Suite. Get started by selecting a workspace module below.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {/* Card: Workspace */}
          <Link href="/dashboard" className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
            <div className="h-10 w-10 bg-teal-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors">
              <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-600">Workspace Dashboard</h3>
            <p className="text-sm text-gray-500 mt-1">Overview of sales stats, data visualization and inventory tracking.</p>
          </Link>
          
          {/* Card: Leads */}
          <Link href="/leads" className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
            <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
              <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600">Manage Leads</h3>
            <p className="text-sm text-gray-500 mt-1">Nurture and track client data accompanied with AI scoring insights.</p>
          </Link>

          {/* Card: Pipeline */}
          <Link href="/pipeline" className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
            <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm9 0v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">Pipeline Kanban</h3>
            <p className="text-sm text-gray-500 mt-1">Drag and drop leads through visual sales stages for fast workflows.</p>
          </Link>

          {/* Card: AI Assistant */}
          <Link href="/ai" className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
            <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600">AI Assistant Cores</h3>
            <p className="text-sm text-gray-500 mt-1">Discover, score, and recommend properties with advanced LLMs.</p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
