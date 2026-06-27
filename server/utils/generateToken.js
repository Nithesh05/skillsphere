import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token and set it in the response cookie
 * @param {Object} res - Express response object
 * @param {string} userId - The user ID to store in the token payload
 * @returns {string} - The generated JWT token
 */
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });

  const cookieOptions = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE, 10) || 30) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === 'production', // Cookie only sent over HTTPS in production
    sameSite: 'strict', // Protects against CSRF attacks
  };

  res.cookie('token', token, cookieOptions);

  return token;
};

export default generateToken;
