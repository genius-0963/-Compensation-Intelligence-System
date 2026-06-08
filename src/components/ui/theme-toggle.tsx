'use client';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Button } from './button';
import { Sun, Moon, SunMoon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, toggleTheme, resolvedTheme } = useAppTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <Button variant="ghost" size="icon" className="w-9 h-9" />;

  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  const renderIcon = () => {
    if (currentTheme === 'dark') return <Moon size={18} />;
    return <Sun size={18} />;
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-9 h-9 rounded-full border border-border"
      onClick={toggleTheme}
      aria-label={`Toggle theme (current: ${currentTheme})`}
    >
      {renderIcon()}
    </Button>
  );
}
