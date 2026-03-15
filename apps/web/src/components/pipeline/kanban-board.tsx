'use client';

import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import KanbanColumn from './kanban-column';
import KanbanItem from './kanban-item';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

export default function KanbanBoard({ initialData = {}, refetch }: { initialData: any; refetch: () => void }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const leadId = active.id as string;
    const newStage = over.id as string;

    try {
      await apiClient.patch(`/pipeline/${leadId}/move`, { stage: newStage });
      refetch();
    } catch (e) {
      console.error(e);
      alert('Failed to move lead');
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex space-x-4 overflow-x-auto pb-6">
        {Object.entries(data || {}).map(([stage, stageData]: any) => (
          <KanbanColumn
            key={stage}
            id={stage}
            title={stage}
            count={stageData.count ?? 0}
            totalBudget={stageData.totalBudget ?? 0}
          >
            {stageData.leads?.map((lead: any) => (
              <KanbanItem key={lead.id} id={lead.id} lead={lead} />
            ))}
          </KanbanColumn>
        ))}
      </div>
    </DndContext>
  );
}
