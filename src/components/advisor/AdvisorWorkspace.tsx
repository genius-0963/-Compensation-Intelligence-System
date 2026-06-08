'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from "ai";
import { Sparkles, Send, Paperclip, BarChart3, TrendingUp, Scale, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MessageList from './MessageList';

interface WorkspaceProps {
  conversationId: string | null;
  onConversationUpdated: (id: string | null) => void;
}

export default function AdvisorWorkspace({ conversationId, onConversationUpdated }: WorkspaceProps) {
  const [mode, setMode] = useState('GENERAL');
  const [dbConversation, setDbConversation] = useState<any>(null);

  const onConversationUpdatedRef = useRef(onConversationUpdated);
  const awaitingConversationIdRef = useRef(false);

  useEffect(() => {
    onConversationUpdatedRef.current = onConversationUpdated;
  }, [onConversationUpdated]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/advisor/chat",
        fetch: async (input, init) => {
          const response = await globalThis.fetch(input, init);
          const newConversationId = response.headers.get("x-conversation-id");

          if (newConversationId && awaitingConversationIdRef.current) {
            awaitingConversationIdRef.current = false;
            onConversationUpdatedRef.current(newConversationId);
          }

          return response;
        },
      }),
    []
  );

  const [input, setInput] = useState("");
  const { messages, sendMessage, setMessages, status } = useChat({
    transport,
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    if (!conversationId) {
      setDbConversation(null);
      setMessages([]);
      setMode('GENERAL');
      return;
    }

    fetch(`/api/advisor/conversations/${conversationId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load conversation");
        return res.json();
      })
      .then((data) => {
        setDbConversation(data);
        setMode(data.mode ?? "GENERAL");
        const formatted = data.messages?.map((m: any) => ({
          id: m.id,
          role: m.role,
          parts: [
            {
              type: "text",
              text: m.content,
            },
          ],
        })) || [];
        setMessages(formatted);
      })
      .catch(console.error);
  }, [conversationId, setMessages]);

  const handleSpecializedSubmit = async (specialMode: string, payload: any) => {
    // specialized APIs generate structured object
    const res = await fetch('/api/advisor/specialized', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: specialMode, payload, conversationId: dbConversation?.id })
    });
    const data = await res.json();
    if (data.conversationId && !dbConversation?.id) {
      onConversationUpdated(data.conversationId);
    } else if (dbConversation?.id) {
      // trigger refresh
      onConversationUpdated(dbConversation.id);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!dbConversation?.id && !conversationId) {
      awaitingConversationIdRef.current = true;
    }

    await sendMessage(
      {
        text: input,
      },
      {
        body: {
          conversationId: dbConversation?.id ?? conversationId ?? null,
          mode,
        },
      }
    );

    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 relative">
      {/* Header */}
      <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            {dbConversation ? dbConversation.title : 'New AI Session'}
          </h1>
        </div>
        
        {/* Mode Selector */}
        <select 
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="bg-[#0B1020] border border-slate-800 text-slate-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-violet-500"
        >
          <option value="GENERAL">General Chat</option>
          <option value="OFFER_ANALYSIS">Offer Analysis</option>
          <option value="NEGOTIATION">Negotiation Strategy</option>
          <option value="CAREER_GROWTH">Career Growth</option>
          <option value="MARKET_BENCHMARK">Market Benchmark</option>
        </select>
      </div>

      {/* Main Area */}
      <div className="flex-1 overflow-hidden relative">
        {messages.length === 0 && !dbConversation ? (
          /* Empty State */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-violet-600/10 rounded-2xl flex items-center justify-center mb-6 border border-violet-500/20 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
              <Sparkles className="w-8 h-8 text-violet-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">How can I help you today?</h2>
            <p className="text-slate-400 mb-8">Ask about compensation, analyze offers, or plan your career growth.</p>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              {[
                { title: 'Analyze Offer', desc: 'Get a competitiveness score and insights', icon: BarChart3, m: 'OFFER_ANALYSIS' },
                { title: 'Career Growth', desc: 'Simulate promotion paths and comp', icon: TrendingUp, m: 'CAREER_GROWTH' },
                { title: 'Market Benchmark', desc: 'Compare roles across competitors', icon: Scale, m: 'MARKET_BENCHMARK' },
                { title: 'Negotiation', desc: 'Generate a strategic script and plan', icon: AlertTriangle, m: 'NEGOTIATION' },
              ].map(action => (
                <div 
                  key={action.title}
                  onClick={() => setMode(action.m)}
                  className="p-4 bg-[#0B1020] border border-slate-800 rounded-xl hover:border-violet-500/50 hover:bg-slate-800/50 cursor-pointer transition-all text-left group"
                >
                  <div className="flex items-center gap-2 mb-2 text-slate-200 font-medium">
                    <action.icon className="w-4 h-4 text-violet-400" /> {action.title}
                  </div>
                  <p className="text-sm text-slate-500">{action.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Messages Area */
          <div className="absolute inset-0 overflow-y-auto px-6 py-8">
            <MessageList 
              messages={messages} 
              dbMessages={dbConversation?.messages || []} 
              isLoading={isLoading} 
            />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 shrink-0">
        <div className="max-w-4xl mx-auto relative">
          <form onSubmit={handleChatSubmit} className="relative flex items-end bg-[#0B1020] border border-slate-800 rounded-2xl shadow-xl focus-within:border-violet-500/50 transition-colors p-2">
            
            <button type="button" className="p-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors">
              <Paperclip size={20} />
            </button>
            
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'GENERAL' ? "Ask about compensation, levels, offers..." : `Provide details for ${mode.replace(/_/g, ' ')}...`}
              className="flex-1 max-h-48 min-h-[44px] bg-transparent border-none text-slate-200 placeholder-slate-500 resize-none py-3 px-2 focus:ring-0 focus:outline-none"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleChatSubmit(e);
                }
              }}
            />
            
            <Button 
              type="submit"
              disabled={isLoading || !input.trim()} 
              className="p-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-all disabled:opacity-50 h-11 w-11 flex items-center justify-center shrink-0"
            >
              <ArrowUpRight size={20} />
            </Button>
          </form>
          <div className="text-center mt-3 text-xs text-slate-500">
            AI can make mistakes. Verify important compensation data using the Analytics and Compare tools.
          </div>
        </div>
      </div>
    </div>
  );
}
