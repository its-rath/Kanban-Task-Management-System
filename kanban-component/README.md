# Kanban Board Component

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8)](https://tailwindcss.com/)
[![Storybook](https://img.shields.io/badge/Storybook-7.0-ff4785)](https://storybook.js.org/)

A production-grade, fully accessible Kanban Board component built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Drag & Drop**: Smooth drag-and-drop using @dnd-kit/core primitives
- **Type-Safe**: Built with TypeScript strict mode
- **Accessible**: WCAG 2.1 AA compliant with full keyboard navigation
- **Responsive**: Mobile, tablet, and desktop layouts
- **Performant**: Optimized with memoization and virtualization
- **Documented**: Comprehensive Storybook documentation

## 🚀 Installation
```bash
  npm install
  npm run storybook
```

## 📖 Usage

import { KanbanBoard } from './components/KanbanBoard';
import { useKanbanBoard } from './hooks/useKanbanBoard';

function App() {
  const {
    columns,
    tasks,
    handleTaskMove,
    handleTaskCreate,
    handleTaskUpdate,
    handleTaskDelete,
  } = useKanbanBoard({ initialColumns, initialTasks });

  return (
    <KanbanBoard 
    columns={columns}
    tasks={tasks} 
    onTaskMove={handleTaskMove} 
    onTaskCreate={handleTaskCreate} 
    onTaskUpdate={handleTaskUpdate} 
    onTaskDelete={handleTaskDelete} />
  );
}


## 🎯 Architecture

### Component Structure

- **KanbanBoard**: Main container with drag-and-drop context
- **KanbanColumn**: Individual columns with droppable areas
- **KanbanCard**: Task cards with drag functionality
- **TaskModal**: Editing interface for task details

### Custom Hooks

- **useDragAndDrop**: Manages drag-and-drop state and sensors
- **useKanbanBoard**: Manages board state and CRUD operations

### Utilities

- **task.utils**: Task-related helper functions
- **column.utils**: Column manipulation utilities

## ⌨️ Keyboard Navigation

| Key       | Action                                |
|-----------|---------------------------------------|
| Tab       | Move focus between cards              |
| Shift+Tab | Move focus backwards                  |
| Enter/Space | Select card or activate element     |
| Arrow Keys| Navigate between cards                |
| Escape    | Close modal or cancel action          |
| Delete    | Delete focused card                   |

## 🎨 Customization

Extend Tailwind configuration in `tailwind.config.js` to customize colors, spacing, and animations.

## 📊 Performance

- React.memo for expensive components
- useCallback and useMemo for optimization
- List virtualization for large datasets (50+ items)
- Debounced search and filter inputs

## 🧪 Storybook Stories

- **Default**: Basic board with sample data
- **Empty State**: Board with no tasks
- **Large Dataset**: 50+ tasks for performance testing
- **Mobile View**: Responsive layout demonstration
- **Accessibility Demo**: Keyboard navigation showcase

## 🧾 Conclusion

This production-grade Kanban Board component demonstrates enterprise-level React developmentwith TypeScript, featuring comprehensive accessibility, performance optimization, and Storybookdocumentation. All code follows strict type-safety standards and modern best practices for scalablecomponent libraries.

## 📝 License

MIT

## 👨‍💻 Author

[Swayam Rath]