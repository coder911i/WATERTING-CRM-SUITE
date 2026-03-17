'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export default function AnalyticsPage() {
  const { data: brokerStats } = useQuery({
    queryKey: ['analytics-brokers'],
    queryFn: async () => {
      const res = await apiClient.get('/analytics/brokers');
      return res;
    },
  });

  const { data: projectSales } = useQuery({
    queryKey: ['analytics-projects'],
    queryFn: async () => {
      const res = await apiClient.get('/analytics/projects');
      return res;
    },
  });

  const { data: forecast } = useQuery({
    queryKey: ['analytics-forecast'],
    queryFn: async () => {
      const res = await apiClient.get('/analytics/forecast');
      return res;
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-sm text-gray-500">Business performance metrics and forecasts.</p>
        </div>

        {/* Forecast Card */}
        <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">30-Day Cashflow Forecast</p>
            <h2 className="text-3xl font-bold">₹{forecast?.forecastAmount?.toLocaleString() || 0}</h2>
          </div>
          <div className="bg-slate-800 px-4 py-2 rounded-lg text-sm">
            {forecast?.count || 0} pending payments
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Broker Performance */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-gray-900">Broker Performance</h3>
            <div className="space-y-3">
              {brokerStats?.map((b: any) => (
                <div key={b.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-800">{b.name}</p>
                    <p className="text-xs text-gray-500">{b.leadsCount} leads brought</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{b.totalCommission?.toLocaleString()}</p>
                    <p className="text-xs text-green-600">₹{b.paidCommission?.toLocaleString()} paid</p>
                  </div>
                </div>
              ))}
              {(!brokerStats || brokerStats.length === 0) && <p className="text-center text-gray-500 text-sm">No broker data</p>}
            </div>
          </div>

          {/* Project Sales */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-gray-900">Project Sales</h3>
            <div className="space-y-3">
              {projectSales?.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.bookingsCount} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-teal-600">₹{p.totalSales?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {(!projectSales || projectSales.length === 0) && <p className="text-center text-gray-500 text-sm">No sales data</p>}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

