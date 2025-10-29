import { useState, useCallback } from 'react';
import { KanbanColumn, KanbanTask } from '@/components/KanbanBoard/KanbanBoard.types';
import { reorderTasks, moveTaskBetweenColumns } from '@/utils/column.utils';
import { generateId } from '@/utils/task.utils';

interface UseKanbanBoardProps {
  initialColumns: KanbanColumn[];
  initialTasks: Record<string, KanbanTask>;
}

/**
 * Custom hook for managing Kanban board state
 */
export const useKanbanBoard = ({ initialColumns, initialTasks }: UseKanbanBoardProps) => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [tasks, setTasks] = useState<Record<string, KanbanTask>>(initialTasks);

  const handleTaskMove = useCallback(
    (taskId: string, fromColumnId: string, toColumnId: string, newIndex: number) => {
      setColumns(prevColumns => {
        const newColumns = [...prevColumns];
        const fromColumn = newColumns.find(col => col.id === fromColumnId);
        const toColumn = newColumns.find(col => col.id === toColumnId);
        
        if (!fromColumn || !toColumn) return prevColumns;
        
        const fromIndex = fromColumn.taskIds.indexOf(taskId);
        
        if (fromColumnId === toColumnId) {
          // Reorder within same column
          fromColumn.taskIds = reorderTasks(fromColumn.taskIds, fromIndex, newIndex);
        } else {
          // Move between columns
          const { source, destination } = moveTaskBetweenColumns(
            fromColumn.taskIds,
            toColumn.taskIds,
            fromIndex,
            newIndex
          );
          fromColumn.taskIds = source;
          toColumn.taskIds = destination;
          
          // Update task status
          setTasks(prevTasks => ({
            ...prevTasks,
            [taskId]: {
              ...prevTasks[taskId],
              status: toColumnId,
            },
          }));
        }
        return newColumns;
      });
    },
    []
  );

  const handleTaskCreate = useCallback(
    (columnId: string, taskData: Omit<KanbanTask, 'id' | 'status'>) => {
      const newTaskId = generateId();
      const newTask: KanbanTask = {
        ...taskData,
        id: newTaskId,
        status: columnId,
      };
      
      setTasks(prevTasks => ({
        ...prevTasks,
        [newTaskId]: newTask,
      }));
      
      setColumns(prevColumns =>
        prevColumns.map(col =>
          col.id === columnId
            ? { ...col, taskIds: [...col.taskIds, newTaskId] }
            : col
        )
      );
    },
    []
  );

  const handleTaskUpdate = useCallback(
    (taskId: string, updates: Partial<KanbanTask>) => {
      setTasks(prevTasks => ({
        ...prevTasks,
        [taskId]: {
          ...prevTasks[taskId],
          ...updates,
        },
      }));
    },
    []
  );

  const handleTaskDelete = useCallback((taskId: string) => {
    setTasks(prevTasks => {
      const newTasks = { ...prevTasks };
      delete newTasks[taskId];
      return newTasks;
    });
    
    setColumns(prevColumns =>
      prevColumns.map(col => ({
        ...col,
        taskIds: col.taskIds.filter(id => id !== taskId),
      }))
    );
  }, []);

  return {
    columns,
    tasks,
    handleTaskMove,
    handleTaskCreate,
    handleTaskUpdate,
    handleTaskDelete,
  };
};