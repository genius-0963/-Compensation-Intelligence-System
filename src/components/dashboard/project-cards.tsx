'use client';

import React from 'react';
import { MoreHorizontal, Activity, Users, Globe, ExternalLink, GitCommit, Plus } from 'lucide-react';

export function ProjectCards() {
  const projects = [
    {
      name: 'AI Dashboard',
      stack: ['React', 'Node.js', 'PostgreSQL'],
      performance: 98,
      status: 'Live',
      members: 12,
      lastDeploy: '2m ago',
      color: 'bg-emerald-500',
    },
    {
      name: 'Mobile App API',
      stack: ['Go', 'Redis', 'AWS'],
      performance: 94,
      status: 'Staging',
      members: 5,
      lastDeploy: '1h ago',
      color: 'bg-amber-500',
    },
    {
      name: 'E-commerce Core',
      stack: ['Next.js', 'Shopify', 'Tailwind'],
      performance: 99,
      status: 'Live',
      members: 24,
      lastDeploy: '15m ago',
      color: 'bg-emerald-500',
    },
    {
      name: 'Analytics Engine',
      stack: ['Python', 'Rust', 'Kafka'],
      performance: 82,
      status: 'Building',
      members: 8,
      lastDeploy: 'Now',
      color: 'bg-blue-500',
    },
    {
      name: 'Customer Portal',
      stack: ['Vue', 'Express', 'MongoDB'],
      performance: 91,
      status: 'Live',
      members: 3,
      lastDeploy: '5h ago',
      color: 'bg-emerald-500',
    },
    {
      name: 'Marketing Site',
      stack: ['Astro', 'Contentful'],
      performance: 100,
      status: 'Live',
      members: 2,
      lastDeploy: '1d ago',
      color: 'bg-emerald-500',
    },
  ];

  return (
    <div className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Active Projects</h2>
          <p className="text-sm text-muted-foreground mt-1">Real-time status of your deployed infrastructure.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                U{i}
              </div>
            ))}
          </div>
          <button className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {projects.map((project, i) => (
          <div 
            key={i}
            className="group bg-card border border-border shadow-sm rounded-2xl p-4 md:p-6 hover:shadow-premium transition-all hover:scale-[1.01] flex flex-wrap items-center justify-between gap-6"
          >
            {/* Project Identity */}
            <div className="flex items-center gap-4 min-w-[240px]">
              <div className={`h-12 w-12 rounded-xl ${project.color} flex items-center justify-center text-white shadow-lg shadow-gray-200`}>
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{project.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {project.stack.map((s, si) => (
                    <span key={si} className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Metric */}
            <div className="flex flex-col items-center px-8 border-x border-border">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Performance</span>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-black text-foreground">{project.performance}</div>
                <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${project.performance > 90 ? 'bg-emerald-500' : project.performance > 80 ? 'bg-blue-500' : 'bg-amber-500'}`}
                    style={{ width: `${project.performance}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Deployment Status */}
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted border border-border">
                  <div className={`h-1.5 w-1.5 rounded-full ${project.status === 'Live' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{project.status}</span>
                </div>
                <div className="flex items-center gap-1 mt-1.5 text-[11px] text-muted-foreground">
                  <GitCommit className="h-3 w-3" />
                  <span>{project.lastDeploy}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-lg text-[11px] font-bold text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {project.members}
                </div>
                <button className="h-10 w-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                  <ExternalLink className="h-4 w-4" />
                </button>
                <button className="h-10 w-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted transition-all">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
