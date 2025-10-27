import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';
import { Button } from '../components';
import { PageLayout } from '../components';

const initialColumns = {
  todo: [
    { id: '1', title: 'Design new UI', description: 'Create wireframes for the homepage' },
    { id: '2', title: 'Setup database', description: 'Configure PostgreSQL database' },
  ],
  'in-progress': [
    { id: '3', title: 'Implement authentication', description: 'Add login and signup features' },
  ],
  done: [
    { id: '4', title: 'Deploy to production', description: 'Launch the application' },
  ],
};

function TaskCard({ task }: { task: Task }) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg cursor-grab active:cursor-grabbing transition-all border-l-4 border-blue-500"
    >
      <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
      {task.description && (
        <p className="text-sm text-gray-600">{task.description}</p>
      )}
    </div>
  );
}

function Column({ id, title, tasks }: { id: string; title: string; tasks: Task[] }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 bg-gray-100 rounded-lg p-4 min-h-[400px] transition-colors ${
        isOver ? 'bg-gray-200' : ''
      }`}
    >
      <h2 className="font-bold text-xl mb-4 text-gray-700">{title}</h2>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {tasks.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No tasks
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

function KanbanBoard() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [columns, setColumns] = useState(initialColumns);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const allTasks: Task[] = Object.values(columns).flat();
  const draggedTask = allTasks.find((task) => task.id === activeId);

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Find which column the dragged task is in
    const activeColumn = Object.keys(columns).find((key) =>
      columns[key as keyof typeof columns].some((task) => task.id === taskId)
    );

    if (!activeColumn) return;

    const task = allTasks.find((t) => t.id === taskId);
    if (!task) return;

    // Check if dropped on a column
    if (['todo', 'in-progress', 'done'].includes(overId)) {
      if (activeColumn !== overId) {
        // Move task to different column
        setColumns((prev) => ({
          ...prev,
          [activeColumn]: prev[activeColumn as keyof typeof prev].filter(
            (t) => t.id !== taskId
          ),
          [overId]: [...prev[overId as keyof typeof prev], task],
        }));
      }
    } else {
      // Dropped on another task - reorder within same or different column
      const overTaskColumn = Object.keys(columns).find((key) =>
        columns[key as keyof typeof columns].some((task) => task.id === overId)
      );

      if (overTaskColumn) {
        const columnTasks = columns[overTaskColumn as keyof typeof columns];
        const oldIndex = columnTasks.findIndex((task) => task.id === taskId);
        const newIndex = columnTasks.findIndex((task) => task.id === overId);

        if (activeColumn === overTaskColumn && oldIndex !== newIndex && newIndex !== -1) {
          // Reorder within same column
          setColumns((prev) => ({
            ...prev,
            [overTaskColumn]: arrayMove(columnTasks, oldIndex, newIndex),
          }));
        } else if (activeColumn !== overTaskColumn) {
          // Move task to different column at specific position
          const newColumnTasks = columns[overTaskColumn as keyof typeof columns];
          setColumns((prev) => ({
            ...prev,
            [activeColumn]: prev[activeColumn as keyof typeof prev].filter(
              (t) => t.id !== taskId
            ),
            [overTaskColumn]: [
              ...newColumnTasks.slice(0, newIndex === -1 ? newColumnTasks.length : newIndex),
              task,
              ...newColumnTasks.slice(newIndex === -1 ? newColumnTasks.length : newIndex),
            ],
          }));
        }
      }
    }
  }

  function handleReset() {
    setColumns(initialColumns);
  }

  return (
    <PageLayout
      title="Kanban Board"
      subtitle="Drag and drop tasks between columns to manage your workflow."
      headerActions={<Button onClick={handleReset}>Reset Board</Button>}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-3 gap-6">
          <Column
            id="todo"
            title="To Do"
            tasks={columns.todo}
          />
          <Column
            id="in-progress"
            title="In Progress"
            tasks={columns['in-progress']}
          />
          <Column
            id="done"
            title="Done"
            tasks={columns.done}
          />
        </div>

        <DragOverlay>
          {draggedTask ? (
            <div className="bg-white p-4 rounded-lg shadow-xl border-l-4 border-blue-500 opacity-90">
              <h3 className="font-semibold text-lg mb-1">{draggedTask.title}</h3>
              {draggedTask.description && (
                <p className="text-sm text-gray-600">{draggedTask.description}</p>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </PageLayout>
  );
}

export default KanbanBoard;

