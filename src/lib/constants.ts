export const OFFER_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Draft', color: 'default' },
  PENDING: { label: 'Pending', color: 'warning' },
  APPROVED: { label: 'Approved', color: 'info' },
  ACCEPTED: { label: 'Accepted', color: 'success' },
  DECLINED: { label: 'Declined', color: 'danger' },
  EXPIRED: { label: 'Expired', color: 'default' }
};

export const CANDIDATE_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: 'Active', color: 'info' },
  INTERVIEWING: { label: 'Interviewing', color: 'warning' },
  OFFER_EXTENDED: { label: 'Offer Extended', color: 'info' },
  HIRED: { label: 'Hired', color: 'success' },
  REJECTED: { label: 'Rejected', color: 'danger' },
  WITHDRAWN: { label: 'Withdrawn', color: 'default' }
};

export const INSIGHT_TYPE_CONFIG: Record<string, { icon: string; color: string }> = {
  NEGOTIATION: { icon: 'Sparkles', color: 'text-violet-400' },
  MARKET_POSITION: { icon: 'TrendingUp', color: 'text-emerald-400' },
  EQUITY_ANALYSIS: { icon: 'PieChart', color: 'text-sky-400' },
  RETENTION_RISK: { icon: 'AlertTriangle', color: 'text-rose-400' },
  COUNTER_OFFER: { icon: 'ShieldAlert', color: 'text-amber-400' }
};

export const SCORE_GRADE_CONFIG: Record<string, string> = {
  'A+': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'A': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'B+': 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  'B': 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  'C+': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'C': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'D': 'text-rose-400 bg-rose-400/10 border-rose-400/20'
};

export const CHART_COLORS = {
  primary: '#8b5cf6',
  secondary: '#38bdf8',
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#fb7185',
  muted: '#64748b'
};
