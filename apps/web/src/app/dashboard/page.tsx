'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  siteVisits: number;
  inventory: {
    available: number;
    reserved: number;
    sold: number;
  };
}

const COLORS = ['#0D9488', '#F59E0B', '#EF4444', '#3B82F6'];

export default function DashboardPage() {
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await apiClient.get('/analytics/dashboard');
      return res.data;
    },
    placeholderData: {
      totalLeads: 124,
      newLeads: 12,
      siteVisits: 45,
      inventory: { available: 85, reserved: 15, sold: 120 },
    },
  });

  const { data: leadsByStatus } = useQuery<Record<string, number>>({
    queryKey: ['leads-by-status'],
    queryFn: async () => {
      const res = await apiClient.get('/analytics/leads-by-status');
      return res.data;
    },
    placeholderData: {
      NEW_LEAD: 12,
      CONTACTED: 24,
      INTERESTED: 32,
      VISIT_SCHEDULED: 15,
      VISIT_DONE: 20,
      NEGOTIATION: 10,
      BOOKING_DONE: 8,
      LOST: 5,
    },
  });

  const pieData = leadsByStatus ? Object.entries(leadsByStatus).map(([name, value]) => ({
    name: name.replace('_', ' '),
    value,
  })) : [];

  const inventoryData = [
    { name: 'Available', value: stats?.inventory.available || 0 },
    { name: 'Reserved', value: stats?.inventory.reserved || 0 },
    { name: 'Sold/Booked', value: stats?.inventory.sold || 0 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workspace Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of your sales and inventory statistics.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Total Leads</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats?.totalLeads ?? 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">New Leads</h3>
            <p className="mt-2 text-3xl font-semibold text-teal-600">{stats?.newLeads ?? 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Site Visits</h3>
            <p className="mt-2 text-3xl font-semibold text-purple-600">{stats?.siteVisits ?? 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Available Units</h3>
            <p className="mt-2 text-3xl font-semibold text-blue-600">{stats?.inventory.available ?? 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-md font-semibold text-gray-800 mb-4">Leads by Pipeline Stage</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pieData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0D9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-md font-semibold text-gray-800 mb-4">Inventory Breakdown</h3>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie data={inventoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {inventoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="ml-4 space-y-2">
                {inventoryData.map((item, index) => (
                  <div key={item.name} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-xs text-gray-600">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

