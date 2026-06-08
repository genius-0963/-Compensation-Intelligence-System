/**
 * Centralized theme-driven configuration for Recharts visual elements.
 * Returns appropriate hex values for light and dark modes to maintain accessibility.
 */
export function getChartTheme(resolvedTheme: string | undefined) {
  const isDark = resolvedTheme === 'dark';
  
  return {
    gridStroke: isDark ? '#334155' : '#f3f4f6', // Slate-700 vs Slate-100
    tickColor: isDark ? '#94a3b8' : '#64748b', // Slate-400 vs Slate-500
    tooltipBg: isDark ? '#111827' : '#ffffff', // Gray-900 vs White
    tooltipBorder: isDark ? '#334155' : '#e2e8f0', // Slate-700 vs Slate-200
    tooltipTextColor: isDark ? '#f8fafc' : '#0f172a', // Slate-50 vs Slate-900
    inactiveBarColor: isDark ? '#1e293b' : '#e5e7eb', // Slate-800 vs Gray-200
    cursorFill: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
    
    // Core Brand / Status Accent Colors
    primaryBlue: '#2563EB', // Blue-600
    success: '#10B981', // Emerald-500
    warning: '#F59E0B', // Amber-500
    danger: '#EF4444', // Red-500
    purple: '#8b5cf6', // Violet-500
    sky: isDark ? '#38bdf8' : '#0284c7', // Sky-400 vs Sky-600
  };
}
