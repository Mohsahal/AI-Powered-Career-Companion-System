import { cn } from "@/lib/utils";
export const Headings = ({ title, description, isSubHeading = false, className }) => {
    if (isSubHeading) {
        return (<div className={cn("mb-5", className)}>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        {description && (<p className="text-gray-600">{description}</p>)}
      </div>);
    }
    return (<div className={cn("text-center mb-2", className)}>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      {description && (<p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>)}
    </div>);
};
