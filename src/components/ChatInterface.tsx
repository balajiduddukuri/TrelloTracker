import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X, MessageSquare, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { ChatMessage, NormalizedTask } from '../types';

interface ChatInterfaceProps {
  tasks: NormalizedTask[];
  onClose: () => void;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function ChatInterface({ tasks, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // Build context from tasks
      const taskContext = tasks.map(t => ({
        id: t.id,
        title: t.title,
        status: t.listName,
        due: t.due ? new Date(t.due).toLocaleDateString() : 'No due date',
        overdue: t.isOverdue,
        stale: t.isStale,
        unassigned: t.isUnassigned,
        labels: t.labels.map(l => l.name || l.color).join(', ')
      }));

      const systemInstruction = `
        You are a Trello Task Intelligence Assistant. 
        Current Task Data: ${JSON.stringify(taskContext)}
        
        Your Goal: Help the user manage their Trello workflow.
        You can:
        1. Summarize the backlog.
        2. Identify urgent or overdue tasks.
        3. Suggest which tasks to prioritize.
        4. Answer specific questions about the data provided.
        
        Keep responses concise, professional, and helpful. Use markdown for lists or bold text.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: `System Context: ${systemInstruction}` }] },
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
          { role: 'user', parts: [{ text: inputValue }] }
        ]
      });

      const assistantMessage: ChatMessage = {
        role: 'model',
        content: response.text || "I couldn't generate a response. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'model',
        content: "Sorry, I'm having trouble connecting to my brain right now. Check your API key or connection.",
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-[var(--border)] z-[60] flex flex-col"
    >
      <header className="p-6 border-b border-[var(--border)] bg-indigo-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-bold text-sm uppercase tracking-widest">Task Intelligence</h2>
            <div className="text-[10px] opacity-80 font-mono">Gemini AI Model Enabled</div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
          <X size={20} />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-8">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
               <Bot size={32} />
            </div>
            <h3 className="font-bold text-slate-800">Ask your AI Assistant</h3>
            <p className="text-sm text-slate-500">
              I can analyze your Trello backlog, find blockers, and help you decide what to do next.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {['Show overdue tasks', 'Summarize boards', 'What is urgent?'].map(seed => (
                <button
                  key={seed}
                  onClick={() => {
                    setInputValue(seed);
                  }}
                  className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-all"
                >
                  {seed}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-indigo-600 text-white'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                  msg.role === 'user' ? 'bg-white border text-slate-700' : 'bg-indigo-50 border border-indigo-100 text-indigo-900'
                }`}>
                  <div className="prose prose-sm prose-indigo">
                    {msg.content}
                  </div>
                  <div className="mt-2 text-[10px] font-bold opacity-40 uppercase tracking-tighter">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                 <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-[var(--border)]">
        <div className="flex gap-2 bg-slate-50 border rounded-xl p-1 pr-2 items-center focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <input
            type="text"
            placeholder="Ask anything..."
            className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm placeholder:text-slate-300"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || loading}
            className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
