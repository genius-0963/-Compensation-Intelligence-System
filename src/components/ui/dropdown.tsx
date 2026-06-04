import * as React from "react"
import { cn } from "@/lib/utils"

export function Dropdown({ 
  trigger, 
  children, 
  align = 'right' 
}: { 
  trigger: React.ReactNode, 
  children: React.ReactNode,
  align?: 'left' | 'right'
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div 
          className={cn(
            "absolute z-50 mt-2 w-56 rounded-md border border-slate-800 bg-slate-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in-0 zoom-in-95",
            align === 'right' ? "right-0 origin-top-right" : "left-0 origin-top-left"
          )}
          onClick={() => setIsOpen(false)}
        >
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ 
  children, 
  onClick, 
  className 
}: { 
  children: React.ReactNode, 
  onClick?: () => void,
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-slate-50 transition-colors",
        className
      )}
    >
      {children}
    </button>
  );
}
