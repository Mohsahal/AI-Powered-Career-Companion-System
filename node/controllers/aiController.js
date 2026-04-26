const { GoogleGenerativeAI } = require("@google/generative-ai");
const { generateJsonWithSingleRetry, getGeminiFinishInfo } = require("../utils/aiUtils");
const { extractResumeTextFromUpload } = require("../utils/resumeUtils");

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(apiKey);

const SKILL_CATEGORIES = {
  python: {
    type: "programming_language",
    resources: [
      "Complete Python for Beginners course on Coursera or Udemy",
      "Build 2-3 projects: web app, data analysis, automation script",
      "Practice on LeetCode, HackerRank, or Codewars",
      'Join Python Discord, Reddit r/learnpython',
      'Read "Python Crash Course" or "Automate the Boring Stuff"',
    ],
    estimated_time: "2-3 months",
    priority: "high",
  },
  javascript: {
    type: "programming_language",
    resources: [
      "Complete JavaScript fundamentals on freeCodeCamp or MDN",
      "Build interactive web applications",
      "Practice on JavaScript30 or Frontend Mentor",
      "Join JavaScript communities",
      'Read "Eloquent JavaScript"',
    ],
    estimated_time: "2-4 months",
    priority: "high",
  },
  java: {
    type: "programming_language",
    resources: [
      "Complete Java Programming course on Coursera",
      "Build desktop applications and Android apps",
      "Practice on HackerRank Java challenges",
      'Read "Head First Java" or "Effective Java"',
    ],
    estimated_time: "3-4 months",
    priority: "high",
  },
  react: {
    type: "frontend_framework",
    resources: [
      "Complete React course on Scrimba or Udemy",
      "Build portfolio website and e-commerce app",
      "Practice with React challenges",
      'Read "React Up & Running" or official React docs',
    ],
    estimated_time: "2-3 months",
    priority: "high",
  },
  "node.js": {
    type: "backend_framework",
    resources: [
      "Complete Node.js course on freeCodeCamp",
      "Build REST APIs and real-time applications",
      "Practice with Express.js and MongoDB",
    ],
    estimated_time: "2-3 months",
    priority: "high",
  },
};

function buildLearningRecommendations(missingSkills) {
  return (missingSkills || []).map((skill) => {
    const skillLower = String(skill || "").toLowerCase();
    let matched = null;
    for (const [key, data] of Object.entries(SKILL_CATEGORIES)) {
      if (key.includes(skillLower) || skillLower.includes(key)) {
        matched = data;
        break;
      }
    }
    
    const query = `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + " tutorial for beginners")}`;
    
    if (matched) {
      return {
        skill,
        type: matched.type,
        resources: matched.resources,
        estimated_time: matched.estimated_time,
        priority: matched.priority,
        youtube_query: query
      };
    }
    return {
      skill,
      type: "general",
      resources: [
        `Research ${skill} fundamentals and best practices`,
        `Find online courses for ${skill} on Coursera, Udemy, or edX`,
        `Practice ${skill} in real-world projects`,
      ],
      estimated_time: "2-4 months",
      priority: "medium",
      youtube_query: query
    };
  });
}

