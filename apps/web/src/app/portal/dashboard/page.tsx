'use client';

import { useQuery } from '@tanstack/react-query';
import portalApiClient from '@/lib/portal-api-client';
import { useRouter } from 'next/navigation';

export default function PortalDashboard() {
  const router = useRouter();

  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['portal-dashboard'],
    queryFn: async () => {
      const res = await portalApiClient.get('/portal/dashboard');
      return res.data;
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('client_accessToken');
    router.push('/portal/login');
  };

  if (isLoading) return <p className="text-center p-8">Loading dashboard...</p>;
  if (error) return <p className="text-center p-8 text-red-500">Failed to load dashboard. Please log in again.</p>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome, {dashboard?.lead?.name}</h1>
            <p className="text-sm text-slate-500">Track your unit booking and payment timeline.</p>
          </div>
          <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">Logout</button>
        </div>

        {/* Booking Card */}
        {dashboard?.booking ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Booking Summary</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Unit ID</p>
                <p className="font-semibold text-slate-800">{dashboard.booking.unitId}</p>
              </div>
              <div>
                <p className="text-slate-500">Total Amount</p>
                <p className="font-semibold text-slate-800">₹{dashboard.booking.totalAmount?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-500">Token Amount Paid</p>
                <p className="font-semibold text-slate-800">₹{dashboard.booking.tokenAmount?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {dashboard.booking.status}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl text-sm">
            No booking confirmed yet. Please contact your sales officer.
          </div>
        )}

        {/* Payment Timeline */}
        {dashboard?.payments?.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Payment Timeline</h2>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {dashboard.payments.map((p: any) => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{new Date(p.dueDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-semibold">₹{p.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {p.status === 'PENDING' && (
                          <button 
                            className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-3 py-1.5 rounded-md font-medium"
                            onClick={() => alert('Pay trigger integration with Razorpay script load layout thresholds triggers.')}
                          >
                            Pay Now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
