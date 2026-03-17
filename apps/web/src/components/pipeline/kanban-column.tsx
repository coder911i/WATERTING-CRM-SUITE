'use client';

import { useDroppable } from '@dnd-kit/core';

export default function KanbanColumn({ id, title, children, count, totalBudget }: { id: string; title: string, count: number, totalBudget: number, children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div className="flex flex-col flex-shrink-0 w-80 bg-neutral-50 dark:bg-neutral-900/40 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 space-y-3 transition-colors duration-200">
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 pb-2 mb-2">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 capitalize">{title.toLowerCase().replace('_', ' ')}</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{count} leads</p>
        </div>
        <span className="text-xs font-semibold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">₹{totalBudget?.toLocaleString() || '0'}</span>
      </div>
      <div ref={setNodeRef} className="flex-1 space-y-3 min-h-[500px]">
        {children}
      </div>
    </div>
  );
}
