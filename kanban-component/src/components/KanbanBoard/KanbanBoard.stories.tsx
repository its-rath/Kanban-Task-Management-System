import type { Meta, StoryObj } from '@storybook/react';
import { KanbanBoard } from './KanbanBoard';
import { KanbanColumn, KanbanTask, TaskPriority } from './KanbanBoard.types';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';

// Sample data
const generateSampleTasks = (count: number): Record<string, KanbanTask> => {
  const tasks: Record<string, KanbanTask> = {};
  const statuses = ['todo', 'in-progress', 'review', 'done'] as const;
  const priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
  const assignees = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown'];
  const tags = ['frontend', 'backend', 'design', 'bug', 'feature', 'urgent'];

  for (let i = 1; i <= count; i++) {
    const taskId = `task-${i}`;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const assignee = assignees[Math.floor(Math.random() * assignees.length)];
    const tag1 = tags[Math.floor(Math.random() * tags.length)];
    const tag2 = tags[Math.floor(Math.random() * tags.length)];
    
    tasks[taskId] = {
      id: taskId,
      title: `Task ${i}: Implement feature`,
      description: `This is a detailed description for task ${i}`,
      status,
      priority,
      assignee,
      tags: [tag1, tag2].filter((tag, index, self) => self.indexOf(tag) === index), // Ensure unique tags
      createdAt: new Date(2024, 0, Math.floor(Math.random() * 28) + 1),
      dueDate: Math.random() > 0.5 ? new Date(2024, 1, Math.floor(Math.random() * 28) + 1) : undefined,
    };
  }
  return tasks;
};

const sampleColumns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: [], maxTasks: 10 },
  { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: [], maxTasks: 5 },
  { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [], maxTasks: 3 },
  { id: 'done', title: 'Done', color: '#10b981', taskIds: [] },
];

// Story wrapper component
const KanbanBoardWrapper = ({ taskCount }: { taskCount: number }) => {
  const tasks = generateSampleTasks(taskCount);
  const columns = sampleColumns.map(col => ({
    ...col,
    taskIds: Object.keys(tasks).filter(taskId => tasks[taskId].status === col.id),
  }));

  const {
    columns: boardColumns,
    tasks: boardTasks,
    handleTaskMove,
    handleTaskCreate,
    handleTaskUpdate,
    handleTaskDelete,
  } = useKanbanBoard({
    initialColumns: columns,
    initialTasks: tasks,
  });

  return (
    <div className="p-4 h-screen bg-gray-50">
      <KanbanBoard
        columns={boardColumns}
        tasks={boardTasks}
        onTaskMove={handleTaskMove}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />
    </div>
  );
};

const meta: Meta<typeof KanbanBoard> = {
  title: 'Components/KanbanBoard',
  component: KanbanBoard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A production-grade Kanban Board component with drag-and-drop functionality',
      },
    },
  },
  tags: ['autodocs'],
} as const;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <KanbanBoardWrapper taskCount={12} />,
  parameters: {
    docs: {
      description: {
        story: 'Default Kanban board with sample tasks across different columns.',
      },
    },
  },
};

export const EmptyState: Story = {
  render: () => <KanbanBoardWrapper taskCount={0} />,
  parameters: {
    docs: {
      description: {
        story: 'Empty Kanban board showing the initial state with no tasks.',
      },
    },
  },
};

export const LargeDataset: Story = {
  render: () => <KanbanBoardWrapper taskCount={50} />,
  parameters: {
    docs: {
      description: {
        story: 'Kanban board with a large dataset (50+ tasks) to test performance and virtualization.',
      },
    },
  },
};

export const MobileView: Story = {
  render: () => <KanbanBoardWrapper taskCount={12} />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Kanban board optimized for mobile devices with responsive layout.',
      },
    },
  },
};

export const AccessibilityDemo: Story = {
  render: () => <KanbanBoardWrapper taskCount={8} />,
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
    docs: {
      description: {
        story: 'Demonstrates accessibility features including keyboard navigation and ARIA attributes.',
      },
    },
  },
};