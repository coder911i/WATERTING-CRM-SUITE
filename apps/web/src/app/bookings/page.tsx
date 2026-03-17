'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export default function BookingsPage() {
  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await apiClient.get('/bookings');
      return res;
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
            <p className="text-sm text-gray-500">Track all unit bookings and installment schedules.</p>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings?.map((booking: any) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.lead?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.unit?.unitNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{booking.tokenAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{booking.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!bookings || bookings.length === 0) && (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500" colSpan={5}>No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

