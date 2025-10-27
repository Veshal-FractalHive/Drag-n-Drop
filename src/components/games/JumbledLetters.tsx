import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { PageLayout, DropSlot, DraggableLetter } from '../';
import { useJumbledLetters } from '../../hooks';

interface JumbledLettersProps {
  letters: string[];
}

export function JumbledLetters({ letters }: JumbledLettersProps) {
  const {
    activeId,
    slots,
    currentWord,
    isComplete,
    isCorrect,
    handleDragStart,
    handleDragEnd,
    handleReset,
  } = useJumbledLetters(letters);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const draggedLetter = letters.find((l) => l === activeId);

  return (
    <PageLayout
      title="Jumbled Words"
      subtitle="Rearrange the letters to form the correct word by dragging."
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Slots for letters */}
        <div className="mb-8">
          <div className="flex gap-2 justify-center mb-4">
            {letters.map((_, index) => {
              const filledLetter = slots[index];
              return (
                <DropSlot key={index} id={index.toString()}>
                  {filledLetter ? (
                    <span className="font-bold text-2xl">{filledLetter}</span>
                  ) : (
                    <span className="text-gray-400 text-xs">Slot {index + 1}</span>
                  )}
                </DropSlot>
              );
            })}
          </div>
          
          {/* Result */}
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold">
              {isComplete ? (
                <>
                  Word: <span className="text-2xl">{currentWord}</span>
                  {isCorrect ? (
                    <span className="ml-3 text-green-600">✓ Correct!</span>
                  ) : (
                    <span className="ml-3 text-red-600">✗ Wrong</span>
                  )}
                </>
              ) : (
                <span className="text-gray-400">
                  Drag letters to form the word
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Jumbled letters */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Letters:</h2>
          <div className="flex gap-3 justify-center">
            {letters.map((letter) => {
              const isUsed = Object.values(slots).includes(letter);
              const isDragging = activeId === letter;
              
              if (!isUsed || isDragging) {
                return (
                  <DraggableLetter
                    key={letter}
                    id={letter}
                    letter={letter}
                    isDragging={isDragging}
                  />
                );
              }
              return null;
            })}
          </div>
        </div>

        <DragOverlay>
          {draggedLetter ? (
            <div className="px-6 py-4 rounded-lg border-2 bg-white border-gray-400 shadow-lg">
              <span className="font-bold text-2xl">{draggedLetter}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <button
        onClick={handleReset}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
      >
        Reset
      </button>
    </PageLayout>
  );
}
