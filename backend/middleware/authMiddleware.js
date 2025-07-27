import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';


// Point A: Create auth middleware (named 'protect')
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Point B: Add token extraction logic (from httpOnly cookie)
  token = req.cookies.jwt;

  if (token) {
    try {
      // Point C: Implement token verification
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID in the token payload
      // We attach the user to the request object, excluding the password
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
         res.status(401);
         throw new Error('Not authorized, user not found');
      }

      next(); // Move on to the next middleware or the route handler
    } catch (error) {
      // Point E: Handle token errors gracefully
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Point D: Add user role checking
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, proceed
    } else {
        res.status(403); // 403 Forbidden
        throw new Error('Not authorized as an admin');
    }
};

const teacher = (req, res, next) => {
    if (req.user && (req.user.role === 'teacher' || req.user.role === 'admin')) {
        next(); // User is a teacher or an admin, proceed
    } else {
        res.status(403);
        throw new Error('Not authorized as a teacher');
    }
};


export { protect, admin, teacher };

