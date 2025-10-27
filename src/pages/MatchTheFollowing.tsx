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
  useDraggable,
} from '@dnd-kit/core';
import type { MatchPair } from '../types';
import { PageLayout, Button, ResultMessage } from '../components';

const matchingPairs: MatchPair[] = [
  { id: '1', left: 'Apple', right: '🍎' },
  { id: '2', left: 'Car', right: '🚗' },
  { id: '3', left: 'Cat', right: '🐱' },
  { id: '4', left: 'Tree', right: '🌳' },
  { id: '5', left: 'Book', right: '📚' },
];

function DraggableItem({ 
  id, 
  content, 
  isCorrect,
  isDragging,
  className = ''
}: { 
  id: string; 
  content: string;
  isCorrect?: boolean;
  isDragging?: boolean;
  className?: string;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-lg border-2 cursor-grab active:cursor-grabbing transition-all hover:shadow-lg ${
        isCorrect
          ? 'bg-green-100 border-green-500'
          : 'bg-white border-gray-300'
      } ${isDragging ? 'opacity-0' : ''} ${className}`}
      {...listeners}
      {...attributes}
    >
      <div className="text-center font-semibold text-lg">{content}</div>
    </div>
  );
}

function DroppableSlot({ 
  id, 
  children, 
  isCorrect 
}: { 
  id: string; 
  children?: React.ReactNode;
  isCorrect?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[80px] p-4 rounded-lg border-2 border-dashed transition-colors flex items-center justify-center ${
        isOver
          ? isCorrect
            ? 'bg-green-100 border-green-500'
            : 'bg-blue-100 border-blue-500'
          : 'bg-gray-50 border-gray-300'
      }`}
    >
      {children}
    </div>
  );
}

function MatchTheFollowing() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [shuffledPairs, setShuffledPairs] = useState(
    [...matchingPairs].sort(() => Math.random() - 0.5)
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const sourceId = active.id as string;
    const targetId = over.id as string;

    // Check if dropping on a target slot
    if (targetId.startsWith('slot-')) {
      // Check if this is a correct match
      const sourcePair = shuffledPairs.find((p) => p.id === sourceId);
      const [_, pairId] = targetId.split('-');
      const targetPair = matchingPairs.find((p) => p.id === pairId);

      if (sourcePair && targetPair && sourcePair.left === targetPair.left) {
        // Correct match
        setMatches((prev) => ({
          ...prev,
          [targetId]: sourceId,
        }));
      }
    }
  }

  const draggedItem = shuffledPairs.find((item) => item.id === activeId);

  function handleReset() {
    setMatches({});
    setShuffledPairs([...matchingPairs].sort(() => Math.random() - 0.5));
  }

  const allMatched = matchingPairs.every((pair) => {
    const slotId = `slot-${pair.id}`;
    return matches[slotId] && matchingPairs.find((p) => p.id === matches[slotId])?.left === pair.left;
  });

  return (
    <PageLayout
      title="Match the Following"
      subtitle="Match the words with their corresponding emojis by dragging."
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-2 gap-8">
          {/* Left column - Items to drag */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Drag from here:</h2>
            <div className="space-y-3">
              {shuffledPairs.map((pair) => {
                const matchedSlot = Object.keys(matches).find((key) => matches[key] === pair.id);
                const isCorrect = matchedSlot ? matchingPairs.find((p) => p.id === matches[matchedSlot])?.left === pair.left : false;
                const isDragging = activeId === pair.id;

                // Check if this item is already matched
                if (matchedSlot) {
                  return (
                    <DraggableItem
                      key={pair.id}
                      id={pair.id}
                      content={pair.left}
                      isCorrect={!!isCorrect}
                      isDragging={isDragging}
                      className="opacity-50"
                    />
                  );
                }

                return (
                  <DraggableItem
                    key={pair.id}
                    id={pair.id}
                    content={pair.left}
                    isDragging={isDragging}
                  />
                );
              })}
            </div>
          </div>

          {/* Right column - Drop zones */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Drop here:</h2>
            <div className="space-y-3">
              {matchingPairs.map((pair) => {
                const matchedItemId = matches[`slot-${pair.id}`];
                const matchedItem = shuffledPairs.find((item) => item.id === matchedItemId);
                const isCorrect = matchedItem?.left === pair.left;

                return (
                  <DroppableSlot
                    key={pair.id}
                    id={`slot-${pair.id}`}
                    isCorrect={isCorrect}
                  >
                    {matchedItem ? (
                      <div className="text-center">
                        <div className="font-semibold text-4xl">{pair.right}</div>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm">{pair.right}</div>
                    )}
                  </DroppableSlot>
                );
              })}
            </div>
          </div>
        </div>

        <DragOverlay>
          {draggedItem ? (
            <div className="p-4 rounded-lg border-2 bg-white border-gray-400 shadow-lg">
              <div className="text-center font-semibold text-lg">{draggedItem.left}</div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Result message */}
      {allMatched && (
        <ResultMessage
          isCorrect={true}
          title="🎉 Excellent! You've matched everything correctly!"
          actionLabel="Play Again"
          onAction={handleReset}
        />
      )}

      <div className="mt-6">
        <Button onClick={handleReset}>Reset</Button>
      </div>
    </PageLayout>
  );
}

export default MatchTheFollowing;

