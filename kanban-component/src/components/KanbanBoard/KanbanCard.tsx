import React, { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { KanbanTask } from './KanbanBoard.types';
import { Avatar } from '@/components/primitives/Avatar';
import {
  formatDate,
  isOverdue,
  getPriorityBadgeColor,
} from '@/utils/task.utils';

interface KanbanCardProps {
  task: KanbanTask;
  onEdit: (task: KanbanTask) => void;
  onDelete: (taskId: string) => void;
}

/**
 * Individual task card component with drag and drop support
 */
export const KanbanCard: React.FC<KanbanCardProps> = memo(({
  task,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onEdit(task);
    } else if (e.key === 'Delete') {
      e.preventDefault();
      onDelete(task.id);
    }
  };

  const handleClick = () => onEdit(task);
  const isTaskOverdue = task.dueDate ? isOverdue(task.dueDate) : false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={clsx(
        'group relative p-4 mb-2 bg-white rounded-lg shadow-sm border border-gray-200',
        'hover:shadow-md transition-shadow duration-200 cursor-grab',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
        isDragging && 'shadow-lg cursor-grabbing',
        isTaskOverdue && 'border-l-4 border-l-error-500'
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
          {task.title}
        </h4>
        {task.priority && (
          <span
            className={clsx(
              'px-2 py-0.5 text-xs font-medium rounded-full',
              getPriorityBadgeColor(task.priority)
            )}
          >
            {task.priority}
          </span>
        )}
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {(task.tags && task.tags.length > 0) || task.assignee ? (
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
          {task.tags && task.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {task.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {task.tags.length > 3 && (
                <span className="px-2 py-0.5 text-xs text-gray-400">
                  +{task.tags.length - 3}
                </span>
              )}
            </div>
          ) : null}
          {task.assignee && <Avatar name={task.assignee} size="sm" className="ml-auto" />}
        </div>
      ) : null}

      {task.dueDate && (
        <div
          className={clsx(
            'mt-3 pt-2 text-xs flex items-center',
            isTaskOverdue ? 'text-error-600' : 'text-gray-500',
            (task.tags && task.tags.length > 0) || task.assignee ? 'border-t border-gray-100' : ''
          )}
        >
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Due: {formatDate(task.dueDate)}</span>
          {isTaskOverdue && <span className="ml-1">• Overdue</span>}
        </div>
      )}
    </div>
  );
});

KanbanCard.displayName = 'KanbanCard';