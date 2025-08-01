import jwt from 'jsonwebtoken';

export const generateToken = (res, userId) => {
   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict', 
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  });

};

export default generateToken;