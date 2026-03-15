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
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <h4 className="text-sm font-semibold text-gray-900">{lead.name}</h4>
      <p className="text-xs text-gray-500 mt-1">{lead.project?.name || 'No Project'}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">₹{lead.budgetMax?.toLocaleString() || 'N/A'}</span>
        <span className="text-xxs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">{lead.source?.toLowerCase()}</span>
      </div>
    </div>
  );
}
