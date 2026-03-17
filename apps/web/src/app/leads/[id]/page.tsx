'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export default function LeadDetailPage() {
  const { id } = useParams();

  const { data: lead } = useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const res = await apiClient.get(`/leads/${id}`);
      return res;
    },
    placeholderData: {
      id,
      name: 'John Doe',
      phone: '+91 9876543210',
      email: 'john@example.com',
      stage: 'CONTACTED',
      budgetMax: 5000000,
      source: 'WEBSITE',
      project: { name: 'Aqua Vista' },
    },
  });

  const { data: activities } = useQuery({
    queryKey: ['lead-activities', id],
    queryFn: async () => {
      const res = await apiClient.get(`/activities?leadId=${id}`);
      return res;
    },
    placeholderData: [
      { id: '1', type: 'SYSTEM', description: 'Lead captured from Website', createdAt: new Date() },
      { id: '2', type: 'CALL', description: 'Initial call made by Agent', createdAt: new Date() },
    ],
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4 border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead?.name}</h1>
            <p className="text-sm text-gray-500">{lead?.phone}</p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800 capitalize">
            {lead?.stage?.toLowerCase().replace('_', ' ') || 'N/A'}
          </span>
        </div>
        
        {lead?.aiScore ? (
          <div className="bg-teal-50 border border-teal-100 p-5 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-teal-800">AI Intent Score</h3>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-extrabold text-teal-900">{lead.aiScore}%</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  lead.aiScoreLabel === 'HOT' ? 'bg-red-100 text-red-800' : 
                  lead.aiScoreLabel === 'WARM' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {lead.aiScoreLabel}
                </span>
              </div>
              <p className="text-xs text-teal-700 mt-1">{lead.aiScoreJustification || 'Calculation complete based on budget and criteria.'}</p>
            </div>
            {lead.aiHandoffRequested && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 animate-pulse shadow-sm border border-red-200">
                Human Handoff Requested
              </span>
            )}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4 h-fit">
            <h2 className="text-lg font-semibold text-gray-800">Profile Details</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-400">Email</label>
                <p className="text-sm text-gray-800">{lead?.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400">Project Preference</label>
                <p className="text-sm text-gray-800">{lead?.project?.name || 'Any'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400">Budget Max</label>
                <p className="text-sm text-gray-800">₹{lead?.budgetMax?.toLocaleString() || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400">Source</label>
                <p className="text-sm text-gray-800 capitalize">{lead?.source?.toLowerCase() || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Activity Timeline</h2>
              <div className="flow-root">
                <ul className="-mb-8">
                  {activities?.map((activity: any, index: number) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {index !== activities.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center ring-8 ring-white">
                              <span className="text-xs text-white font-bold">{activity.type[0]}</span>
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-800">{activity.description}</p>
                            </div>
                            <div className="whitespace-nowrap text-right text-xs text-gray-500">
                              {new Date(activity.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {lead?.aiRecommendations?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">AI Recommendations</h2>
                <div className="space-y-4">
                  {lead.aiRecommendations.map((rec: any) => (
                    <div key={rec.id} className="p-4 bg-teal-50 border border-teal-100 rounded-xl space-y-2">
                       <p className="text-sm font-medium text-teal-900 leading-relaxed">{rec.justification}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
