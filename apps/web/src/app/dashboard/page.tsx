'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Card, KpiCard } from '@/components/Card';
import { Users, UserPlus, Calendar, Home } from 'lucide-react';

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

const COLORS = ['#1B60E0', '#FF9F40', '#4BC0C0', '#F59E0B'];

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
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">Workspace Overview</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Status dashboard for sales metrics and inventory analytics.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard 
            title="Total Leads" 
            value={stats?.totalLeads ?? 0} 
            icon={<Users className="h-5 w-5" />}
            trend={{ value: "+12% from last week", type: "up" }}
          />
          <KpiCard 
            title="New Leads" 
            value={stats?.newLeads ?? 0} 
            icon={<UserPlus className="h-5 w-5" />}
            trend={{ value: "12 Today", type: "neutral" }}
          />
          <KpiCard 
            title="Site Visits" 
            value={stats?.siteVisits ?? 0} 
            icon={<Calendar className="h-5 w-5" />}
            trend={{ value: "-4% from yesterday", type: "down" }}
          />
          <KpiCard 
            title="Available Units" 
            value={stats?.inventory.available ?? 0} 
            icon={<Home className="h-5 w-5" />}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card title="Leads by Pipeline Stage">
            <div className="h-64 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pieData} barSize={32}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} 
                    labelStyle={{ fontWeight: '600', color: '#111827' }}
                  />
                  <Bar dataKey="value" fill="#1B60E0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Inventory Breakdown">
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie data={inventoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
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
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">{item.name}: <span className="font-semibold text-neutral-900 dark:text-neutral-100">{item.value}</span></span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
