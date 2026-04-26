import React from 'react';
const ProfessionalTemplate = ({ data }) => {
    const { personalInfo, summary, skills, experience, education, projects, certifications } = data;
    return (<div className="max-w-[800px] mx-auto bg-white p-8 shadow-lg">
      {/* Header Section */}
      <div className="text-center mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <h2 className="text-xl text-gray-700 mb-3">{personalInfo.jobTitle}</h2>
        <div className="flex justify-center gap-4 text-sm text-gray-600">
          <span>{personalInfo.email}</span>
          <span>•</span>
          <span>{personalInfo.phone}</span>
          {personalInfo.location && (<>
              <span>•</span>
              <span>{personalInfo.location}</span>
            </>)}
        </div>
      </div>

      {/* Summary Section */}
      {summary && (<div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 border-b pb-1">Professional Summary</h3>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>)}

      {/* Skills Section */}
      {skills && skills.length > 0 && (<div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 border-b pb-1">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (<span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {skill}
              </span>))}
          </div>
        </div>)}

      {/* Experience Section */}
      {experience && experience.length > 0 && (<div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 border-b pb-1">Professional Experience</h3>
          <div className="space-y-4">
            {experience.map((exp, index) => (<div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-medium text-gray-900">{exp.position}</h4>
                    <p className="text-gray-700">{exp.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">
                      {exp.startDate} - {exp.endDate}
                    </p>
                    <p className="text-gray-600 text-sm">{exp.location}</p>
                  </div>
                </div>
                <p className="text-gray-700 mt-2">{exp.description}</p>
              </div>))}
          </div>
        </div>)}

      {/* Education Section */}
      {education && education.length > 0 && (<div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 border-b pb-1">Education</h3>
          <div className="space-y-4">
            {education.map((edu, index) => (<div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                    <p className="text-gray-700">{edu.institution}</p>
                  </div>
                  <p className="text-gray-600 text-sm">{edu.date}</p>
                </div>
                {edu.description && (<p className="text-gray-700 mt-2">{edu.description}</p>)}
              </div>))}
          </div>
        </div>)}

      {/* Projects Section */}
      {projects && projects.length > 0 && (<div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 border-b pb-1">Projects</h3>
          <div className="space-y-4">
            {projects.map((project, index) => (<div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                  <p className="text-gray-600 text-sm">{project.date}</p>
                </div>
                <p className="text-gray-700 mt-2">{project.description}</p>
                {project.link && (<a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm mt-1 inline-block">
                    View Project →
                  </a>)}
              </div>))}
          </div>
        </div>)}

      {/* Certifications Section */}
      {certifications && certifications.length > 0 && (<div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 border-b pb-1">Certifications</h3>
          <div className="space-y-4">
            {certifications.map((cert, index) => (<div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-medium text-gray-900">{cert.name}</h4>
                    <p className="text-gray-700">{cert.issuer}</p>
                  </div>
                  <p className="text-gray-600 text-sm">{cert.date}</p>
                </div>
                {cert.description && (<p className="text-gray-700 mt-2">{cert.description}</p>)}
              </div>))}
          </div>
        </div>)}
    </div>);
};
export default ProfessionalTemplate;
