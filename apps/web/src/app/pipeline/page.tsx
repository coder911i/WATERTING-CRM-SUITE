'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import KanbanBoard from '@/components/pipeline/kanban-board';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export default function PipelinePage() {
  const { data: kanbanData, refetch } = useQuery({
    queryKey: ['kanban'],
    queryFn: async () => {
      const res = await apiClient.get('/pipeline');
      return res;
    },
    placeholderData: {
      NEW_LEAD: { count: 1, totalBudget: 5000000, leads: [{ id: '1', name: 'John Doe', project: { name: 'Aqua Vista' }, budgetMax: 5000000, source: 'WEBSITE' }] },
      CONTACTED: { count: 1, totalBudget: 7500000, leads: [{ id: '2', name: 'Jane Smith', project: { name: 'Skyline' }, budgetMax: 7500000, source: 'MANUAL' }] },
      INTERESTED: { count: 0, totalBudget: 0, leads: [] },
      VISIT_SCHEDULED: { count: 0, totalBudget: 0, leads: [] },
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipeline Kanban</h1>
          <p className="text-sm text-gray-500">Drag and drop leads to update their lifecycle stages.</p>
        </div>

        <KanbanBoard initialData={kanbanData} refetch={refetch} />
      </div>
    </DashboardLayout>
  );
}

