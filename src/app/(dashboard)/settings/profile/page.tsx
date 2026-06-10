"use client";

import React, { useState, useEffect } from 'react';
import { Camera, Check, Trash2, Loader2, Save, LogOut, User } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Card } from "@/components/ui/card";

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    fetch('/api/user/profile').then(r => r.json()).then(d => {
      if (d.success) setProfile(d.data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (data.success) setProfile(data.data);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setProfile({ ...profile, avatarUrl: data.data.avatarUrl });
      }
    } catch (e) {
      console.error(e);
    }
    setAvatarUploading(false);
  };

  const handleAvatarRemove = async () => {
    setAvatarUploading(true);
    try {
      const res = await fetch('/api/user/avatar', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProfile({ ...profile, avatarUrl: data.data.avatarUrl });
      }
    } catch (e) {
      console.error(e);
    }
    setAvatarUploading(false);
  };

  if (loading) {
    return <div className="p-20 text-center text-muted-foreground animate-pulse font-black uppercase tracking-widest">Loading Profile...</div>;
  }

  return (
    <Card className="p-10 border-none shadow-sm bg-card min-h-[600px] animate-fade-up transition-colors">
      <div className="space-y-10">
        
        {/* Profile Picture Section */}
        <div className="flex items-center gap-8">
          <div className="relative">
            {avatarUploading ? (
              <div className="h-24 w-24 rounded-[32px] bg-muted flex items-center justify-center shadow-lg">
                <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
              </div>
            ) : profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Profile Picture" className="h-24 w-24 rounded-[32px] object-cover shadow-lg bg-card" />
            ) : (
              <div className="h-24 w-24 rounded-[32px] bg-muted flex items-center justify-center shadow-lg">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
            
            <label className="absolute -bottom-1 -right-1 h-8 w-8 bg-card border border-border rounded-xl flex items-center justify-center text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 shadow-md transition-all cursor-pointer">
              <Camera className="h-4 w-4" />
              <input type="file" accept="image/png, image/jpeg, image/webp, image/avif" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
          <div>
            <h3 className="text-xl font-black text-foreground">{profile?.name || "User"}</h3>
            <p className="text-sm text-muted-foreground font-medium">{profile?.currentCompany ? `${profile?.level || 'Engineer'} @ ${profile.currentCompany}` : profile?.email}</p>
            <div className="flex flex-wrap gap-2 mt-4">
               {profile?.avatarUrl && (
                  <button onClick={handleAvatarRemove} className="px-3 py-1.5 bg-red-50 dark:bg-red-950/40 text-red-600 text-[10px] font-black uppercase tracking-widest rounded flex items-center gap-1 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                     <Trash2 className="h-3 w-3" /> Remove Picture
                  </button>
               )}
               <button onClick={() => signOut({ callbackUrl: '/login' })} className="px-3 py-1.5 bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest rounded flex items-center gap-1 hover:bg-muted/80 hover:text-foreground transition-colors">
                  <LogOut className="h-3 w-3" /> Sign Out
               </button>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
            <input 
              type="text" 
              value={profile?.name || ''} 
              onChange={e => setProfile({...profile, name: e.target.value})}
              className="w-full h-12 bg-background border border-border rounded-xl px-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              value={profile?.email || ''} 
              onChange={e => setProfile({...profile, email: e.target.value})}
              className="w-full h-12 bg-background border border-border rounded-xl px-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Current Company</label>
            <input 
              type="text" 
              value={profile?.currentCompany || ''} 
              onChange={e => setProfile({...profile, currentCompany: e.target.value})}
              className="w-full h-12 bg-background border border-border rounded-xl px-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Years of Experience</label>
            <input 
              type="number" 
              step="0.5"
              value={profile?.yearsExperience || ''} 
              onChange={e => setProfile({...profile, yearsExperience: e.target.value})}
              className="w-full h-12 bg-background border border-border rounded-xl px-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Location</label>
            <input 
              type="text" 
              value={profile?.location || ''} 
              onChange={e => setProfile({...profile, location: e.target.value})}
              className="w-full h-12 bg-background border border-border rounded-xl px-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Bio</label>
            <input 
              type="text" 
              value={profile?.bio || ''} 
              onChange={e => setProfile({...profile, bio: e.target.value})}
              className="w-full h-12 bg-background border border-border rounded-xl px-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm" 
              placeholder="Short professional bio..."
            />
          </div>
        </div>

        <div className="pt-10 border-t border-border flex items-center justify-end">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="h-12 px-10 bg-foreground text-background rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-foreground/90 transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </Card>
  );
}
