interface ResultMessageProps {
  isCorrect: boolean;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ResultMessage({
  isCorrect,
  title,
  message,
  actionLabel,
  onAction,
}: ResultMessageProps) {
  const bgColor = isCorrect ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isCorrect ? 'border-green-500' : 'border-red-500';
  const textColor = isCorrect ? 'text-green-800' : 'text-red-800';
  const subtitleColor = isCorrect ? 'text-green-700' : 'text-red-700';

  return (
    <div className={`p-6 rounded-xl border-2 ${bgColor} ${borderColor}`}>
      <p className={`font-bold text-xl text-center mb-2 ${textColor}`}>{title}</p>
      {message && <p className={`text-center ${subtitleColor}`}>{message}</p>}
      {onAction && actionLabel && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={onAction}
            className={`
              font-semibold py-3 px-8 rounded-lg transition-colors
              ${isCorrect ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              text-white
            `}
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}
