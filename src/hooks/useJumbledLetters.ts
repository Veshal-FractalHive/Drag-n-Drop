import { useState } from 'react';

export function useJumbledLetters(letters: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [slots, setSlots] = useState<Record<number, string>>({});

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const letter = active.id as string;
    const slotIndex = parseInt(over.id as string);

    if (!isNaN(slotIndex)) {
      setSlots((prev) => ({
        ...prev,
        [slotIndex]: letter,
      }));
    }
  }

  function handleReset() {
    setSlots({});
  }

  const currentWord = Object.values(slots).join('');
  const originalWord = letters.join('');
  const isComplete = Object.keys(slots).length === letters.length;
  const isCorrect = currentWord === originalWord;

  return {
    activeId,
    slots,
    currentWord,
    originalWord,
    isComplete,
    isCorrect,
    handleDragStart,
    handleDragEnd,
    handleReset,
  };
}
