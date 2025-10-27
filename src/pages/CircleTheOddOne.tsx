import { useState } from 'react';
import { PageLayout, ResultMessage as ResultDisplay, ProgressBar as ProgressDisplay, Button } from '../components';
import type { Question } from '../types';

// ==================== TYPES ====================

// ==================== DATA ====================
const QUESTIONS: Question[] = [
  {
    id: 1,
    options: ['Apple', 'Banana', 'Carrot', 'Orange'],
    correctAnswer: 2,
    category: 'Food',
    explanation: 'Carrot is a vegetable, while the others are fruits.'
  },
  {
    id: 2,
    options: ['Cat', 'Dog', 'Fish', 'Bird'],
    correctAnswer: 2,
    category: 'Animals',
    explanation: 'Fish lives in water, while the others are land animals.'
  },
  {
    id: 3,
    options: ['Sun', 'Moon', 'Star', 'Book'],
    correctAnswer: 3,
    category: 'Space',
    explanation: 'Book is not a celestial object, while the others are.'
  },
  {
    id: 4,
    options: ['Red', 'Blue', 'Green', 'Square'],
    correctAnswer: 3,
    category: 'Shapes & Colors',
    explanation: 'Square is a shape, while the others are colors.'
  }
];

// ==================== HELPER FUNCTIONS ====================
interface ButtonStyles {
  borderColor: string;
  bgColor: string;
  textColor: string;
  scaleClass: string;
}

function getOptionButtonStyles(
  index: number,
  selectedAnswer: number | null,
  isCorrect: boolean,
  showResult: boolean,
  correctAnswerIndex: number
): ButtonStyles {
  const defaultStyles: ButtonStyles = {
    borderColor: 'border-gray-300',
    bgColor: 'bg-white',
    textColor: 'text-gray-900',
    scaleClass: ''
  };

  // If this option was selected
  if (selectedAnswer === index) {
    return {
      borderColor: isCorrect ? 'border-green-500' : 'border-red-500',
      bgColor: isCorrect ? 'bg-green-50' : 'bg-red-50',
      textColor: isCorrect ? 'text-green-800' : 'text-red-800',
      scaleClass: ''
    };
  }

  // If wrong answer was selected, highlight the correct answer
  if (showResult && !isCorrect && index === correctAnswerIndex) {
    return {
      borderColor: 'border-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      scaleClass: 'ring-4 ring-green-300 ring-opacity-50'
    };
  }

  return defaultStyles;
}

// ==================== COMPONENTS ====================
interface OptionButtonProps {
  option: string;
  index: number;
  selectedAnswer: number | null;
  isSelectedCorrect: boolean;
  showResult: boolean;
  correctAnswerIndex: number;
  onSelect: (index: number) => void;
}

function OptionButton({ option, index, selectedAnswer, isSelectedCorrect, showResult, correctAnswerIndex, onSelect }: OptionButtonProps) {
  const styles = getOptionButtonStyles(index, selectedAnswer, isSelectedCorrect, showResult, correctAnswerIndex);

  return (
    <button
      onClick={() => onSelect(index)}
      disabled={showResult}
      className={`
        p-8 rounded-xl border-4 transition-all transform
        hover:scale-105 active:scale-95
        ${showResult ? 'cursor-default' : 'cursor-pointer hover:shadow-lg'}
        ${styles.borderColor} ${styles.bgColor} ${styles.textColor} ${styles.scaleClass}
      `}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">{option}</span>
        {selectedAnswer === index && (
          <span className="text-4xl">{isSelectedCorrect ? '✓' : '✗'}</span>
        )}
      </div>
    </button>
  );
}

// ==================== MAIN COMPONENT ====================
function CircleTheOddOne() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  // ==================== EVENT HANDLERS ====================
  const handleSelect = (answerIndex: number) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex);
      setShowResult(true);
    }
  };

  const handleNext = () => {
    const nextIndex = (currentQuestionIndex + 1) % QUESTIONS.length;
    setCurrentQuestionIndex(nextIndex);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  // ==================== RENDER ====================
  return (
    <PageLayout
      title="Circle the Odd One Out"
      subtitle="Click on the item that doesn't belong with the others"
      headerActions={
        <button onClick={handleNext} className="text-blue-500 hover:underline font-semibold">
          Next Question →
        </button>
      }
    >
      {/* Progress Indicator */}
      <div className="mb-6 text-center">
        <p className="text-gray-600 mb-4">
          Question {currentQuestionIndex + 1} of {QUESTIONS.length}
        </p>
        {/* Category Badge */}
        <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">
          {currentQuestion.category}
        </span>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {currentQuestion.options.map((option, index) => (
          <OptionButton
            key={index}
            option={option}
            index={index}
            selectedAnswer={selectedAnswer}
            isSelectedCorrect={isCorrect}
            showResult={showResult}
            correctAnswerIndex={currentQuestion.correctAnswer}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Result Message */}
      {showResult && (
        <ResultDisplay
          isCorrect={isCorrect}
          title={isCorrect ? '🎉 Correct!' : 'Not quite right'}
          message={currentQuestion.explanation}
        />
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button onClick={handleReset}>Try Again</Button>
        {showResult && <Button variant="success" onClick={handleNext}>Next Question</Button>}
      </div>

      {/* Progress Bar */}
      <ProgressDisplay current={currentQuestionIndex} total={QUESTIONS.length} />
    </PageLayout>
  );
}

export default CircleTheOddOne;