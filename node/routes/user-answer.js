const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const UserAnswer = require('../models/UserAnswer');

// Debug middleware for all routes - BEFORE auth
router.use((req, res, next) => {
  console.log('=== User Answers Route Debug ===');
  console.log('Route hit:', req.method, req.path);
  console.log('Request body before auth:', req.body);
  console.log('Request headers before auth:', req.headers);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Body type:', typeof req.body);
  console.log('Body keys:', req.body ? Object.keys(req.body) : 'No body');
  next();
});

// All routes require auth
router.use(auth);

// Save user answer
router.post('/', async (req, res) => {
  try {
    console.log('=== POST /api/user-answers ===');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    console.log('Request headers:', req.headers);
    console.log('Content-Type header:', req.headers['content-type']);
    console.log('Request body type:', typeof req.body);
    console.log('Request body keys:', req.body ? Object.keys(req.body) : 'No body');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User from auth:', req.user);
    
    const {
      userId,
      mockIdRef,
      question,
      correct_ans,
      user_ans,
      feedback,
      rating,
      confidence,
      areas,
      answerLength,
      relevanceScore,
      timestamp
    } = req.body;

    // Enhanced validation with detailed error messages
    const missingFields = [];
    if (!mockIdRef) missingFields.push('mockIdRef');
    if (!question) missingFields.push('question');
    if (!correct_ans) missingFields.push('correct_ans');
    if (!user_ans) missingFields.push('user_ans');
    if (!feedback) missingFields.push('feedback');
    if (rating === undefined || rating === null) missingFields.push('rating');

    console.log('Field validation results:', {
      mockIdRef: { value: mockIdRef, exists: !!mockIdRef },
      question: { value: question, exists: !!question },
      correct_ans: { value: correct_ans, exists: !!correct_ans },
      user_ans: { value: user_ans, exists: !!user_ans },
      feedback: { value: feedback, exists: !!feedback },
      rating: { value: rating, exists: rating !== undefined && rating !== null, type: typeof rating }
    });

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields: missingFields,
        received: {
          mockIdRef: !!mockIdRef,
          question: !!question,
          correct_ans: !!correct_ans,
          user_ans: !!user_ans,
          feedback: !!feedback,
          rating: rating
        }
      });
    }

    // Validate rating range
    if (typeof rating !== 'number' || rating < 1 || rating > 10) {
      console.error('Invalid rating:', rating);
      return res.status(400).json({
        success: false,
        message: 'Rating must be a number between 1 and 10',
        received: rating,
        type: typeof rating
      });
    }

    // Validate string fields are not empty
    if (typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Question must be a non-empty string',
        received: question
      });
    }

    if (typeof user_ans !== 'string' || user_ans.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User answer must be a non-empty string',
        received: user_ans
      });
    }

    if (typeof feedback !== 'string' || feedback.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Feedback must be a non-empty string',
        received: feedback
      });
    }

    // Prepare data with proper defaults and validation
    const userAnswerData = {
      userId: (userId || req.user.id)?.toString ? (userId || req.user.id).toString() : (userId || req.user.id),
      mockIdRef: mockIdRef.toString(),
      question: question.trim(),
      correct_ans: correct_ans.trim(),
      user_ans: user_ans.trim(),
      feedback: feedback.trim(),
      rating: Number(rating),
      confidence: confidence ? Number(confidence) : undefined,
      areas: Array.isArray(areas) ? areas : [],
      answerLength: answerLength || user_ans.trim().length,
      relevanceScore: relevanceScore ? Number(relevanceScore) : undefined,
      timestamp: timestamp || new Date()
    };

    console.log('Creating user answer with validated data:', JSON.stringify(userAnswerData, null, 2));

    const userAnswer = await UserAnswer.create(userAnswerData);
    console.log('✅ UserAnswer created successfully:', userAnswer._id);

    res.status(201).json({
      success: true,
      data: userAnswer,
      message: 'User answer saved successfully'
    });
  } catch (error) {
    console.error('Save user answer error:', error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.error('Validation errors:', validationErrors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate answer detected'
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Failed to save answer', 
      error: error.message 
    });
  }
});

// Debug endpoint to check database contents
router.get('/debug', async (req, res) => {
  try {
    console.log('=== GET /api/user-answers/debug ===');
    console.log('User from auth:', req.user);
    
    // Get all user answers for the current user
    const allUserAnswers = await UserAnswer.find({ 
      userId: req.user.id 
    }).sort({ createdAt: -1 });
    
    // Get all user answers in the database (for debugging)
    const allAnswers = await UserAnswer.find({}).sort({ createdAt: -1 });
    
    console.log(`Found ${allUserAnswers.length} answers for user ${req.user.id}`);
    console.log(`Total answers in database: ${allAnswers.length}`);
    
    res.json({
      success: true,
      message: 'Debug information retrieved',
      user: req.user,
      userAnswersCount: allUserAnswers.length,
      totalAnswersCount: allAnswers.length,
      userAnswers: allUserAnswers.slice(0, 5), // First 5 answers
      sampleAnswers: allAnswers.slice(0, 3), // First 3 answers from all
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Debug endpoint failed',
      error: error.message
    });
  }
});

