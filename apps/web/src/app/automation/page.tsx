'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useState } from 'react';

export default function AutomationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('LEAD_CREATED');
  const [action, setAction] = useState('SEND_WHATSAPP');
  const [template, setTemplate] = useState('NEW_LEAD_WELCOME');

  const { data: automations, refetch } = useQuery({
    queryKey: ['automations'],
    queryFn: async () => {
      const res = await apiClient.get('/automations');
      return res;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => apiClient.post('/automations', data),
    onSuccess: () => {
      refetch();
      setIsModalOpen(false);
    },
  });

  const handleCreate = () => {
    createMutation.mutate({
      name,
      trigger: { event: trigger },
      conditions: [],
      actions: [{ type: action, payload: { template } }],
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workflow Automation</h1>
            <p className="text-sm text-gray-500">Create triggers and actions for business processes.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700"
          >
            Create Rule
          </button>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trigger</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Runs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {automations?.map((aut: any) => (
                <tr key={aut.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{aut.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(aut.trigger as any)?.event}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{aut.runCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${aut.isEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {aut.isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                </tr>
              ))}
              {(!automations || automations.length === 0) && (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500" colSpan={4}>No rules found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold">Create Automation Rule</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rule Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm" placeholder="e.g., Welcome Facebook Leads" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">When Event Triggers</label>
              <select value={trigger} onChange={(e) => setTrigger(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                <option value="LEAD_CREATED">Lead Created</option>
                <option value="STAGE_CHANGED">Stage Changed</option>
                <option value="PAYMENT_RECEIVED">Payment Received</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Then Execute Action</label>
              <select value={action} onChange={(e) => setAction(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                <option value="SEND_WHATSAPP">Send WhatsApp Template</option>
                <option value="UPDATE_STAGE">Update Pipeline Stage</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md text-sm text-gray-600">Cancel</button>
              <button onClick={handleCreate} className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium">Save</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

