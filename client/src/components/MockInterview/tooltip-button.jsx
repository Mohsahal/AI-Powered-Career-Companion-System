import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
export const TooltipButton = ({ content, icon, onClick, disabled = false, className, buttonVariant = "outline", buttonClassName, loading = false }) => {
    return (<TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={buttonVariant} size="icon" onClick={onClick} disabled={disabled || loading} className={cn("h-10 w-10", buttonClassName, className)}>
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>);
};
