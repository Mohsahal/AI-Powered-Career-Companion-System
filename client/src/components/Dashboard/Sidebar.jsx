import { useState } from "react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BriefcaseIcon, FileText, GraduationCap, Mic, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function Sidebar({ isOpen, onToggle }) {
    const [activeItem, setActiveItem] = useState("dashboard");
    const sidebarItems = [
        {
            icon: <LayoutDashboard className="h-5 w-5"/>,
            label: "Dashboard",
            href: "#",
            active: activeItem === "dashboard",
        },
        {
            icon: <BriefcaseIcon className="h-5 w-5"/>,
            label: "ATS Match",
            href: "#job-recommendations",
            active: activeItem === "jobs",
        },
        {
            icon: <FileText className="h-5 w-5"/>,
            label: "Resume Builder",
            href: "#resume-builder",
            active: activeItem === "resume",
        },
        {
            icon: <GraduationCap className="h-5 w-5"/>,
            label: "Skill Gap Analysis",
            href: "#skill-gap",
            active: activeItem === "skills",
        },
        {
            icon: <Mic className="h-5 w-5"/>,
            label: "Mock Interviews",
            href: "#mock-interviews",
            active: activeItem === "interviews",
        },
    ];
    const handleItemClick = (item) => {
        setActiveItem(item);
    };
    return (<div className={cn("flex flex-col bg-sidebar border-muted-foreground border-gray-200 transition-all duration-200 ease-out pt-16 will-change-transform", isOpen ? "w-64" : "w-20")}>
      <div className="flex items-center justify-between p-7 border-b border-gray-200">
        <div className={cn("flex items-center", !isOpen && "justify-center w-full")}>
       
          
        
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 hover:bg-gray-100 transition-colors duration-150" onClick={() => onToggle(!isOpen)}>
          {!isOpen ? <ChevronRight className="h-4 w-4"/> : <ChevronLeft className="h-4 w-4"/>}
        </Button>
      </div>

      <div className="flex-1 py-6 flex flex-col gap-1 overflow-y-auto">
        {sidebarItems.map((item, index) => (<a key={index} href={item.href} className={cn("flex items-center gap-3 px-4 py-3 text-sidebar-foreground hover:bg-gray-100 rounded-lg mx-2 transition-all duration-150 ease-out transform hover:scale-[1.02]", item.active && "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm", isOpen ? "justify-start" : "justify-center", `animate-fade-in [animation-delay:${index * 50}ms]`)} onClick={() => handleItemClick(item.label.toLowerCase().split(" ")[0])}>
            <div className={cn("flex-shrink-0 transition-transform duration-150", item.active && "scale-110")}>
              {item.icon}
            </div>
            {isOpen && (<span className={cn("font-medium transition-opacity duration-150", !isOpen && "opacity-0")}>
                {item.label}
              </span>)}
          </a>))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <a href="/profile" className={cn("flex items-center gap-3 px-4 py-3 text-sidebar-foreground hover:bg-gray-100 rounded-lg transition-all duration-150 ease-out transform hover:scale-[1.02]", isOpen ? "justify-start" : "justify-center")}>
          <div className="flex-shrink-0">
            <User className="h-5 w-5"/>
          </div>
          {isOpen && (<span className="font-medium transition-opacity duration-150">
              Profile
            </span>)}
        </a>
      </div>
    </div>);
}
