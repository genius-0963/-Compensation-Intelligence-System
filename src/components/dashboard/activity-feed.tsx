'use client';

import React from 'react';
import { GitCommit, Zap, GitPullRequest, Plus, User, ArrowUpRight } from 'lucide-react';

export function ActivityFeed() {
  const activities = [
    {
      type: 'deploy',
      title: 'Production Deploy',
      project: 'AI Dashboard',
      time: '2m ago',
      user: 'Alex D.',
      icon: Zap,
      color: 'text-amber-500 bg-amber-50',
    },
    {
      type: 'commit',
      title: 'Fixed auth middleware bug',
      project: 'Mobile App API',
      time: '15m ago',
      user: 'Sarah K.',
      icon: GitCommit,
      color: 'text-indigo-500 bg-indigo-50',
    },
    {
      type: 'pr',
      title: 'feat: Add workspace comparison',
      project: 'CompIntel Core',
      time: '1h ago',
      user: 'Alex D.',
      icon: GitPullRequest,
      color: 'text-blue-500 bg-blue-50',
    },
    {
      type: 'project',
      title: 'Created new project',
      project: 'Analytics Engine',
      time: '3h ago',
      user: 'Mike R.',
      icon: Plus,
      color: 'text-emerald-500 bg-emerald-50',
    },
  ];

  return (
    <div className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
          <p className="text-sm text-gray-500 mt-1">Track updates across all projects and team members.</p>
        </div>
        <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">View Audit Log</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities.map((item, i) => (
          <div 
            key={i}
            className="group bg-white border border-gray-100 rounded-[24px] p-5 hover:shadow-premium transition-all hover:-translate-y-1 flex items-start gap-4"
          >
            <div className={`h-12 w-12 rounded-2xl ${item.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
              <item.icon className="h-6 w-6" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-gray-900 truncate pr-4">{item.title}</h4>
                <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{item.time}</span>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                in <span className="font-bold text-gray-700">{item.project}</span>
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="h-3 w-3 text-gray-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">{item.user}</span>
                </div>
                <button className="text-gray-400 hover:text-blue-600 transition-colors">
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
