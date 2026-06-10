"use client";

import React from 'react';
import { useChat } from '@ai-sdk/react';
import { Bot, Send, User } from 'lucide-react';

export default function AILocationAdvisor({ locationContext }: { locationContext: any }) {
  const [input, setInput] = React.useState('');
  
  const { messages, sendMessage, status } = useChat({
    // @ts-ignore
    api: '/api/ai/location-advisor',
    body: {
      locationContext
    }
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    // @ts-ignore
    sendMessage({ role: 'user', content: input });
    setInput('');
  };

  return (
    <div className="flex flex-col h-[500px] bg-[#1F2937] rounded-xl overflow-hidden border border-border/50 shadow-lg mt-4">
      <div className="p-4 bg-card border-b border-border/50 flex items-center gap-3">
        <div className="bg-blue-500/20 p-2 rounded-lg">
           <Bot className="h-5 w-5 text-blue-500" />
        </div>
        <div>
           <h3 className="text-sm font-black text-white">AI Location Advisor</h3>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Powered by Gemini</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-10">
            Ask me anything about relocating to {locationContext.city}.
          </div>
        )}
        {messages.map((m: any) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-card text-gray-300 rounded-bl-none border border-border/50'}`}>
              <div className="flex items-center gap-2 mb-1 opacity-70">
                 {m.role === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                 <span className="text-[10px] font-bold uppercase">{m.role}</span>
              </div>
              <div className="leading-relaxed whitespace-pre-wrap">{m.parts ? (m.parts as any).map((p: any) => p.text).join('') : (m.content as string)}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-card text-gray-400 p-3 rounded-2xl rounded-bl-none border border-border/50 flex gap-1 items-center">
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" />
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
             </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 bg-card border-t border-border/50 flex gap-2">
        <input 
          value={input} 
          onChange={handleInputChange} 
          placeholder={`e.g. Should I move to ${locationContext.city}?`} 
          className="flex-1 bg-[#1F2937] border border-border/50 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button disabled={isLoading || !input.trim()} type="submit" className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2 rounded-xl transition-colors">
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
