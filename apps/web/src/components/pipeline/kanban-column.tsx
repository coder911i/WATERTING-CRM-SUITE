'use client';

import { useDroppable } from '@dnd-kit/core';

export default function KanbanColumn({ id, title, children, count, totalBudget }: { id: string; title: string, count: number, totalBudget: number, children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div className="flex flex-col flex-shrink-0 w-80 bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="flex items-center justify-between border-b pb-2 mb-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 capitalize">{title.toLowerCase().replace('_', ' ')}</h3>
          <p className="text-xxs text-gray-500 mt-0.5">{count} leads</p>
        </div>
        <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">₹{totalBudget?.toLocaleString() || '0'}</span>
      </div>
      <div ref={setNodeRef} className="flex-1 space-y-3 min-h-[500px]">
        {children}
      </div>
    </div>
  );
}
