import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim : true,
  },
   email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6, 
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student',
    },
    avatar: {
      type: String,
      default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },

    passwordResetToken: String,
    passwordResetExpires: Date,

    onlineStatus: {
      type: Boolean,
      default: true,
    },

    // OAuth
    googleId: String,
    facebookId: String,
}, {
    timestamps: true,
});

//  -------------- Mongoose middlewares ----------------
userSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) {
      return next();
  }

  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(user.password, salt);
});

//  -------------- Mongoose instance ----------------
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//  ---- verification Token -------
userSchema.methods.getVerificationToken = function () {
  // 1. Generate a random token string
  const verificationToken = crypto.randomBytes(20).toString('hex');

  // 2. Hash the token and set it to the verificationToken field
  this.verificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // Note: We are not setting an expiry date for the verification token,
  // but you could add a `verificationTokenExpires` field if needed.

  // 3. Return the unhashed token
  // This is the version that will be sent in the email link.
  return verificationToken;
};



const User = mongoose.model("User", userSchema);

export default User;