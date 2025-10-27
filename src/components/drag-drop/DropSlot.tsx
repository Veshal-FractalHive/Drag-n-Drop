import { useDroppable } from '@dnd-kit/core';

interface DropSlotProps {
  id: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function DropSlot({ id, children, size = 'md' }: DropSlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  return (
    <div
      ref={setNodeRef}
      className={`${sizeClasses[size]} border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
        isOver ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-300'
      }`}
    >
      {children}
    </div>
  );
}
