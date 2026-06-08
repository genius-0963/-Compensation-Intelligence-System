'use client';

import React, { useState, useEffect } from 'react';
import AdvisorSidebar from './AdvisorSidebar';
import AdvisorWorkspace from './AdvisorWorkspace';

export default function AdvisorLayout() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/advisor/conversations');
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNewConversation = () => {
    setActiveConversationId(null);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  return (
    <div className="flex w-full h-full overflow-hidden text-slate-100">
      {/* LEFT PANEL: 320px wide */}
      <AdvisorSidebar 
        conversations={conversations} 
        activeId={activeConversationId}
        onSelect={handleSelectConversation}
        onNew={handleNewConversation}
        onRefresh={fetchConversations}
      />

      {/* RIGHT PANEL: Workspace */}
      <div className="flex-1 flex flex-col h-full bg-slate-950">
        <AdvisorWorkspace 
          conversationId={activeConversationId} 
          onConversationUpdated={(id) => {
             if (id) {
               setActiveConversationId(id);
             }
             fetchConversations();
          }}
        />
      </div>
    </div>
  );
}
