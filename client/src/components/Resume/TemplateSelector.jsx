import React from 'react';
import { cn } from '@/lib/utils';
const TemplateSelector = ({ templates, selectedTemplate, onSelectTemplate }) => {
    return (<div className="space-y-4">
      <h2 className="text-lg font-semibold">Choose a Template</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {templates.map((template) => (<div key={template.id} className={cn("border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md animate-fade-in", selectedTemplate === template.id ? "ring-2 ring-brand-blue" : "")} onClick={() => onSelectTemplate(template.id)}>
            <div className="aspect-w-3 aspect-h-4 bg-gray-100">
              <div className="p-2">
                <img src={template.thumbnail} alt={template.name} className="h-40 w-full object-cover rounded border"/>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
            </div>
          </div>))}
      </div>
    </div>);
};
export default TemplateSelector;
