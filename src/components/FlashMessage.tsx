import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface FlashMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface FlashMessageProps {
  message: FlashMessage;
  onClose: (id: string) => void;
}

const FlashMessageComponent: React.FC<FlashMessageProps> = ({ message, onClose }) => {
  const { id, type, title, message: text, duration = 5000 } = message;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-400" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-400" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-yellow-400" />;
      case 'info':
        return <Info className="h-6 w-6 text-blue-400" />;
      default:
        return <Info className="h-6 w-6 text-blue-400" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500/10 border-green-500/30',
          text: 'text-green-300',
          title: 'text-green-100'
        };
      case 'error':
        return {
          bg: 'bg-red-500/10 border-red-500/30',
          text: 'text-red-300',
          title: 'text-red-100'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/10 border-yellow-500/30',
          text: 'text-yellow-300',
          title: 'text-yellow-100'
        };
      case 'info':
        return {
          bg: 'bg-blue-500/10 border-blue-500/30',
          text: 'text-blue-300',
          title: 'text-blue-100'
        };
      default:
        return {
          bg: 'bg-blue-500/10 border-blue-500/30',
          text: 'text-blue-300',
          title: 'text-blue-100'
        };
    }
  };

  const colors = getColors();

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative max-w-sm w-full ${colors.bg} backdrop-blur-xl border rounded-xl shadow-2xl p-4`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-semibold ${colors.title}`}>
            {title}
          </h3>
          <p className={`text-sm ${colors.text} mt-1`}>
            {text}
          </p>
        </div>
        <button
          onClick={() => onClose(id)}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {/* Barre de progression */}
      {duration > 0 && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-gold-500 to-gold-300 rounded-b-xl"
        />
      )}
    </motion.div>
  );
};

export default FlashMessageComponent;