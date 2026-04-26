import { ArrowUpRight, Users, Briefcase, FileCheck, GraduationCap, Target, BarChart3 } from "lucide-react";
export default function StatsOverview({ jobMatches = 0, resumeScore = 82, interviewReadiness = 68 }) {
    const stats = [
        {
            title: "ATS Match Score",
            value: `${resumeScore}%`,
            change: "+4%",
            icon: <Target className="h-8 w-8 text-career-blue"/>,
            bgClass: "bg-blue-50"
        },
        {
            title: "Skill Proficiency",
            value: "74%",
            change: "+8%",
            icon: <BarChart3 className="h-8 w-8 text-career-purple"/>,
            bgClass: "bg-purple-50"
        },
        {
            title: "Interview Readiness",
            value: `${interviewReadiness}%`,
            change: "+12%",
            icon: <Users className="h-8 w-8 text-career-teal"/>,
            bgClass: "bg-teal-50"
        },
        {
            title: "Profile Strength",
            value: "Strong",
            change: "Top 5%",
            icon: <FileCheck className="h-8 w-8 text-indigo-600"/>,
            bgClass: "bg-indigo-50"
        },
    ];
    return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (<div key={stat.title} className="bg-white rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg group" style={{ animationDelay: `${index * 100}ms` }}>
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-lg ${stat.bgClass} group-hover:scale-110 transition-all duration-300`}>
              {stat.icon}
            </div>
            <span className="flex items-center text-sm text-green-600 font-medium">
              {stat.change} <ArrowUpRight className="h-3 w-3 ml-1"/>
            </span>
          </div>
          <h3 className="text-2xl font-bold mt-4">{stat.value}</h3>
          <p className="text-gray-500 text-sm">{stat.title}</p>
        </div>))}
    </div>);
}
