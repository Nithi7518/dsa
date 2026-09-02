import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../api/apiClient';
import { Bot, User, Send, Loader2, Sparkles } from 'lucide-react';

const TutorChatPanel = ({ problemId, currentCode, selectedLanguage }) => {
  const [messages, setMessages] = useState([
    { role: 'tutor', content: "Hi! I'm your AI DSA tutor. Get stuck? Just ask for a hint, or when you finish, ask me to check your optimization!" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (overrideMessage = null) => {
    const messageToSend = overrideMessage || inputValue.trim();
    if (!messageToSend || isLoading) return;

    const newMessages = [...messages, { role: 'user', content: messageToSend }];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(problemId, {
        code: currentCode,
        language: selectedLanguage,
        message: messageToSend
      });
      setMessages([...newMessages, { role: 'tutor', content: response.reply }]);
    } catch (err) {
      console.error("Chat failed", err);
      setMessages([...newMessages, { role: 'tutor', content: "Sorry, I'm having trouble connecting to my brain right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-800 font-medium">
          <Bot className="w-5 h-5" />
          Conversational Tutor
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-sm' 
                : 'bg-gray-100 text-gray-800 rounded-tl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-500 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-100 bg-gray-50 space-y-2">
        <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
          <button 
            onClick={() => handleSend("How should I proceed?")}
            className="flex-shrink-0 text-xs px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-gray-600 transition-colors"
          >
            How to proceed?
          </button>
          <button 
            onClick={() => handleSend("Can you review my time and space optimization?")}
            className="flex-shrink-0 text-xs px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-gray-600 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-500" /> Optimize
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorChatPanel;
