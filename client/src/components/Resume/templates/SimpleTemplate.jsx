import React from 'react';
const SimpleTemplate = ({ data }) => {
    return (<div className="bg-white shadow-lg p-8 min-h-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <p className="text-gray-600">{data.personalInfo.jobTitle}</p>
        <div className="flex justify-center gap-3 mt-2 text-sm text-gray-600">
          <span>{data.personalInfo.email}</span>
          <span>|</span>
          <span>{data.personalInfo.phone}</span>
          {data.personalInfo.location && (<>
              <span>|</span>
              <span>{data.personalInfo.location}</span>
            </>)}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (<div className="mb-6">
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Summary</h2>
          <p className="text-sm">{data.summary}</p>
        </div>)}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (<div className="mb-6">
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Experience</h2>
          <div className="space-y-3">
            {data.experience.map((exp, index) => (<div key={index}>
                <div className="flex justify-between">
                  <h3 className="font-medium">{exp.position}</h3>
                  <span className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-sm">{exp.company}, {exp.location}</p>
                <p className="text-xs text-gray-600 mt-1">{exp.description}</p>
              </div>))}
          </div>
        </div>)}

      {/* Education */}
      {data.education.length > 0 && (<div className="mb-6">
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Education</h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (<div key={index}>
                <div className="flex justify-between">
                  <h3 className="font-medium">{edu.degree}</h3>
                  <span className="text-sm text-gray-600">{edu.date}</span>
                </div>
                <p className="text-sm">{edu.institution}</p>
                {edu.description && <p className="text-xs text-gray-600 mt-1">{edu.description}</p>}
              </div>))}
          </div>
        </div>)}

      {/* Skills */}
      {data.skills.length > 0 && (<div className="mb-6">
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (<span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">{skill}</span>))}
          </div>
        </div>)}

      {/* Projects */}
      {data.projects.length > 0 && (<div className="mb-6">
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Projects</h2>
          <div className="space-y-3">
            {data.projects.map((project, index) => (<div key={index}>
                <div className="flex justify-between">
                  <h3 className="font-medium">{project.name}</h3>
                  <span className="text-sm text-gray-600">{project.date}</span>
                </div>
                <p className="text-xs mt-1">{project.description}</p>
                {project.link && (<a href={project.link} className="text-xs text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                    {project.link}
                  </a>)}
              </div>))}
          </div>
        </div>)}

      {/* Awards/Certifications */}
      {data.certifications.length > 0 && (<div>
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Certifications</h2>
          <div className="space-y-3">
            {data.certifications.map((cert, index) => (<div key={index}>
                <div className="flex justify-between">
                  <h3 className="font-medium">{cert.name}</h3>
                  <span className="text-sm text-gray-600">{cert.date}</span>
                </div>
                <p className="text-sm">{cert.issuer}</p>
                {cert.description && <p className="text-xs text-gray-600 mt-1">{cert.description}</p>}
              </div>))}
          </div>
        </div>)}
    </div>);
};
export default SimpleTemplate;
