'use client';

import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';

export function useAppTheme() {
  const { theme, setTheme: setLocalTheme, resolvedTheme } = useTheme();
  const { data: session } = useSession();

  const setTheme = async (newTheme: string) => {
    // 1. Immediately update local client theme for sub-100ms response
    setLocalTheme(newTheme);

    // 2. Async database sync if authenticated
    if (session?.user?.id) {
      try {
        // Fetch the user's latest settings to avoid overriding other fields in notificationPrefs
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          const currentPrefs = data.notificationPrefs || {};

          if (currentPrefs.theme !== newTheme) {
            await fetch('/api/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                notificationPrefs: {
                  ...currentPrefs,
                  theme: newTheme,
                },
              }),
            });
          }
        }
      } catch (err) {
        console.error('Failed to sync theme preference with database profile:', err);
      }
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return { 
    theme, 
    setTheme, 
    toggleTheme, 
    resolvedTheme 
  };
}
