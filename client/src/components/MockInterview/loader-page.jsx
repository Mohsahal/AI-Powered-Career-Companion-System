import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
export const LoaderPage = ({ className, message = "Loading..." }) => {
    return (<div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary"/>
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
    </div>);
};
