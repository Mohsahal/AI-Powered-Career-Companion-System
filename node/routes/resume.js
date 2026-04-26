
const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');

// Get all resumes for a user
router.get('/', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single resume
router.get('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new resume
router.post('/', auth, async (req, res) => {
  try {
    const resumeData = {
      ...req.body,
      userId: req.user.id,
      createdAt: new Date(),
      lastModified: new Date()
    };

    const resume = new Resume(resumeData);
    await resume.save();
    
    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a resume
router.put('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { 
        ...req.body,
        lastModified: new Date()
      },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a resume
router.delete('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({ message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get shared resume (no auth required)
router.get('/shared/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
