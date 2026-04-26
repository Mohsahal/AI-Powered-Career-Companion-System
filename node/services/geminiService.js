const { GoogleGenerativeAI } = require('@google/generative-ai');

// Use environment variable; do not hardcode keys
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('GEMINI_API_KEY is not set. AI endpoints will fail until configured.');
}
const ai = new GoogleGenerativeAI(apiKey);

async function analyzeResume(resumeContent) {
  try {
    const model = ai.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 16384,
        temperature: 0.1
      }
    });
    
    const prompt = `You are an extremely precise resume parser and analyst. Your task is to extract key information from the provided resume content into a structured JSON object, focusing on accuracy and detail.

Resume Content:
"""
${resumeContent}
"""

Extract the following information with high fidelity:
-   Skills: A comprehensive list of all technical skills, programming languages, frameworks, libraries, tools, and software mentioned. Be specific (e.g., "React", "Node.js", "Python", "AWS", "Docker", "Kubernetes", "TensorFlow", "Figma"). Also list relevant soft skills.
-   Experience: A detailed list of all work experiences. For each entry, capture the exact "Job Title", "Company Name", "Location" (City, State, or Remote), and "Dates" (Start Date - End Date). Provide 2-3 bullet points for each role that summarize key responsibilities and, crucially, include quantifiable achievements or specific project contributions where present.
-   Education: A list of all educational entries. For each, capture the exact "Degree" (e.g., Bachelor of Science in Computer Science), "Major" (if applicable), "Institution Name", and "Dates" (Start Date - End Date, or Graduation Date/Expected). Include any honors, GPA (if listed), or relevant coursework.
-   Summary: A concise professional summary (3-4 sentences) that accurately reflects the candidate's profile based only on the content provided in the resume.
    
Provide the output as a single JSON object following this exact structure:
{
  "skills": [],
  "experience": [
    {
      "title": "",
      "company": "",
      "location": "",
      "dates": "",
      "details": []
    }
  ],
  "education": [
    {
      "degree": "",
      "major": "",
      "institution": "",
      "dates": "",
      "details": []
    }
  ],
  "summary": ""
}

Crucially, return only the JSON object. Do not include any introductory text, markdown formatting, explanations, or conversational elements outside the JSON object itself. The JSON must be valid and parseable. If a section (like experience or education) is empty in the resume, provide an empty array. If a field (like 'major' or 'details') is not present or empty for an entry, omit that key or provide an empty array/string as appropriate.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Raw Gemini Analyze Response:', text.substring(0, 500) + '...'); // Log first 500 characters
    // Extract JSON safely
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON object found in Gemini response');
    
    let parsedJson;
    try {
        parsedJson = JSON.parse(match[0]);
        // Basic validation for analysis structure
        if (!parsedJson.skills || !Array.isArray(parsedJson.skills) ||
            !parsedJson.experience || !Array.isArray(parsedJson.experience) ||
            !parsedJson.education || !Array.isArray(parsedJson.education) ||
            typeof parsedJson.summary !== 'string') {
            throw new Error('Analysis JSON is not in the expected format.');
        }
        return parsedJson;
     } catch (parseError) {
        console.error('Error parsing Gemini Analysis JSON:', parseError);
        console.error('Raw Gemini response text:', text);
        throw new Error('Failed to parse resume analysis from Gemini response.');
     }
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error('Failed to analyze resume');
  }
}

async function findMatchingJobs(resumeAnalysis) {
  try {
    const model = ai.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 16384,
        temperature: 0.1
      }
    });
    
    const prompt = `You are an expert job recommendation engine specifically tasked with generating job recommendations that are an excellent, direct match for the provided resume analysis. Your recommendations must align closely with the candidate's extracted skills, experience, and education.

Resume Analysis:
"""
${JSON.stringify(resumeAnalysis, null, 2)}
"""

Generate 5 job recommendations that are highly relevant to this specific candidate profile. Focus on realistic job titles, companies, locations, and salary ranges that are a strong match based on the skills and experience listed in the analysis. The skills listed for each recommended job should heavily overlap with the candidate's skills.

Provide the recommendations in the following *exact* JSON format:
{
  "jobs": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "Location",
      "salary": "Salary Range",
      "matchPercentage": 85,
      "skills": [],
      "posted": "Time ago",
      "description": ""
    }
    // ... generate 4 more highly relevant job objects ...
  ]
}

Guidelines for generating recommendations:
-   Strict Relevance: Recommendations must be a direct match to the analyzed skills and experience.
-   Skill Overlap: The 'skills' list for each recommended job should primarily consist of skills listed in the candidate's resume analysis.
-   Experience Alignment: Job titles and descriptions should reflect the level and type of experience detailed in the resume.
-   Realistic Details: Company names, locations, and salary ranges should be plausible for the recommended role and experience level.
-   Format: Return only the JSON object. Do not include any introductory text, markdown formatting, explanations, or conversational elements outside the JSON object itself. The JSON must be valid and parseable.
-   Diversity: Provide a variety of relevant opportunities if the resume supports it, but prioritize direct matches.
-   Match Percentage: Provide a thoughtful estimate based on the degree of overlap between the candidate's profile and the recommended job.

Focus intently on generating recommendations that look like they were specifically created *for* the candidate based on their provided resume content.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Raw Gemini Recommend Response:', text.substring(0, 500) + '...'); // Log first 500 characters
    // Extract JSON safely
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON object found in Gemini response');
     try {
        const parsedJson = JSON.parse(match[0]);
        // Basic validation to ensure the structure is as expected
        if (parsedJson.jobs && Array.isArray(parsedJson.jobs)) {
             // Optional: Add more thorough validation here for each job object structure
            return parsedJson;
        } else {
            throw new Error('Gemini response JSON is not in the expected format (missing or invalid "jobs" array).');
        }
     } catch (parseError) {
        console.error('Error parsing Gemini Job Recommendations JSON:', parseError);
        console.error('Raw Gemini response text:', text);
        throw new Error('Failed to parse job recommendations from Gemini response.');
     }
  } catch (error) {
    console.error('Error finding matching jobs:', error);
    throw new Error('Failed to find matching jobs');
  }
}

module.exports = {
  analyzeResume,
  findMatchingJobs
}; 