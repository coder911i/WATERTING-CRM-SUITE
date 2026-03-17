'use client';

import { useDraggable } from '@dnd-kit/core';

export default function KanbanItem({ id, lead }: { id: string; lead: any }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-neutral-0 dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 cursor-grab active:cursor-grabbing hover:shadow-md hover:-translate-y-0.5 transform transition-all duration-150 text-neutral-900 dark:text-neutral-100"
    >
      <h4 className="text-sm font-semibold">{lead.name}</h4>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{lead.project?.name || 'No Project'}</p>
      <div className="mt-4 flex items-center justify-between gap-1">
        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">₹{lead.budgetMax?.toLocaleString() || 'N/A'}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 capitalize">{lead.source?.toLowerCase() || 'other'}</span>
      </div>
    </div>
  );
}
