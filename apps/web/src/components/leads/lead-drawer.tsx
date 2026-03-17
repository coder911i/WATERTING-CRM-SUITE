'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import apiClient from '@/lib/api-client';

const leadSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  phone: z.string().min(10, 'Invalid phone number'),
  email: z.string().email().optional().or(z.literal('')),
  budgetMax: z.coerce.number().min(0, 'Budget must be positive'),
  source: z.string(),
});


type LeadFormValues = z.infer<typeof leadSchema>;

export default function LeadDrawer({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      source: 'MANUAL',
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await apiClient.post('/leads', {
        ...data,
        phone: data.phone.trim().replace(/[\s\-().]/g, ''),
        email: data.email || undefined,
      });
      onSuccess();
      reset();
      onClose();
    } catch (e) {
      console.error(e);
      alert('Failed to create lead. Make sure backend is running or input is accurate.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-500 bg-opacity-75 flex justify-end">
      <div className="w-full max-w-md bg-white shadow-xl flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Add New Lead</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input {...register('name')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 bg-gray-50" />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input {...register('phone')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 bg-gray-50" />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
            <input {...register('email')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 bg-gray-50" />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Budget Max (₹)</label>
            <input type="number" {...register('budgetMax')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 bg-gray-50" />
            {errors.budgetMax && <p className="mt-1 text-xs text-red-500">{errors.budgetMax.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Source</label>
            <select {...register('source')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 bg-gray-50">
              <option value="MANUAL">Manual</option>
              <option value="WEBSITE">Website</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="GOOGLE">Google</option>
            </select>
            {errors.source && <p className="mt-1 text-xs text-red-500">{errors.source.message}</p>}
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
