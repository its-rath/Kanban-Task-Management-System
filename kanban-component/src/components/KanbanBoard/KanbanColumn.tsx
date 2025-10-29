import React, { memo, useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import clsx from 'clsx';
import { KanbanColumn as KanbanColumnType, KanbanTask } from './KanbanBoard.types';
import { KanbanCard } from './KanbanCard';
import { Button } from '@/components/primitives/Button';

interface KanbanColumnProps {
  column: KanbanColumnType;
  tasks: KanbanTask[];
  onTaskCreate: () => void;
  onTaskEdit: (task: KanbanTask) => void;
  onTaskDelete: (taskId: string) => void;
}

/**
 * Column component containing sortable tasks with drag and drop support
 */
export const KanbanColumn: React.FC<KanbanColumnProps> = memo(({
  column,
  tasks,
  onTaskCreate,
  onTaskEdit,
  onTaskDelete,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const taskIds = useMemo(() => column.taskIds, [column.taskIds]);
  const isNearLimit = column.maxTasks && tasks.length >= column.maxTasks * 0.8;
  const isAtLimit = column.maxTasks !== undefined && tasks.length >= column.maxTasks;
  const taskCount = tasks.length;

  return (
    <div 
      ref={setNodeRef}
      className={clsx(
        'flex flex-col h-full min-w-[280px] max-w-[320px] bg-gray-50 rounded-lg',
        'border border-gray-200 overflow-hidden',
        isOver && 'ring-2 ring-primary-500 ring-offset-2',
        column.color ? `border-t-4 border-t-${column.color}-500` : ''
      )}
    >
      {/* Column Header */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className={clsx(
              'w-3 h-3 rounded-full',
              column.color ? `bg-${column.color}-500` : 'bg-gray-300'
            )} />
            <span>{column.title}</span>
          </h3>
          <span className="text-sm text-gray-500 bg-white px-2 py-0.5 rounded-full">
            {taskCount}
            {column.maxTasks && ` / ${column.maxTasks}`}
          </span>
        </div>
        
        {isNearLimit && (
          <div className={clsx(
            'text-xs font-medium px-2 py-1 rounded-md mb-1',
            isAtLimit 
              ? 'bg-error-100 text-error-700' 
              : 'bg-warning-100 text-warning-700'
          )}>
            {isAtLimit ? 'WIP limit reached' : 'Approaching WIP limit'}
          </div>
        )}
      </div>

      {/* Task List */}
      <div 
        className={clsx(
          'flex-1 p-2 overflow-y-auto',
          isOver && 'bg-gray-100/50 transition-colors',
          taskCount === 0 && 'flex items-center justify-center min-h-[100px]'
        )}
      >
        {taskCount === 0 ? (
          <div className="text-center p-4 text-gray-400 text-sm">
            <p>No tasks yet</p>
            <p className="text-xs mt-1">Drag tasks here or click below</p>
          </div>
        ) : (
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {tasks.map(task => (
                <KanbanCard
                  key={task.id}
                  task={task}
                  onEdit={onTaskEdit}
                  onDelete={onTaskDelete}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>

      {/* Add Task Button */}
      <div className="p-2 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={onTaskCreate}
          className="w-full justify-start text-gray-500 hover:text-gray-700"
          disabled={isAtLimit}
          aria-label={`Add task to ${column.title}`}
        >
          <span className="text-lg mr-1">+</span> Add Task
        </Button>
      </div>
    </div>
  );
});

KanbanColumn.displayName = 'KanbanColumn';