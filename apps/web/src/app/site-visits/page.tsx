'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export default function SiteVisitsPage() {
  const { data: visits } = useQuery({
    queryKey: ['site-visits'],
    queryFn: async () => {
      const res = await apiClient.get('/site-visits');
      return res.data;
    },
    placeholderData: [
      { id: '1', scheduledAt: '2026-12-15T10:00:00Z', notes: 'Interested in level 5', lead: { name: 'John Doe' }, agent: { name: 'Agent Smith' }, outcome: null },
      { id: '2', scheduledAt: '2026-12-18T14:30:00Z', notes: 'First visit, general tour', lead: { name: 'Jane Smith' }, agent: { name: 'Agent Banner' }, outcome: 'INTERESTED' },
    ],
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Visits Listing</h1>
          <p className="text-sm text-gray-500">Track scheduled tours and property viewings outcomes.</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visits?.map((visit: any) => (
                <tr key={visit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(visit.scheduledAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.lead?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.agent?.name || 'Unassigned'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      visit.outcome ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {visit.outcome ? visit.outcome.replace('_', ' ') : 'Scheduled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{visit.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
