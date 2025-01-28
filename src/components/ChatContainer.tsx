// ChatContainer.tsx
import { useState, useRef, memo, useCallback } from 'react';
import { Send } from 'lucide-react';
import { sendChatMessage } from '../services/api';
import ReactMarkdown from 'react-markdown';

interface Message {
  text: string;
  isUser: boolean;
}

// Chat message component
interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

const ChatMessage = memo(({ message, isUser }: ChatMessageProps) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-[80%] p-3 rounded-lg ${
      isUser ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-200'
    }`}>
      {isUser ? (
        message
      ) : (
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
              h1: ({ children }) => <h1 className="text-xl font-bold mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-bold mb-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-md font-bold mb-2">{children}</h3>,
              ul: ({ children }) => <ul className="list-disc pl-4 mb-4 space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 mb-4 space-y-2">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
              em: ({ children }) => <em className="italic text-blue-300">{children}</em>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 my-4 text-slate-300">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-slate-800 px-1 py-0.5 rounded text-blue-300">
                  {children}
                </code>
              ),
            }}
          >
            {message}
          </ReactMarkdown>
        </div>
      )}
    </div>
  </div>
));

interface ChatContainerProps {
  tokenAddress?: string;
  requestId?: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatContainer = ({ tokenAddress, requestId, messages, setMessages }: ChatContainerProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || !tokenAddress || !requestId) return;
  
    const newUserMessage: Message = { text: inputMessage, isUser: true };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    
    const currentMessage = inputMessage;
    setInputMessage('');

    try {
      const response = await sendChatMessage(
        currentMessage,
        tokenAddress,
        requestId
      );
      
      const newBotMessage: Message = { text: response.response, isUser: false };
      setMessages(prevMessages => [...prevMessages, newBotMessage]);
    } catch (error) {
      const errorMessage: Message = {
        text: "Sorry, I encountered an error processing your request. Please try again.",
        isUser: false
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      console.error('Chat error:', error);
    }
    
    if (chatContainerRef.current) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [inputMessage, tokenAddress, requestId, setMessages]);

  return (
    <div className="flex-1 border-t border-slate-700 flex flex-col">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
        style={{ maxHeight: 'calc(80vh - 400px)', overflowY: 'auto' }}
      >
        {messages.map((msg, idx) => (
          <ChatMessage 
            key={idx} 
            message={msg.text}
            isUser={msg.isUser} 
          />
        ))}
      </div>
      <div className="p-4 border-t border-slate-700 bg-slate-800/30">
        <div className="flex gap-2">
          <input 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            type="text"
            placeholder="Ask about this token..."
            className="flex-1 bg-slate-800/50 text-slate-300 py-2 px-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
            disabled={!requestId || !tokenAddress}
          />
          <button 
            onClick={handleSendMessage}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!inputMessage.trim() || !requestId || !tokenAddress}
          >
            <Send size={20} />
          </button>
        </div>
        {!requestId && (
          <p className="text-sm text-slate-400 mt-2">Waiting for analysis to complete...</p>
        )}
      </div>
    </div>
  );
};

export default memo(ChatContainer);