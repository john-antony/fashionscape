import React, { createContext, useContext } from 'react';
import { useChat as useChatHook } from 'ai/react'; // Import useChat from ai/react

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { messages, ...chatHook } = useChatHook({
    api: 'http://localhost:3001/chat-stream',
  });

  return (
    <ChatContext.Provider value={{ messages, ...chatHook }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
