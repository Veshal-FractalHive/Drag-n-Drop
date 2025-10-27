import { useDraggable } from '@dnd-kit/core';

interface DraggableLetterProps {
  id: string;
  letter: string;
  isDragging?: boolean;
}

export function DraggableLetter({ id, letter, isDragging }: DraggableLetterProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`px-6 py-4 rounded-lg border-2 cursor-grab active:cursor-grabbing transition-all hover:shadow-lg ${
        isDragging ? 'opacity-0' : 'bg-white border-gray-300'
      }`}
      {...listeners}
      {...attributes}
    >
      <span className="font-bold text-2xl">{letter}</span>
    </div>
  );
}
