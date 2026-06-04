import {
  LayoutDashboard,
  Users,
  UserPlus,
  Layers,
  BarChart3,
  FileText,
  TrendingUp,
  Sparkles,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const mainNavigation: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'People',
    items: [
      { label: 'Employees', href: '/employees', icon: Users },
      { label: 'Candidates', href: '/candidates', icon: UserPlus },
    ],
  },
  {
    title: 'Compensation',
    items: [
      { label: 'Bands', href: '/bands', icon: Layers },
      { label: 'Benchmarks', href: '/benchmarks', icon: BarChart3 },
      { label: 'Offers', href: '/offers', icon: FileText },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Market Data', href: '/market-data', icon: TrendingUp },
      { label: 'Insights', href: '/insights', icon: Sparkles },
    ],
  },
];

export const bottomNavigation: NavItem[] = [
  { label: 'Settings', href: '/settings', icon: Settings },
];