// Test endpoint to verify the route is working
router.get('/test', async (req, res) => {
  try {
    console.log('=== GET /api/user-answers/test ===');
    console.log('Request headers:', req.headers);
    console.log('User from auth:', req.user);
    
    res.json({
      success: true,
      message: 'User answers route is working',
      user: req.user,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Test endpoint failed',
      error: error.message
    });
  }
});

// Test POST endpoint to verify body parsing
router.post('/test', async (req, res) => {
  try {
    console.log('=== POST /api/user-answers/test ===');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('Body type:', typeof req.body);
    console.log('Body keys:', req.body ? Object.keys(req.body) : 'No body');
    
    res.json({
      success: true,
      message: 'POST test successful',
      receivedBody: req.body,
      bodyType: typeof req.body,
      bodyKeys: req.body ? Object.keys(req.body) : [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('POST test endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'POST test endpoint failed',
      error: error.message
    });
  }
});

// Get all user answers for a specific interview
router.get('/interview/:interviewId', async (req, res) => {
  try {
    console.log('=== GET /api/user-answers/interview/:interviewId ===');
    console.log('Request params:', req.params);
    console.log('User from auth:', req.user);
    
    const { interviewId } = req.params;
    
    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message: 'Interview ID is required'
      });
    }

    // Handle both string and ObjectId user IDs
    const userId = req.user.id?.toString ? req.user.id.toString() : req.user.id;
    
    console.log('Searching for user answers with criteria:', {
      mockIdRef: interviewId,
      userId: userId,
      originalUserId: req.user.id
    });

    // Try to find answers with the current user ID first
    let userAnswers = await UserAnswer.find({ 
      mockIdRef: interviewId,
      userId: userId
    }).sort({ createdAt: -1 });

    // If no answers found, try with the original user ID (in case it's an ObjectId)
    if (userAnswers.length === 0 && req.user.id !== userId) {
      console.log('No answers found with string userId, trying with original userId');
      userAnswers = await UserAnswer.find({ 
        mockIdRef: interviewId,
        userId: req.user.id
      }).sort({ createdAt: -1 });
    }

    console.log(`Found ${userAnswers.length} user answers for interview ${interviewId}`);

    res.json({
      success: true,
      data: userAnswers,
      message: `Found ${userAnswers.length} answers for this interview`
    });
  } catch (error) {
    console.error('Fetch user answers error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch answers',
      error: error.message
    });
  }
});

// Get all user answers for current user
router.get('/', async (req, res) => {
  try {
    const userAnswers = await UserAnswer.find({ 
      userId: req.user.id 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: userAnswers
    });
  } catch (error) {
    console.error('Fetch user answers error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch answers' 
    });
  }
});

// Get specific user answer by ID
router.get('/:id', async (req, res) => {
  try {
    const userAnswer = await UserAnswer.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });

    if (!userAnswer) {
      return res.status(404).json({ 
        success: false,
        message: 'Answer not found' 
      });
    }

    res.json({
      success: true,
      data: userAnswer
    });
  } catch (error) {
    console.error('Fetch user answer error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch answer' 
    });
  }
});

// Update user answer
router.put('/:id', async (req, res) => {
  try {
    const {
      question,
      correct_ans,
      user_ans,
      feedback,
      rating,
      confidence,
      areas,
      answerLength,
      relevanceScore
    } = req.body;

    const userAnswer = await UserAnswer.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        question,
        correct_ans,
        user_ans,
        feedback,
        rating,
        confidence,
        areas,
        answerLength,
        relevanceScore
      },
      { new: true, runValidators: true }
    );

    if (!userAnswer) {
      return res.status(404).json({ 
        success: false,
        message: 'Answer not found' 
      });
    }

    res.json({
      success: true,
      data: userAnswer
    });
  } catch (error) {
    console.error('Update user answer error:', error);
    res.status(400).json({ 
      success: false,
      message: 'Failed to update answer', 
      error: error.message 
    });
  }
});

// Delete user answer
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await UserAnswer.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!deleted) {
      return res.status(404).json({ 
        success: false,
        message: 'Answer not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Answer deleted successfully' 
    });
  } catch (error) {
    console.error('Delete user answer error:', error);
    res.status(400).json({ 
      success: false,
      message: 'Failed to delete answer' 
    });
  }
});

module.exports = router;