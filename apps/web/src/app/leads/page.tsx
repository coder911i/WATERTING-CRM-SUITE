'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { useState } from 'react';
import LeadDrawer from '@/components/leads/lead-drawer';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import Link from 'next/link';

export default function LeadsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: leads, refetch } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const res = await apiClient.get('/leads');
      return res;
    },
    placeholderData: [
      { id: '1', name: 'John Doe', stage: 'NEW_LEAD', budgetMax: 5000000, source: 'WEBSITE', project: { name: 'Aqua Vista' } },
      { id: '2', name: 'Jane Smith', stage: 'CONTACTED', budgetMax: 7500000, source: 'MANUAL', project: { name: 'Skyline' } },
    ],
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
            <p className="text-sm text-gray-500">Track and manage your sales pipeline leads.</p>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
          >
            Add Lead
          </button>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads?.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link href={`/leads/${lead.id}`} className="hover:underline text-teal-600">
                      {lead.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.project?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 capitalize">
                      {lead.stage.toLowerCase().replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {lead.aiScore ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        lead.aiScoreLabel === 'HOT' ? 'bg-red-100 text-red-800' : 
                        lead.aiScoreLabel === 'WARM' ? 'bg-orange-100 text-orange-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {lead.aiScore}% {lead.aiScoreLabel}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{lead.budgetMax?.toLocaleString() || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{lead.source.toLowerCase()}</td>
                </tr>
              ))}
              {(!leads || leads.length === 0) && (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500" colSpan={6}>No leads found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <LeadDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} onSuccess={refetch} />
    </DashboardLayout>
  );
}


