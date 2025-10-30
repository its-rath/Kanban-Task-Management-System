import React, { useState, useCallback } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { KanbanViewProps, KanbanTask } from './KanbanBoard.types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { TaskModal } from './TaskModal';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

/**
 * Main Kanban Board component
 */
export function KanbanBoard({
  columns,
  tasks,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}: KanbanViewProps): React.ReactNode {
  const dragAndDrop = useDragAndDrop();
  const {
    dragState,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd: handleDragEndInternal,
    collisionDetection,
  } = dragAndDrop;

  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // Track which column we're creating a new task in
  const [creatingInColumn, setCreatingInColumn] = useState<string | null>(null);

  const handleDragEnd = useCallback(
    (event: any) => {
      const { active, over } = event;
      handleDragEndInternal();
      if (!over) return;
      
      const activeTask = tasks[active.id];
      if (!activeTask) return;
      
      const sourceColumn = columns.find(col => col.taskIds.includes(active.id));
      const destColumn = columns.find(col => col.id === over.id || col.taskIds.includes(over.id));
      
      if (!sourceColumn || !destColumn) return;
      
      let destIndex: number;
      
      if (over.id === destColumn.id) {
        destIndex = destColumn.taskIds.length;
      } else {
        destIndex = destColumn.taskIds.indexOf(over.id);
      }
      
      onTaskMove(active.id, sourceColumn.id, destColumn.id, destIndex);
    },
    [columns, tasks, onTaskMove, handleDragEndInternal]
  );

  const handleTaskEdit = useCallback((task: KanbanTask) => {
    setSelectedTask(task);
    setModalOpen(true);
  }, []);

  const handleCreateClick = useCallback((columnId: string) => {
    setCreatingInColumn(columnId);
    setSelectedTask({
      id: 'new',
      title: '',
      description: '',
      status: columnId,
      createdAt: new Date(),
    });
    setModalOpen(true);
  }, []);

  const handleTaskCreate = useCallback((task: KanbanTask) => {
    const { id: _, ...newTask } = task; // Remove the temporary 'new' id
    onTaskCreate(task.status, newTask as Omit<KanbanTask, 'id'>);
    setModalOpen(false);
    setSelectedTask(null);
    setCreatingInColumn(null);
  }, [onTaskCreate]);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setSelectedTask(null);
    setCreatingInColumn(null);
  }, []);

  const activeTask = dragState.activeId ? tasks[dragState.activeId] : null;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 p-4 overflow-x-auto">
          {columns.map(column => {
            const columnTasks = column.taskIds
              .map(taskId => tasks[taskId])
              .filter(Boolean);
              
            return (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={columnTasks}
                onTaskCreate={() => handleCreateClick(column.id)}
                onTaskEdit={handleTaskEdit}
                onTaskDelete={onTaskDelete}
              />
            );
          })}
        </div>
        
        <DragOverlay>
          {activeTask && (
            <div className="w-64">
              <KanbanCard
                task={activeTask}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
      
      <TaskModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        task={selectedTask}
        onSave={(taskId: string, updates: Partial<KanbanTask>) => {
          if (selectedTask?.id === 'new' && creatingInColumn) {
            handleTaskCreate({
              ...updates,
              id: 'new',
              status: creatingInColumn,
              createdAt: new Date(),
            } as KanbanTask);
          } else if (taskId !== 'new') {
            onTaskUpdate(taskId, updates as Partial<KanbanTask>);
          }
        }}
        onDelete={onTaskDelete}
        columns={columns}
      />
    </>
  );
};