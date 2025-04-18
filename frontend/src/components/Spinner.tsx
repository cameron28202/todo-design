import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 24, className }: SpinnerProps) {
  return (
    <Loader 
      size={size} 
      className={cn("animate-spin", className)} 
    />
  );
}