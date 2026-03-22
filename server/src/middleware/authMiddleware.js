              // BME/server/src/middleware/authMiddleware.js

              const jwt = require('jsonwebtoken');

              const authMiddleware = (req, res, next) => {
                try {
                  // Get token from header
                  const token = req.headers.authorization?.split(' ')[1];

                  if (!token) {
                    return res.status(401).json({ 
                      success: false, 
                      message: 'No token provided, authorization denied' 
                    });
                  }

                  // Verify token
                  const decoded = jwt.verify(token, process.env.JWT_SECRET);
                  
                  // Add user info to request
                  req.user = decoded;
                  next();
                } catch (error) {
                  return res.status(401).json({ 
                    success: false, 
                    message: 'Token is invalid or expired' 
                  });
                }
              };

              // Role-based authorization
              const authorize = (...roles) => {
                return (req, res, next) => {
                  if (!roles.includes(req.user.role)) {
                    return res.status(403).json({ 
                      success: false, 
                      message: 'Access denied. Insufficient permissions.' 
                    });
                  }
                  next();
                };
              };

              module.exports = { authMiddleware, authorize };