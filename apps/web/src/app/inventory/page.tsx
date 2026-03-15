'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export default function InventoryPage() {
  const { data: units } = useQuery({
    queryKey: ['units'],
    queryFn: async () => {
      const res = await apiClient.get('/inventory');
      return res.data;
    },
    placeholderData: [
      { id: '1', unitNumber: '101', floor: 1, tower: { name: 'Tower A', project: { name: 'Aqua Vista' } }, status: 'AVAILABLE', superArea: 1200, totalPrice: 4500000 },
      { id: '2', unitNumber: '102', floor: 1, tower: { name: 'Tower A', project: { name: 'Aqua Vista' } }, status: 'RESERVED', superArea: 1200, totalPrice: 4700000 },
      { id: '3', unitNumber: '201', floor: 2, tower: { name: 'Tower B', project: { name: 'Skyline' } }, status: 'SOLD', superArea: 1500, totalPrice: 6000000 },
    ],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-500 text-white';
      case 'RESERVED': return 'bg-yellow-500 text-white';
      case 'SOLD': return 'bg-red-500 text-white';
      case 'BOOKED': return 'bg-red-500 text-white';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Explorer</h1>
          <p className="text-sm text-gray-500">View and manage unit availability across projects.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {units?.map((unit: any) => (
            <div key={unit.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className={`px-4 py-2 text-xs font-semibold ${getStatusColor(unit.status)} flex justify-between`}>
                <span>{unit.tower?.name} - {unit.unitNumber}</span>
                <span className="capitalize">{unit.status.toLowerCase().replace('_', ' ')}</span>
              </div>
              <div className="p-4 space-y-2">
                <div>
                  <label className="text-xxs font-medium text-gray-400">Project</label>
                  <p className="text-sm text-gray-800 font-medium">{unit.tower?.project?.name || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xxs font-medium text-gray-400">Floor</label>
                    <p className="text-xs text-gray-800">{unit.floor}</p>
                  </div>
                  <div>
                    <label className="text-xxs font-medium text-gray-400">Area</label>
                    <p className="text-xs text-gray-800">{unit.superArea} sqft</p>
                  </div>
                </div>
                <div className="border-t pt-2 mt-2">
                  <label className="text-xxs font-medium text-gray-400">Total Price</label>
                  <p className="text-sm font-bold text-gray-900">₹{unit.totalPrice?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
