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
import { PageLayout, Button } from '../components';

function PuzzleTile({ id, number, isDragging }: { id: string; number: number; isDragging: boolean }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  return (
    <button
      ref={setNodeRef}
      className={`w-20 h-20 border-2 rounded-lg cursor-grab active:cursor-grabbing transition-all hover:shadow-lg ${
        isDragging ? 'opacity-0' : 'bg-white border-gray-300 font-bold text-2xl'
      }`}
      {...listeners}
      {...attributes}
    >
      {number}
    </button>
  );
}

function PuzzleSlot({ id, number, filledNumber }: { id: string; number: number; filledNumber?: number }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const isCorrect = filledNumber === number;

  return (
    <div
      ref={setNodeRef}
      className={`w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
        isOver
          ? 'bg-blue-100 border-blue-500'
          : filledNumber
            ? isCorrect
              ? 'bg-green-100 border-green-500'
              : 'bg-red-100 border-red-500'
            : 'bg-gray-50 border-gray-300'
      }`}
    >
      {filledNumber ? (
        <span className={`font-bold text-2xl ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
          {filledNumber}
        </span>
      ) : (
        <span className="text-gray-400 text-xs">#{number}</span>
      )}
    </div>
  );
}

function Puzzles() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filledSlots, setFilledSlots] = useState<Record<string, number>>({});
  const [availableNumbers, setAvailableNumbers] = useState<number[]>(
    [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5)
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

    const sourceNumber = parseInt(active.id as string);
    const targetId = over.id as string;

    // Check if dropping on a slot
    if (targetId.startsWith('slot-')) {
      const slotNumber = parseInt(targetId.replace('slot-', ''));

      // Check if slot is already filled
      if (!filledSlots[slotNumber]) {
        // Remove number from available
        setAvailableNumbers((prev) => prev.filter((n) => n !== sourceNumber));

        // Fill the slot
        setFilledSlots((prev) => ({
          ...prev,
          [slotNumber]: sourceNumber,
        }));
      }
    }
  }

  const draggedNumber = availableNumbers.find((n) => n.toString() === activeId);

  function handleReset() {
    setFilledSlots({});
    setAvailableNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5));
  }

  const allFilled = Object.keys(filledSlots).length === 9;
  const isCorrect = Array.from({ length: 9 }, (_, i) => i + 1).every(
    (num) => filledSlots[num] === num
  );

  return (
    <PageLayout
      title="Number Puzzle"
      subtitle="Drag the numbers to the correct positions to solve the puzzle!"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Puzzle Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-2 w-fit mx-auto">
            {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => {
              const filledNumber = filledSlots[num];
              return (
                <PuzzleSlot
                  key={num}
                  id={`slot-${num}`}
                  number={num}
                  filledNumber={filledNumber}
                />
              );
            })}
          </div>

          {/* Result */}
          {allFilled && (
            <div className="mt-6 text-center">
              <p className="text-xl font-bold">
                {isCorrect ? (
                  <span className="text-green-600">🎉 Puzzle Solved! Excellent!</span>
                ) : (
                  <span className="text-red-600">Not quite right. Try again!</span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Available numbers */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Available Numbers:</h2>
          <div className="flex gap-2 justify-center">
            {availableNumbers.map((num) => {
              const isDragging = activeId === num.toString();
              return (
                <PuzzleTile
                  key={num}
                  id={num.toString()}
                  number={num}
                  isDragging={isDragging}
                />
              );
            })}
          </div>
        </div>

        <DragOverlay>
          {draggedNumber ? (
            <div className="w-20 h-20 border-2 rounded-lg bg-white border-gray-400 shadow-lg flex items-center justify-center font-bold text-2xl">
              {draggedNumber}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="flex gap-4 justify-center">
        <Button onClick={handleReset}>Reset Puzzle</Button>
        {isCorrect && <Button variant="success" onClick={handleReset}>Try Another</Button>}
      </div>
    </PageLayout>
  );
}

export default Puzzles;