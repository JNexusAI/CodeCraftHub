const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * @desc Protects routes by verifying a JWT from the Authorization header.
 * If the token is valid, it attaches the user object (without the password)
 * to the request object as `req.user`.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const protect = async (req, res, next) => {
  let token;

  // Check for the authorization header and ensure it's a Bearer token
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Extract the token from the "Bearer <token>" string
    token = req.headers.authorization.split(' ')[1];

    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the ID from the token's payload
    // and attach them to the request object, excluding the password
    req.user = await User.findById(decoded.id).select('-password');

    // Handle case where user associated with token no longer exists
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };