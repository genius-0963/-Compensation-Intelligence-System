import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: "line" | "circle" | "card" | "chart";
}

export function Skeleton({ className, shape = "line", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-slate-800/50 rounded-md",
        shape === "circle" && "rounded-full",
        shape === "card" && "h-32 w-full",
        shape === "chart" && "h-64 w-full",
        className
      )}
      {...props}
    />
  );
}
