const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { analyzeResume, findMatchingJobs } = require('../services/geminiService');
const auth = require('../middleware/auth');
const Resume = require('../models/Resume');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Parse resume and get job recommendations
router.post('/parse', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read the uploaded file
    const fileContent = fs.readFileSync(req.file.path, 'utf8');

    // Analyze the resume using Gemini AI
    const resumeAnalysis = await analyzeResume(fileContent);

    // Get job recommendations based on the analysis
    const jobRecommendations = await findMatchingJobs(resumeAnalysis);

    // Save the parsed resume to the database
    const resume = new Resume({
      userId: req.user.id,
      title: req.file.originalname,
      template: 'parsed',
      personalInfo: {
        firstName: resumeAnalysis.personalInfo?.firstName || '',
        lastName: resumeAnalysis.personalInfo?.lastName || '',
        email: resumeAnalysis.personalInfo?.email || '',
        phone: resumeAnalysis.personalInfo?.phone || '',
        location: resumeAnalysis.personalInfo?.location || ''
      },
      summary: resumeAnalysis.summary,
      skills: resumeAnalysis.skills,
      experience: resumeAnalysis.experience.map(exp => ({
        position: exp.title,
        company: exp.company,
        location: exp.location,
        startDate: exp.dates.split(' - ')[0],
        endDate: exp.dates.split(' - ')[1],
        description: exp.details.join('\n')
      })),
      education: resumeAnalysis.education.map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
        date: edu.dates,
        description: edu.details.join('\n')
      }))
    });

    await resume.save();

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      resume: resume,
      jobRecommendations: jobRecommendations.jobs
    });
  } catch (error) {
    console.error('Error parsing resume:', error);
    res.status(500).json({ message: 'Error parsing resume', error: error.message });
  }
});

// Get job recommendations for an existing resume
router.get('/recommendations/:resumeId', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.resumeId,
      userId: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Convert resume to the format expected by findMatchingJobs
    const resumeAnalysis = {
      skills: resume.skills,
      experience: resume.experience.map(exp => ({
        title: exp.position,
        company: exp.company,
        location: exp.location,
        dates: `${exp.startDate} - ${exp.endDate}`,
        details: exp.description.split('\n')
      })),
      education: resume.education.map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
        dates: edu.date,
        details: edu.description.split('\n')
      })),
      summary: resume.summary
    };

    const jobRecommendations = await findMatchingJobs(resumeAnalysis);
    res.json(jobRecommendations.jobs);
  } catch (error) {
    console.error('Error getting job recommendations:', error);
    res.status(500).json({ message: 'Error getting job recommendations', error: error.message });
  }
});

module.exports = router; 