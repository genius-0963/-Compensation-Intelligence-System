'use client';

import React, { useRef, useEffect } from 'react';
import { UIMessage } from 'ai';
import { getTextFromUIMessage } from '@/lib/ui-message';
import { User, Sparkles, Loader2, Database } from 'lucide-react';

type DbMessage = {
  id: string;
  role: string;
  content: string;
  metadata?: { data?: unknown };
};

type DisplayMessage = UIMessage | DbMessage;

interface MessageListProps {
  messages: UIMessage[];
  dbMessages: DbMessage[];
  isLoading: boolean;
}

export default function MessageList({ messages, dbMessages, isLoading }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [messages, dbMessages]);

  // Combine UI messages with DB messages if we are viewing history.
  // When active chat is running, `messages` takes precedence.
  const displayMessages: DisplayMessage[] =
    messages.length > 0 ? messages : dbMessages;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20" ref={scrollRef}>
      {displayMessages.map((msg, idx) => (
        <div key={msg.id || idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          {msg.role !== 'user' && (
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              msg.role === 'data' ? 'bg-slate-800 text-slate-400' : 'bg-violet-600 shadow-[0_0_15px_rgba(139,92,246,0.3)] text-white'
            }`}>
              {msg.role === 'data' ? <Database size={16} /> : <Sparkles size={16} />}
            </div>
          )}
          
          <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
            msg.role === 'user' 
              ? 'bg-slate-800 text-slate-100 rounded-tr-none border border-slate-700' 
              : msg.role === 'data'
              ? 'bg-transparent border border-slate-800 w-full rounded-tl-none font-mono text-xs text-emerald-400'
              : 'bg-transparent border border-slate-800/50 text-slate-300 rounded-tl-none'
          }`}>
            {msg.role === 'data' && 'metadata' in msg && msg.metadata?.data ? (
              <pre className="overflow-x-auto p-2">
                {JSON.stringify(msg.metadata.data, null, 2)}
              </pre>
            ) : (
              getTextFromUIMessage(msg)
            )}
          </div>

          {msg.role === 'user' && (
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-400">
              <User size={16} />
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-4 justify-start">
          <div className="w-8 h-8 rounded-lg bg-violet-600 shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center justify-center shrink-0 text-white">
            <Sparkles size={16} />
          </div>
          <div className="max-w-[80%] rounded-2xl p-4 bg-transparent border border-slate-800 text-slate-400 rounded-tl-none flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" /> Analyzing data...
          </div>
        </div>
      )}
    </div>
  );
}
