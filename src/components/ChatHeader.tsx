import React from 'react';
import { Plus } from 'lucide-react';

interface ChatHeaderProps {
  onCreateTopic: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onCreateTopic }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-900">Kotak Curhat</h2>
      <button
        onClick={onCreateTopic}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Buat Topik</span>
      </button>
    </div>
  );
};