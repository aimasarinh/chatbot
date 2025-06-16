import React from 'react';

interface SuggestedResponsesProps {
  onSelectResponse: (response: string) => void;
}

export const SuggestedResponses: React.FC<SuggestedResponsesProps> = ({
  onSelectResponse,
}) => {
  const suggestions = [
    'Cari tentang...',
    'Ingatkan tentang...',
    'Coba ceritakan...',
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelectResponse(suggestion)}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};