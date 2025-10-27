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
import type { FillInTheBlanksData } from '../types';
import { PageLayout, Button, ResultMessage } from '../components';

const gameData: FillInTheBlanksData = {
  sentence: ['The', '__blank1__', 'is', 'sitting', 'on', 'the', '__blank2__', '.'],
  blanks: [
    { id: 'blank1', correctWord: 'cat' },
    { id: 'blank2', correctWord: 'mat' },
  ],
  options: ['cat', 'dog', 'mat', 'hat', 'rat'],
};

function DraggableWord({ 
  id, 
  word, 
  isDragging 
}: { 
  id: string; 
  word: string;
  isDragging: boolean;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
  });

  return (
    <button
      ref={setNodeRef}
      className={`px-4 py-2 rounded-lg border-2 cursor-grab active:cursor-grabbing transition-all hover:shadow-lg ${
        isDragging ? 'opacity-0' : 'bg-white border-gray-300 hover:border-blue-400'
      }`}
      {...listeners}
      {...attributes}
    >
      <span className="font-semibold text-lg">{word}</span>
    </button>
  );
}

function DroppableBlank({ 
  id, 
  children, 
  correctWord,
  filledWord 
}: { 
  id: string; 
  children?: React.ReactNode;
  correctWord: string;
  filledWord?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  
  const isCorrect = filledWord === correctWord;
  const showPlaceholder = !filledWord;

  return (
    <span
      ref={setNodeRef}
      className={`inline-block min-w-[100px] min-h-[40px] border-2 border-dashed rounded px-3 py-1 mx-1 transition-colors flex items-center justify-center ${
        isOver
          ? 'bg-blue-100 border-blue-500'
          : filledWord
            ? isCorrect
              ? 'bg-green-100 border-green-500'
              : 'bg-red-100 border-red-500'
            : 'bg-gray-50 border-gray-300'
      }`}
    >
      {showPlaceholder ? (
        <span className="text-gray-400 text-xs">{children}</span>
      ) : (
        <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
          {filledWord}
        </span>
      )}
    </span>
  );
}

function FillInTheBlanks() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filledBlanks, setFilledBlanks] = useState<Record<string, string>>({});
  const [availableOptions, setAvailableOptions] = useState<string[]>(
    [...gameData.options].sort(() => Math.random() - 0.5)
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

    const sourceWord = active.id as string;
    const targetId = over.id as string;

    // Check if dropping on a blank
    if (targetId.startsWith('blank')) {
      // Check if blank is already filled
      if (!filledBlanks[targetId]) {
        // Remove word from available options
        setAvailableOptions((prev) => prev.filter((w) => w !== sourceWord));
        
        // Fill the blank
        setFilledBlanks((prev) => ({
          ...prev,
          [targetId]: sourceWord,
        }));
      }
    }
  }

  const draggedWord = availableOptions.find((word) => word === activeId);

  function handleReset() {
    setFilledBlanks({});
    setAvailableOptions([...gameData.options].sort(() => Math.random() - 0.5));
  }

  const isComplete = gameData.blanks.every(
    (blank) => filledBlanks[blank.id]
  );
  
  const isCorrect = gameData.blanks.every(
    (blank) => filledBlanks[blank.id] === blank.correctWord
  );

  return (
    <PageLayout
      title="Fill in the Blanks"
      subtitle="Drag and drop words to complete the sentence."
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Sentence with blanks */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-6">
          <div className="text-xl leading-relaxed">
            {gameData.sentence.map((part, index) => {
              if (part.startsWith('__blank')) {
                const blankId = part.replace('__', '').replace('__', '');
                const blank = gameData.blanks.find((b) => b.id === blankId);
                const filledWord = filledBlanks[blankId];
                return (
                  <DroppableBlank
                    key={index}
                    id={blankId}
                    correctWord={blank?.correctWord || ''}
                    filledWord={filledWord}
                  >
                    [blank]
                  </DroppableBlank>
                );
              }
              return <span key={index} className="mx-1">{part}</span>;
            })}
          </div>
        </div>

        {/* Available word options */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Word Options:</h2>
          <div className="flex flex-wrap gap-3">
            {availableOptions.map((word) => {
              const isDragging = activeId === word;
              return (
                <DraggableWord
                  key={word}
                  id={word}
                  word={word}
                  isDragging={isDragging}
                />
              );
            })}
          </div>
        </div>

        <DragOverlay>
          {draggedWord ? (
            <div className="px-4 py-2 rounded-lg border-2 bg-white border-gray-400 shadow-lg">
              <span className="font-semibold text-lg">{draggedWord}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Result message */}
      {isComplete && (
        <ResultMessage
          isCorrect={isCorrect}
          title={isCorrect ? '🎉 Correct! Well done!' : 'Some answers are incorrect. Please try again!'}
          message={!isCorrect ? `Correct answers were: ${gameData.blanks.map((b) => b.correctWord).join(', ')}` : undefined}
          actionLabel="Try Again"
          onAction={handleReset}
        />
      )}

      {!isComplete && (
        <div className="mt-6">
          <Button onClick={handleReset}>Reset</Button>
        </div>
      )}
    </PageLayout>
  );
}

export default FillInTheBlanks;

