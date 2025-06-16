import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { SuggestedResponses } from './SuggestedResponses';
import { ChatInput } from './ChatInput';
import { Message } from '../types/chat';

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  onSendMessage,
  isLoading = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestedResponse = (response: string) => {
    onSendMessage(response);
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hei, Aima</h3>
              <p className="text-gray-500">Apa kabar hari ini?</p>
            </div>
            <SuggestedResponses onSelectResponse={handleSuggestedResponse} />
          </div>
        ) : (
          <div>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat Input */}
      <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  );
};