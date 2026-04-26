const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('Auth middleware: No token provided');
      return res.status(401).json({ 
        success: false,
        message: 'No authentication token, access denied' 
      });
    }

    console.log('Auth middleware: Token received, length:', token.length);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Auth middleware: Token decoded successfully');
    console.log('Auth middleware: Decoded user:', {
      id: decoded.id,
      idType: typeof decoded.id,
      hasToString: !!decoded.id?.toString
    });
    
    // Add user from payload
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware: Token verification failed:', error.message);
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid',
      error: error.message
    });
  }
};

module.exports = auth; 
