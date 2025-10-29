import { useState, useCallback } from 'react';
import {
  DragStartEvent,
  DragOverEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

interface DragState {
  activeId: string | null;
  overId: string | null;
}

/**
 * Custom hook for managing drag and drop state
 */
export const useDragAndDrop = () => {
  const [dragState, setDragState] = useState<DragState>({
    activeId: null,
    overId: null,
  });

  // Configure sensors for drag interactions
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setDragState({
      activeId: event.active.id as string,
      overId: null,
    });
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    setDragState((prev) => ({
      ...prev,
      overId: event.over?.id as string | null,
    }));
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState({
      activeId: null,
      overId: null,
    });
  }, []);

  return {
    dragState,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    collisionDetection: closestCorners,
  };
};