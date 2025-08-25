import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import FlashMessageComponent, { FlashMessage } from '../components/FlashMessage';

interface FlashContextType {
  showMessage: (message: Omit<FlashMessage, 'id'>) => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
}

const FlashContext = createContext<FlashContextType | undefined>(undefined);

export const useFlash = () => {
  const context = useContext(FlashContext);
  if (context === undefined) {
    throw new Error('useFlash must be used within a FlashProvider');
  }
  return context;
};

export const FlashProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<FlashMessage[]>([]);

  const removeMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  const showMessage = useCallback((message: Omit<FlashMessage, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newMessage: FlashMessage = { ...message, id };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const showSuccess = useCallback((title: string, message: string) => {
    showMessage({ type: 'success', title, message });
  }, [showMessage]);

  const showError = useCallback((title: string, message: string) => {
    showMessage({ type: 'error', title, message });
  }, [showMessage]);

  const showWarning = useCallback((title: string, message: string) => {
    showMessage({ type: 'warning', title, message });
  }, [showMessage]);

  const showInfo = useCallback((title: string, message: string) => {
    showMessage({ type: 'info', title, message });
  }, [showMessage]);

  const value = {
    showMessage,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <FlashContext.Provider value={value}>
      {children}
      
      {/* Container pour les messages flash */}
      <div className="fixed top-20 right-4 z-[9999] space-y-4 pointer-events-none">
        <AnimatePresence>
          {messages.map((message) => (
            <div key={message.id} className="pointer-events-auto">
              <FlashMessageComponent
                message={message}
                onClose={removeMessage}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </FlashContext.Provider>
  );
};