import React, { createContext, useContext, useEffect } from 'react';
import { useChat as useChatHook } from 'ai/react'; // Import useChat from ai/react
import { useUser } from './UserContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { messages, setMessages, ...chatHook } = useChatHook({
    api: 'http://localhost:3001/chat-stream',
  });

  const { user } = useUser();

  useEffect(() => {
    // Clear messages when user logs out
    if (!user) {
      setMessages([]);
    }

    setMessages([]);
  }, [user, setMessages]);

  return (
    <ChatContext.Provider value={{ messages, ...chatHook }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
