"use client";

import React, { useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Send, BrainCircuit, User } from "lucide-react";

export function ChatInterface() {
  const { messages, sendMessage, status } = useChat();
  
  const isLoading = status === 'submitted' || status === 'streaming';
  
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-card border border-border rounded-3xl shadow-premium overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border flex items-center gap-3 bg-gray-50/50">
        <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
          <BrainCircuit className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">AI Compensation Advisor</h2>
          <p className="text-xs text-slate-500">Expert guidance on market trends, leveling, and offers</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-slate-500">
            <BrainCircuit className="h-12 w-12 text-gray-300" />
            <div>
              <p className="font-medium text-gray-700">How can I help you today?</p>
              <p className="text-sm">Ask about your current compensation, market rates, or negotiation strategies.</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  message.role === "user"
                    ? "bg-[#111827] text-slate-400"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {message.role === "user" ? (
                  <User className="h-5 w-5" />
                ) : (
                  <BrainCircuit className="h-5 w-5" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-[#1F2937] text-white rounded-tr-none"
                    : "bg-[#0B1020] border border-border text-white rounded-tl-none whitespace-pre-wrap"
                }`}
              >
                {message.parts?.map((part, index) => 
                  part.type === 'text' ? <span key={index}>{part.text}</span> : null
                )}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex gap-4">
             <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <BrainCircuit className="h-5 w-5 animate-pulse" />
             </div>
             <div className="p-4 bg-[#0B1020] border border-border rounded-2xl rounded-tl-none text-gray-400 text-sm">
                Thinking...
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-5 border-t border-border bg-card">
        <form onSubmit={handleSubmit} className="relative flex items-center max-w-4xl mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about market data for Level 5 Engineers..."
            className="w-full h-14 bg-[#0B1020] border border-border rounded-2xl pl-5 pr-14 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
