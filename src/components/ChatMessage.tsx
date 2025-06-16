import React from 'react';
import { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAI = message.sender === 'ai';

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
          isAI
            ? 'bg-gray-100 text-gray-900'
            : 'bg-blue-600 text-white'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <div className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};