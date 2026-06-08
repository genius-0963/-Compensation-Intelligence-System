import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  onClose: (id: string) => void;
}

const icons = {
  success: <CheckCircle2 className="text-emerald-400" size={20} />,
  error: <AlertCircle className="text-rose-400" size={20} />,
  warning: <AlertCircle className="text-amber-400" size={20} />,
  info: <Info className="text-sky-400" size={20} />
};

export function Toast({ id, title, description, type = 'info', onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div className="pointer-events-auto flex w-full max-w-md items-center justify-between space-x-4 rounded-lg border border-slate-800 bg-[#0B1020] p-4 shadow-lg animate-in slide-in-from-right-full">
      <div className="flex items-start gap-3">
        {icons[type]}
        <div>
          <h3 className="text-sm font-medium text-slate-50">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-slate-400">{description}</p>
          )}
        </div>
      </div>
      <button
        onClick={() => onClose(id)}
        className="rounded-md p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-50"
      >
        <X size={16} />
      </button>
    </div>
  );
}