exports.atsEvaluate = async (req, res) => {
  try {
    if (!apiKey) return res.status(500).json({ success: false, error: "AI not configured" });
    if (!req.file) return res.status(400).json({ success: false, error: "No resume file" });

    const jobDescription = String(req.body?.job_description || "").trim();
    if (!jobDescription) return res.status(400).json({ success: false, error: "JD required" });

    const resumeText = await extractResumeTextFromUpload(req.file);
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { temperature: 0.2, maxOutputTokens: 16384 },
    });

    const prompt = `You are a professional ATS (Applicant Tracking System) and technical recruiter.
Evaluate the following resume against the job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

TASK:
1. Calculate a match score (0-100).
2. Identify matching skills and missing skills.
3. Provide a brief professional summary of the fit.
4. List key improvements for the resume.

Return the evaluation in this EXACT JSON format (no markdown):
{
  "match_score": number,
  "confidence": number,
  "experience_match": "High|Medium|Low|None",
  "project_relevance": "High|Medium|Low|None",
  "summary": "Professional summary...",
  "matching_skills": ["skill1", "skill2"],
  "missing_skills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "improvement_suggestions": ["suggestion1", "suggestion2"]
}

JSON only:`;

    const { result, raw, parsed } = await generateJsonWithSingleRetry({ model, prompt });
    if (!parsed.ok) {
      console.error("ATS JSON Error. Raw response:", raw?.slice(0, 500));
      return res.status(500).json({ success: false, message: parsed.error, details: parsed.details });
    }

    return res.json({ success: true, result: parsed.value });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.skillGapAnalysis = async (req, res) => {
  try {
    if (!apiKey) return res.status(500).json({ success: false, error: "AI not configured" });
    if (!req.file) return res.status(400).json({ success: false, error: "No resume file" });

    const jobDescription = String(req.body?.job_description || "").trim();
    const resumeText = await extractResumeTextFromUpload(req.file);
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { temperature: 0.2, maxOutputTokens: 16384 },
    });

    const prompt = `You are an expert technical recruiter performing a detailed skill gap analysis.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

TASK: Perform a comprehensive skill gap analysis comparing the resume against the job requirements.

Return your analysis in this EXACT JSON format (no markdown, no extra text):
{
  "summary": {
    "completion_percentage": number,
    "skills_present": number,
    "skills_missing": number,
    "total_skills_required": number,
    "overall_fit": "Excellent|Good|Moderate|Poor"
  },
  "job_required_skills": ["skill1", "skill2"],
  "present_skills": ["skill1", "skill2"],
  "missing_skills": ["skill1", "skill2"],
  "additional_skills": ["skill1", "skill2"],
  "skill_analysis": {
    "skill_name": {
      "status": "present|missing|additional",
      "evidence": "where found or why missing (max 12 words)",
      "importance": "high|medium|low",
      "level": "expert|intermediate|beginner|not_found"
    }
  },
JSON only:`;

    const { result, raw, parsed } = await generateJsonWithSingleRetry({ model, prompt });
    if (!parsed.ok) {
        console.error("Skill Gap Analysis JSON Error. Raw response:", raw?.slice(0, 500));
        return res.status(500).json({ success: false, message: parsed.error, details: parsed.details });
    }

    const analysis = parsed.value;
    analysis.learning_resources = {
      recommendations: buildLearningRecommendations(analysis.missing_skills)
    };

    return res.json({ success: true, analysis, resume_text_preview: resumeText.slice(0, 500) });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.generateSummary = async (req, res) => {
  try {
    const { jobTitle } = req.body;
    if (!jobTitle) {
      return res.status(400).json({ success: false, error: "Job title is required" });
    }

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate a professional resume summary for a ${jobTitle}. The summary should be concise (2-3 sentences), highlight key skills, and sound professional. Don't use placeholders.`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();

    return res.json({ success: true, summary });
  } catch (error) {
    console.error("Error in generateSummary:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.generateExperience = async (req, res) => {
  try {
    const { position, company, industry } = req.body;
    if (!position || !company) {
      return res.status(400).json({ success: false, error: "Position and company are required" });
    }

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate a professional resume experience description for a ${position} at ${company} in the ${industry || 'Technology'} industry.
    Provide 3-4 bullet points highlighting responsibilities and achievements. Use action verbs. Don't use placeholders.`;

    const result = await model.generateContent(prompt);
    const description = result.response.text().trim();

    return res.json({ success: true, description });
  } catch (error) {
    console.error("Error in generateExperience:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.generateProject = async (req, res) => {
  try {
    const { projectName, technologies, role } = req.body;
    if (!projectName) {
      return res.status(400).json({ success: false, error: "Project name is required" });
    }

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const techString = Array.isArray(technologies) ? technologies.join(", ") : technologies;
    const prompt = `Generate a professional resume project description for a project named "${projectName}" ${techString ? `using ${techString}` : ''} ${role ? `as a ${role}` : ''}.
    Provide 2-3 bullet points. Don't use placeholders.`;

    const result = await model.generateContent(prompt);
    const description = result.response.text().trim();

    return res.json({ success: true, description });
  } catch (error) {
    console.error("Error in generateProject:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
