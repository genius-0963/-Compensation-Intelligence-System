import * as React from "react"
import { cn } from "@/lib/utils"

export interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex space-x-1 border-b border-slate-800", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors relative",
            activeTab === tab.id 
              ? "text-slate-50" 
              : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 rounded-t-md"
          )}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500" />
          )}
        </button>
      ))}
    </div>
  );
}
