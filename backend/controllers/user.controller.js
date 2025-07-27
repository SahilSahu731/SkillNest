import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    
      
      if (!name || !email || !password) {
          return res.status(400).json({
              success: false,
              message: "Please provide all the required fields",
            });
  }
  
  const userExists = await User.findOne({ email });
  
  if (userExists) {
      return res.status(400).json({
          success: false,
          message: "User already exists",
        });
    }
    
    // password already hashed by mongoose
    const user = await User.create({ name, email, password });
    
     if (user) {
    // Generate JWT and set it in an httpOnly cookie
    generateToken(res, user._id);

    // Point G: Return appropriate response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified, // isVerified will be false
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
    
} catch (error) {
    res.status(500).json({
        success: false,
        message : error.message,
    })
  }
};

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find the user by email
  const user = await User.findOne({ email });

  // 2. Check if user exists and if the password matches
  if (user && (await user.matchPassword(password))) {
    // 3. Generate a token and send user data
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    });
  } else {
    // 4. If login fails, send an error
    res.status(401); // 401 Unauthorized
    throw new Error('Invalid email or password');
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  // Clear the httpOnly cookie by setting an empty value and making it expire immediately
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: 'Logged out successfully' });
});
