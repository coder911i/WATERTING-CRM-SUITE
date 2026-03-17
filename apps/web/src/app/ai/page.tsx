'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export default function AiDashboardPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'insights'>('analytics');
  const [question, setQuestion] = useState('');
  const [analyticsAnswer, setAnalyticsAnswer] = useState('');

  // Fetch Insights triggers node thresholds
  const { data: insights } = useQuery({
    queryKey: ['ai-insights'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/ai/insights'); 
      return res;
    },
    placeholderData: [
      { id: '1', type: 'DAILY', title: 'Daily Performance Summary', body: '3 new leads created, 0 bookings yesterday.', createdAt: new Date() },
      { id: '2', type: 'WEEKLY', title: 'Weekly Performance Summary', body: 'Total revenue ₹12,50,000 top project Aqua Vista.', createdAt: new Date() },
    ],
  });

  const analyticsMutation = useMutation({
    mutationFn: async (q: string) => {
      const res = await apiClient.post<any>('/ai/analytics/query', { question: q });
      return res;
    },
    onSuccess: (data) => {
      setAnalyticsAnswer(data.answer);
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Control Center</h1>
          <p className="text-sm text-gray-500">Manage and monitor continuous autonomous operations dashboards.</p>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`${activeTab === 'analytics' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Analytics Assistant
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`${activeTab === 'insights' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Periodic Insights Log
            </button>
          </nav>
        </div>

        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Ask Database Assistant</h2>
              <p className="text-xs text-gray-400 mt-1">Queries are interpreted by AI and run securely reads triggers layouts.</p>
              
              <div className="mt-4 flex space-x-3">
                <input 
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., Which project has the most site visits this month?"
                  className="flex-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2"
                />
                <button
                  onClick={() => analyticsMutation.mutate(question)}
                  disabled={analyticsMutation.isPending || !question}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
                >
                  {analyticsMutation.isPending ? 'Asking...' : 'Ask'}
                </button>
              </div>

              {analyticsAnswer && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-400 font-medium">ANSWER</p>
                  <p className="text-sm text-gray-800 mt-1 leading-relaxed whitespace-pre-wrap">{analyticsAnswer}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-4">
            {insights?.map((insight: any) => (
              <div key={insight.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                    insight.type === 'DAILY' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {insight.type}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(insight.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-md font-bold text-gray-900">{insight.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{insight.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
