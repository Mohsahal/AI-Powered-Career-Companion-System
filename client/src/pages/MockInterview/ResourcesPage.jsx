import { Headings } from "@/components/MockInterview/Headings";
import { Card } from "@/components/ui/card";
const resources = [
    {
        title: "React Interview Guide",
        link: "https://react.dev/learn",
        description: "Official React documentation and learning resources.",
    },
    {
        title: "JavaScript Basics",
        link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        description: "MDN Web Docs for core JavaScript concepts.",
    },
    {
        title: "System Design Primer",
        link: "https://github.com/donnemartin/system-design-primer",
        description: "A comprehensive guide to system design.",
    },
];
const ResourcesPage = () => {
    return (<div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Headings title="Resources" description="Curated study materials to help you prepare for interviews."/>

        <div className="grid gap-4 sm:grid-cols-2">
          {resources.map((r) => (<Card key={r.title} className="p-4">
              <h3 className="font-semibold text-gray-900">{r.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{r.description}</p>
              <a href={r.link} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:underline mt-3 inline-block">
                Visit
              </a>
            </Card>))}
        </div>
      </div>
    </div>);
};
export default ResourcesPage;
