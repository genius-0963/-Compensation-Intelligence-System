'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import useSWR from 'swr';
import Link from 'next/link';
import { User, Settings, LogOut, Shield } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function UserNav() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Fetch updated profile data from the database using SWR
  const { data: profile } = useSWR(session ? '/api/profile' : null, fetcher);

  const userName = profile?.name || session?.user?.name || "Alex Dawson";
  const userEmail = profile?.email || session?.user?.email || "";
  const userImage = profile?.image || session?.user?.image || null;
  const userRole = session?.user?.role || "USER";
  const userTitle = profile?.roleFamily || "Senior Software Engineer";

  const initials = 'AD'; // Deprecated in favor of generic icon

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Keyboard navigation & ESC key behavior
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Focus trap inside dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableElements = dropdownRef.current?.querySelectorAll(
        'a[href], button:not([disabled])'
      );
      if (!focusableElements || focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  // Focus the first link/button when dropdown is opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const firstFocusable = dropdownRef.current?.querySelector('a, button') as HTMLElement;
        firstFocusable?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSignOut = async () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      await signOut({ callbackUrl: '/login' });
    }
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="User navigation menu"
        className="flex items-center gap-3 pl-2 border-l border-border ml-1 group focus:outline-none cursor-pointer"
      >
        <div className="flex flex-col items-end hidden md:flex text-right select-none">
          <span className="text-xs font-black text-foreground leading-none group-hover:text-primary transition-colors">
            {userName}
          </span>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[9px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase tracking-widest">
              {userRole === 'ADMIN' ? 'Admin' : 'Pro Member'}
            </span>
          </div>
        </div>

        {/* Avatar image / initials */}
        <div className="h-9 w-9 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground group-hover:shadow-md transition-all overflow-hidden relative">
          {userImage ? (
            <img src={userImage} alt="Profile Picture" className="h-full w-full object-cover animate-fade-in" />
          ) : (
            <User className="h-4 w-4" />
          )}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Mobile bottom sheet overlay backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 md:hidden animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Container */}
          <div
            ref={dropdownRef}
            onKeyDown={handleKeyDown}
            role="menu"
            aria-orientation="vertical"
            className="
              fixed bottom-0 left-0 right-0 max-h-[85vh] rounded-t-3xl bg-popover border-t border-border p-6 z-50 shadow-2xl animate-slide-up
              md:absolute md:top-full md:bottom-auto md:left-auto md:right-0 md:w-[280px] md:rounded-xl md:border md:p-4 md:mt-2 md:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.08)] md:origin-top-right
              md:translate-y-0 md:opacity-100 md:pointer-events-auto md:scale-100 transition-all duration-200 ease-out
            "
          >
            {/* Grab bar indicator for bottom sheet on mobile */}
            <div className="h-1.5 w-12 bg-muted rounded-full mx-auto mb-6 md:hidden" />

            {/* Header section */}
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <div className="h-12 w-12 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground overflow-hidden shrink-0">
                {userImage ? (
                  <img src={userImage} alt="Profile Picture" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-6 w-6" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-black text-foreground truncate">
                  {userName}
                </h3>
                <p className="text-[11px] font-bold text-muted-foreground truncate mt-0.5">
                  {userTitle}
                </p>
                <div className="mt-1.5 flex">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-full">
                    ★ {userRole === 'ADMIN' ? 'Admin Access' : 'Pro Member'}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation options */}
            <div className="py-2 space-y-1">
              <Link
                href="/settings/profile"
                onClick={() => setIsOpen(false)}
                role="menuitem"
                className="flex items-center gap-3 px-3.5 py-3 md:py-2.5 rounded-xl text-xs font-black text-muted-foreground hover:text-foreground hover:bg-muted active:bg-accent transition-all duration-200 ease-in-out outline-none focus:bg-muted"
              >
                <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex-1 text-left">
                  <div>View Profile</div>
                  <div className="text-[9px] font-medium text-muted-foreground mt-0.5">Manage details and social links</div>
                </div>
              </Link>

              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                role="menuitem"
                className="flex items-center gap-3 px-3.5 py-3 md:py-2.5 rounded-xl text-xs font-black text-muted-foreground hover:text-foreground hover:bg-muted active:bg-accent transition-all duration-200 ease-in-out outline-none focus:bg-muted"
              >
                <Settings className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex-1 text-left">
                  <div>Account Settings</div>
                  <div className="text-[9px] font-medium text-muted-foreground mt-0.5">Preferences, billing, and privacy</div>
                </div>
              </Link>
            </div>

            {/* Logout panel */}
            <div className="pt-2 border-t border-border">
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleSignOut();
                }}
                role="menuitem"
                className="w-full flex items-center gap-3 px-3.5 py-3 md:py-2.5 rounded-xl text-xs font-black text-destructive hover:text-destructive hover:bg-destructive/10 active:bg-destructive/20 transition-all duration-200 ease-in-out outline-none focus:bg-destructive/10 cursor-pointer"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <div className="flex-1 text-left">
                  <div>Sign Out</div>
                  <div className="text-[9px] font-medium text-destructive/80 mt-0.5">Securely end your session</div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
