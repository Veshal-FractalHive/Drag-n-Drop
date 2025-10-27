import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
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
import type { DraggableCategorizedItem } from '../types';
import { PageLayout, ResultMessage } from '../components';

interface Item extends DraggableCategorizedItem {}

const initialItems: Item[] = [
  { id: '1', name: 'Apple', category: 'fruit', isOddOne: false },
  { id: '2', name: 'Orange', category: 'fruit', isOddOne: false },
  { id: '3', name: 'Banana', category: 'fruit', isOddOne: false },
  { id: '4', name: 'Carrot', category: 'vegetable', isOddOne: true },
  { id: '5', name: 'Grapes', category: 'fruit', isOddOne: false },
];

function SortableItem({ item }: { item: Item }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border-2 border-gray-300 rounded-lg p-4 cursor-grab active:cursor-grabbing shadow-md hover:shadow-lg transition-shadow"
    >
      <div {...attributes} {...listeners} className="flex items-center gap-3">
        <div className="flex-1">
          <p className="font-semibold text-lg">{item.name}</p>
          <p className="text-sm text-gray-500 capitalize">{item.category}</p>
        </div>
      </div>
    </div>
  );
}

function DropZone({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'drop-zone',
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[150px] border-4 border-dashed rounded-lg p-6 flex items-center justify-center transition-colors ${
        isOver
          ? 'bg-blue-200 border-blue-500'
          : 'bg-blue-50 border-blue-400'
      }`}
    >
      {children}
    </div>
  );
}

function OddOneOut() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);
  const [droppedItems, setDroppedItems] = useState<Item[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'correct' | 'incorrect'>('playing');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: any) {
    const { active } = event;
    const item = items.find((item) => item.id === active.id);
    setDraggedItem(item || null);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    setDraggedItem(null);

    if (!over) return;

    if (over.id === 'drop-zone') {
      // Moved to drop zone
      const draggedItem = items.find((item) => item.id === active.id);
      if (draggedItem) {
        if (draggedItem.isOddOne) {
          setGameState('correct');
        } else {
          setGameState('incorrect');
        }
        setDroppedItems([...droppedItems, draggedItem]);
        setItems(items.filter((item) => item.id !== active.id));
      }
    } else if (over.id !== active.id) {
      // Reordering within the list
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  }

  function handleReset() {
    setItems(initialItems);
    setDroppedItems([]);
    setGameState('playing');
  }

  return (
    <PageLayout
      title="Odd One Out"
      subtitle="Find the item that doesn't belong and drag it to the drop zone below."
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Items:</h2>
          <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {items.map((item) => (
                <SortableItem key={item.id} item={item} />
              ))}
            </div>
          </SortableContext>
        </div>

        {/* Drop Zone */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Drag the odd item here:</h2>
          <DropZone>
            {droppedItems.length > 0 ? (
              <div className="text-center">
                <p className="font-semibold text-lg">{droppedItems[0].name}</p>
                <p className="text-sm text-gray-600 capitalize">{droppedItems[0].category}</p>
              </div>
            ) : (
              <p className="text-gray-400 text-lg">Drop zone</p>
            )}
          </DropZone>
        </div>

        <DragOverlay>
          {draggedItem ? (
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-lg opacity-90">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-lg">{draggedItem.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{draggedItem.category}</p>
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Game Result */}
      {gameState !== 'playing' && (
        <div className="mt-6">
          {gameState === 'correct' ? (
            <ResultMessage
              isCorrect={true}
              title="✓ Correct! Well done!"
              message={`${droppedItems[0]?.name} was the odd one out (it's a ${droppedItems[0]?.category}, not a fruit).`}
              actionLabel="Try Another Set"
              onAction={handleReset}
            />
          ) : (
            <ResultMessage
              isCorrect={false}
              title="✗ Not quite right. Try again!"
              message="That's not the odd one out. Keep looking for the item that doesn't belong with the others."
              actionLabel="Try Another Set"
              onAction={handleReset}
            />
          )}
        </div>
      )}
    </PageLayout>
  );
}

export default OddOneOut;

