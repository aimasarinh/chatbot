import React from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatHeader } from './components/ChatHeader';
import { ChatArea } from './components/ChatArea';
import { useChat } from './hooks/useChat';

function App() {
  const {
    conversations,
    activeConversation,
    activeConversationId,
    sendMessage,
    createConversation,
    selectConversation,
    deleteConversation,
    isLoading,
  } = useChat();

  const handleLogout = () => {
    console.log('Logout clicked');
    // Implement logout logic here
    if (confirm('Apakah kamu yakin ingin keluar?')) {
      // Clear conversations or redirect to login
      window.location.reload();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={selectConversation}
        onCreateConversation={createConversation}
        onDeleteConversation={deleteConversation}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col">
        <ChatHeader onCreateTopic={createConversation} />
        
        <ChatArea
          messages={activeConversation?.messages || []}
          onSendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default App;