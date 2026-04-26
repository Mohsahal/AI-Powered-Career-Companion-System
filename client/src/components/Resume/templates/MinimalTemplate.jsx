import React from 'react';
const MinimalTemplate = ({ data }) => {
    return (<div className="bg-white shadow-lg min-h-full p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <p className="text-lg text-gray-600">{data.personalInfo.jobTitle}</p>
        <div className="flex justify-center gap-4 mt-2 text-sm text-gray-600">
          <p>{data.personalInfo.email}</p>
          <p>{data.personalInfo.phone}</p>
          {data.personalInfo.location && <p>{data.personalInfo.location}</p>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (<div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Summary</h2>
          <p className="text-gray-700">{data.summary}</p>
        </div>)}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (<div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Experience</h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (<div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}, {exp.location}</p>
                  </div>
                  <span className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-gray-700 mt-1">{exp.description}</p>
              </div>))}
          </div>
        </div>)}

      {/* Education */}
      {data.education && data.education.length > 0 && (<div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Education</h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (<div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                  </div>
                  <span className="text-sm text-gray-500">{edu.date}</span>
                </div>
              </div>))}
          </div>
        </div>)}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (<div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (<span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {skill}
              </span>))}
          </div>
        </div>)}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (<div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((project, index) => (<div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    {project.link && (<a href={project.link} className="text-sm text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                        {project.link}
                      </a>)}
                  </div>
                  <span className="text-sm text-gray-500">{project.date}</span>
                </div>
                <p className="text-gray-700 mt-1">{project.description}</p>
              </div>))}
          </div>
        </div>)}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (<div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Certifications & Achievements</h2>
          <div className="space-y-3">
            {data.certifications.map((cert, index) => (<div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                    <p className="text-gray-600">{cert.issuer}</p>
                  </div>
                  <span className="text-sm text-gray-500">{cert.date}</span>
                </div>
                {cert.description && (<p className="text-gray-700 mt-1">{cert.description}</p>)}
              </div>))}
          </div>
        </div>)}
    </div>);
};
export default MinimalTemplate;
