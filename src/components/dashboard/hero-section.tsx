'use client';

import React from 'react';
import { Search, Plus, Upload, Zap, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative py-20 px-4 flex flex-col items-center text-center overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] bg-[#1E3A8A]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[10%] w-[300px] h-[300px] bg-indigo-50/50 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-up">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">AI Workspace v2.0 is live</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Build Faster. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Deploy Smarter.</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
          The AI-powered development workspace for modern teams. <br className="hidden md:block" />
          Scale your infrastructure with pixel-perfect precision.
        </p>

        {/* Large Search/Action Input */}
        <div className="w-full max-w-2xl mx-auto relative group animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="absolute inset-0 bg-primary/5 blur-2xl group-focus-within:bg-primary/10 transition-all rounded-3xl" />
          <div className="relative flex items-center bg-card border border-border rounded-2xl shadow-premium p-2 focus-within:border-ring focus-within:ring-4 focus-within:ring-ring/20 transition-all">
            <Search className="ml-4 h-5 w-5 text-muted-foreground" />
            <input 
              type="text"
              placeholder="What do you want to build today?"
              className="flex-1 bg-transparent border-none focus:ring-0 text-foreground placeholder:text-muted-foreground px-4 h-12 text-lg"
            />
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg active:scale-95">
              Ask AI
            </button>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-xl text-sm font-bold text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm group">
            <Plus className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            <span>Create Project</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-xl text-sm font-bold text-foreground hover:border-indigo-200 hover:bg-indigo-50/50 transition-all shadow-sm group">
            <Upload className="h-4 w-4 text-indigo-600 group-hover:scale-110 transition-transform" />
            <span>Import Repo</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-xl text-sm font-bold text-foreground hover:border-amber-200 hover:bg-amber-50/50 transition-all shadow-sm group">
            <Zap className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
            <span>Deploy App</span>
          </button>
        </div>
      </div>
    </div>
  );
}
