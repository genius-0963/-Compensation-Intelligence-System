'use client';

import React, { useState } from 'react';
import { Sparkles, X, Send, BrainCircuit, Command } from 'lucide-react';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative h-14 w-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-110 active:scale-95 animate-fade-up"
        >
          <Sparkles className="h-6 w-6" />
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 border-2 border-white rounded-full" />
        </button>
      ) : (
        <div className="w-[380px] h-[500px] bg-card border border-border rounded-3xl shadow-premium flex flex-col overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="p-5 border-b border-border flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Assistant</h3>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-card hover:text-slate-400 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <div className="p-3 bg-[#0B1020] border border-border rounded-2xl rounded-tl-none">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Hi AD! I'm your AI Workspace Assistant. How can I help you build today?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {['Deploy Project', 'Fix Bugs', 'Write Test', 'Optimize Comp'].map((text) => (
                <button 
                  key={text}
                  className="p-2 text-[11px] font-medium text-slate-400 border border-border rounded-xl hover:border-blue-200 hover:bg-[#1E3A8A]/50 transition-all"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-5 border-t border-border bg-gray-50/50">
            <div className="relative">
              <input 
                type="text"
                placeholder="Ask anything..."
                className="w-full h-12 bg-card border border-border rounded-2xl pl-4 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-sm">
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-center gap-1 text-[10px] text-gray-400 font-medium">
              <Command className="h-2.5 w-2.5" />
              <span>Enter to send</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
