/**
 * Priority levels for tasks
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Represents a single task in the Kanban board
 */
export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: TaskPriority;
  assignee?: string;
  tags?: string[];
  createdAt: Date;
  dueDate?: Date;
}

/**
 * Represents a column in the Kanban board
 */
export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  taskIds: string[];
  maxTasks?: number;
}

/**
 * Props for the KanbanBoard component
 */
export interface KanbanViewProps {
  columns: KanbanColumn[];
  tasks: Record<string, KanbanTask>;
  onTaskMove: (
    taskId: string,
    fromColumn: string,
    toColumn: string,
    newIndex: number
  ) => void;
  onTaskCreate: (columnId: string, task: Omit<KanbanTask, 'id'>) => void;
  onTaskUpdate: (taskId: string, updates: Partial<KanbanTask>) => void;
  onTaskDelete: (taskId: string) => void;
}

/**
 * Props for individual task cards
 */
export interface KanbanCardProps {
  task: KanbanTask;
  isDragging?: boolean;
  onEdit: (task: KanbanTask) => void;
  onDelete: (taskId: string) => void;
}

/**
 * Props for column components
 */
export interface KanbanColumnProps {
  column: KanbanColumn;
  tasks: KanbanTask[];
  onTaskCreate: () => void;
  onTaskEdit: (task: KanbanTask) => void;
  onTaskDelete: (taskId: string) => void;
}