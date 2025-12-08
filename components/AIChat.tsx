import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatWithConcierge, getServiceRecommendations } from '../services/geminiService';

interface AIChatProps {
  onRecommendCategory: (categoryId: string) => void;
}

export const AIChat: React.FC<AIChatProps> = ({ onRecommendCategory }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: '¡Hola! Soy tu asistente Hero 🤖. ¿Qué necesitas solucionar hoy? (ej. "Se rompió una tubería" o "Necesito un corte de pelo")',
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setIsLoading(true);

    // Add user message
    const newMessages = [...messages, { id: Date.now().toString(), role: 'user', text: userText } as ChatMessage];
    setMessages(newMessages);

    // Parallel execution: Get Chat response AND Structured recommendation
    try {
      // Convert history for API
      const history = newMessages
        .filter(m => m.id !== '1') // skip intro
        .map(m => ({ role: m.role, parts: [{ text: m.text }] }));

      const [chatResponse, recommendation] = await Promise.all([
        chatWithConcierge(history, userText),
        getServiceRecommendations(userText)
      ]);

      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'model', text: chatResponse || "Lo siento, no pude procesar eso." }
      ]);

      if (recommendation && recommendation.category !== 'other') {
        // Add a special system message with a button
        setMessages(prev => [
          ...prev,
          { 
            id: (Date.now() + 2).toString(), 
            role: 'model', 
            text: `💡 He encontrado servicios de "${recommendation.category}" para ti. ${recommendation.advice}`,
            isThinking: true // abusing this prop to trigger action UI
          }
        ]);
        
        // Auto-redirect effect could happen here, but we'll let the user decide or just filter contextually
        // For this demo, let's auto-filter if the confidence is high? No, let's show a button.
        onRecommendCategory(recommendation.category);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), role: 'model', text: "Tuve un error de conexión. Intenta de nuevo." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mx-2 ${msg.role === 'user' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-brand-100 dark:bg-brand-900'}`}>
                {msg.role === 'user' ? <UserIcon size={16} className="text-gray-600 dark:text-gray-300" /> : <Bot size={16} className="text-brand-600 dark:text-brand-400" />}
              </div>
              
              <div
                className={`p-3 rounded-2xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700 rounded-tl-none'
                }`}
              >
                {msg.text}
                {msg.isThinking && (
                   <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                     <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                       <Sparkles size={12} className="text-yellow-500"/> Recomendación aplicada al filtro.
                     </span>
                   </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-center p-4">
             <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2 border border-gray-100 dark:border-gray-700">
                <Loader2 size={16} className="animate-spin text-brand-600 dark:text-brand-400" />
                <span className="text-xs text-gray-400">Pensando...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full focus-within:ring-2 focus-within:ring-brand-500 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe tu problema..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 dark:text-white placeholder-gray-400"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-brand-600 rounded-full text-white disabled:opacity-50 hover:bg-brand-700 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};