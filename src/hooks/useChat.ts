import { useState, useCallback } from 'react';
import { Message, Conversation } from '../types/chat';
import { OpenRouterService, ChatMessage } from '../services/openrouter';

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Percakapan dengan Oliv',
      messages: [
        {
          id: '1',
          content: 'Hei, Aima!\nApa kabar hari ini?',
          sender: 'ai',
          timestamp: new Date(),
        },
        {
          id: '2',
          content: 'Salam kenal. Aku Oliv, teman virtualmu yang siap bantu kapanpun kamu merasa butuh dukungan. Butuh saran atau punya pertanyaan? Oliv siap jawab!',
          sender: 'ai',
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  
  const [activeConversationId, setActiveConversationId] = useState<string>('1');
  const [isLoading, setIsLoading] = useState(false);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const openRouterService = OpenRouterService.getInstance();

  const convertToOpenRouterMessages = useCallback((messages: Message[]): ChatMessage[] => {
    // Filter out initial greeting messages to avoid repetition
    const filteredMessages = messages.filter(msg => {
      if (msg.sender === 'ai') {
        return !msg.content.includes('Hei, Aima!\nApa kabar hari ini?') && 
               !msg.content.includes('Salam kenal. Aku Oliv');
      }
      return true;
    });

    return filteredMessages.map(msg => ({
      role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }));
  }, []);

  const updateConversationTitle = useCallback((conversationId: string, firstUserMessage: string) => {
    const title = firstUserMessage.length > 30 
      ? firstUserMessage.substring(0, 30) + '...' 
      : firstUserMessage;
    
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId && conv.title.startsWith('Percakapan')
        ? { ...conv, title }
        : conv
    ));
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!activeConversationId || !content.trim()) {
      console.log('❌ Tidak ada conversation aktif atau pesan kosong');
      return;
    }

    console.log('📝 Mengirim pesan:', content);

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    // Add user message immediately
    setConversations(prev => {
      const updated = prev.map(conv => 
        conv.id === activeConversationId
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              updatedAt: new Date(),
            }
          : conv
      );
      console.log('✅ User message added to conversation');
      return updated;
    });

    // Update conversation title if it's the first user message
    const currentConv = conversations.find(c => c.id === activeConversationId);
    const userMessageCount = currentConv?.messages.filter(m => m.sender === 'user').length || 0;
    if (userMessageCount === 0) {
      console.log('🏷️ Updating conversation title');
      updateConversationTitle(activeConversationId, content.trim());
    }

    // Show loading state
    setIsLoading(true);
    console.log('⏳ Loading state activated');
    
    try {
      // Get updated conversation for context
      const updatedConversation = conversations.find(c => c.id === activeConversationId);
      const allMessages = updatedConversation ? [...updatedConversation.messages, userMessage] : [userMessage];
      
      // Convert to OpenRouter format
      const openRouterMessages = convertToOpenRouterMessages(allMessages);
      console.log('🔄 Converted messages for API:', openRouterMessages);
      
      // Get AI response
      console.log('🤖 Calling OpenRouter API...');
      const aiResponseContent = await openRouterService.generateResponse(openRouterMessages);
      console.log('✅ Got AI response:', aiResponseContent);
      
      const aiResponse: Message = {
        id: `msg-${Date.now()}-ai`,
        content: aiResponseContent,
        sender: 'ai',
        timestamp: new Date(),
      };

      // Add AI response
      setConversations(prev => {
        const updated = prev.map(conv => 
          conv.id === activeConversationId
            ? {
                ...conv,
                messages: [...conv.messages, aiResponse],
                updatedAt: new Date(),
              }
            : conv
        );
        console.log('✅ AI response added to conversation');
        return updated;
      });
    } catch (error) {
      console.error('❌ Error getting AI response:', error);
      
      // Add fallback message on error
      const errorResponse: Message = {
        id: `msg-${Date.now()}-ai-error`,
        content: 'Maaf, aku sedang mengalami gangguan teknis. Tapi aku tetap di sini untukmu, Aima. Coba lagi dalam beberapa saat, ya. 💙',
        sender: 'ai',
        timestamp: new Date(),
      };

      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId
          ? {
              ...conv,
              messages: [...conv.messages, errorResponse],
              updatedAt: new Date(),
            }
          : conv
      ));
    } finally {
      setIsLoading(false);
      console.log('✅ Loading state deactivated');
    }
  }, [activeConversationId, conversations, convertToOpenRouterMessages, openRouterService, updateConversationTitle]);

  const createConversation = useCallback(() => {
    console.log('➕ Creating new conversation');
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: `Percakapan ${conversations.length + 1}`,
      messages: [
        {
          id: `msg-${Date.now()}`,
          content: 'Hei, Aima! Aku Oliv, siap mendengarkan dan membantu. Ada yang ingin kamu ceritakan hari ini?',
          sender: 'ai',
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    console.log('✅ New conversation created:', newConversation.id);
  }, [conversations.length]);

  const selectConversation = useCallback((id: string) => {
    console.log('🔄 Selecting conversation:', id);
    setActiveConversationId(id);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    console.log('🗑️ Deleting conversation:', id);
    setConversations(prev => {
      const filtered = prev.filter(conv => conv.id !== id);
      
      // If we deleted the active conversation, select another one
      if (id === activeConversationId) {
        const remaining = filtered;
        if (remaining.length > 0) {
          setActiveConversationId(remaining[0].id);
          console.log('✅ Switched to conversation:', remaining[0].id);
        } else {
          // Create a new conversation if none exist
          const newConv: Conversation = {
            id: `conv-${Date.now()}`,
            title: 'Percakapan 1',
            messages: [
              {
                id: `msg-${Date.now()}`,
                content: 'Hei, Aima! Aku Oliv, siap mendengarkan dan membantu. Ada yang ingin kamu ceritakan hari ini?',
                sender: 'ai',
                timestamp: new Date(),
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setActiveConversationId(newConv.id);
          console.log('✅ Created new conversation after delete:', newConv.id);
          return [newConv];
        }
      }
      
      return filtered;
    });
  }, [activeConversationId]);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    sendMessage,
    createConversation,
    selectConversation,
    deleteConversation,
    isLoading,
  };
};