import { format, isPast } from 'date-fns';
import { TaskPriority } from '@/components/KanbanBoard/KanbanBoard.types';

/**
 * Checks if a task is overdue
 */
export const isOverdue = (dueDate: Date): boolean => {
  return isPast(dueDate) && format(dueDate, 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd');
};

/**
 * Formats a date for display
 */
export const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};

/**
 * Gets initials from a name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Calculates priority color classes
 */
export const getPriorityColor = (priority: TaskPriority): string => {
  const colors: Record<TaskPriority, string> = {
    low: 'bg-blue-100 text-blue-700 border-l-4 border-blue-500',
    medium: 'bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500',
    high: 'bg-orange-100 text-orange-700 border-l-4 border-orange-500',
    urgent: 'bg-red-100 text-red-700 border-l-4 border-red-500',
  };
  return colors[priority];
};

/**
 * Gets priority badge color
 */
export const getPriorityBadgeColor = (priority: TaskPriority): string => {
  const colors: Record<TaskPriority, string> = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };
  return colors[priority];
};

/**
 * Generates a unique ID
 */
export const generateId = (): string => {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};