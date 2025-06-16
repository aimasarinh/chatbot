import React, { useState } from 'react';
import { MessageSquare, User, FileText, LogOut, Plus, Trash2, MoreVertical } from 'lucide-react';
import { Conversation } from '../types/chat';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onCreateConversation: () => void;
  onDeleteConversation?: (id: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
  onLogout,
}) => {
  const [hoveredConversation, setHoveredConversation] = useState<string | null>(null);

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onDeleteConversation && conversations.length > 1) {
      onDeleteConversation(id);
    }
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">R</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">rilliv</h1>
            <p className="text-xs text-blue-600">Education</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-6 space-y-2">
        <NavItem icon={FileText} label="Skrining" />
        <NavItem icon={MessageSquare} label="Kotak Curhat" active />
        <NavItem icon={User} label="Profil" />
      </nav>

      {/* Conversations */}
      <div className="flex-1 px-4 overflow-y-auto">
        <div className="mb-4">
          <button
            onClick={onCreateConversation}
            className="w-full flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Topik Baru</span>
          </button>
        </div>
        
        <div className="space-y-1">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="relative group"
              onMouseEnter={() => setHoveredConversation(conversation.id)}
              onMouseLeave={() => setHoveredConversation(null)}
            >
              <button
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-full text-left p-2 rounded-lg transition-colors ${
                  activeConversationId === conversation.id
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm font-medium pr-2">{conversation.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {conversation.messages.length} pesan
                    </div>
                  </div>
                  {hoveredConversation === conversation.id && conversations.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteConversation(e, conversation.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Hapus percakapan"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active = false }) => (
  <button
    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
      active
        ? 'bg-blue-100 text-blue-900'
        : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);