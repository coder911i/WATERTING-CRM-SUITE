'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export default function BrokersPage() {
  const { data: brokers, refetch } = useQuery({
    queryKey: ['brokers'],
    queryFn: async () => {
      const res = await apiClient.get('/brokers');
      return res;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => apiClient.patch(`/brokers/${id}/approve`),
    onSuccess: () => refetch(),
  });

  const deactivateMutation = useMutation({
    mutationFn: async (id: string) => apiClient.patch(`/brokers/${id}/deactivate`),
    onSuccess: () => refetch(),
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Brokers Management</h1>
            <p className="text-sm text-gray-500">Approve and manage Channel Partners and Brokers.</p>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leads</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {brokers?.map((broker: any) => (
                <tr key={broker.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {broker.name} {broker.firmName ? `(${broker.firmName})` : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{broker.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{broker._count?.leads || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {broker.isApproved ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                    {!broker.isApproved && (
                      <button 
                        onClick={() => approveMutation.mutate(broker.id)}
                        className="text-teal-600 hover:text-teal-900 font-medium"
                      >
                        Approve
                      </button>
                    )}
                    {broker.isActive ? (
                      <button 
                        onClick={() => deactivateMutation.mutate(broker.id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <span className="text-gray-400">Deactivated</span>
                    )}
                  </td>
                </tr>
              ))}
              {(!brokers || brokers.length === 0) && (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500" colSpan={5}>No brokers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

