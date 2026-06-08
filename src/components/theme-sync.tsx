'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';

export function ThemeSync() {
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const syncedRef = useRef(false);

  useEffect(() => {
    // Only attempt sync once when session changes to authenticated
    if (status === 'authenticated' && session?.user?.id && !syncedRef.current) {
      syncedRef.current = true;
      
      async function syncTheme() {
        try {
          const res = await fetch('/api/profile');
          if (res.ok) {
            const data = await res.json();
            const dbTheme = data.notificationPrefs?.theme;
            
            // If theme preference exists in the database and is different from the current local setting, apply it
            if (dbTheme && dbTheme !== theme) {
              setTheme(dbTheme);
            }
          }
        } catch (err) {
          console.error('Failed to fetch/sync theme from database:', err);
        }
      }
      
      syncTheme();
    }
  }, [status, session, theme, setTheme]);

  return null;
}
