const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const {createTokens} = require('../jwt');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
require('dotenv').config();

// Register a new user
const register = async (req, res) => {
  // Extract user information from request body
  const { username, password, email, phone } = req.body;

  try {
    // Check if user with email already exists in the database
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a secret and TOTP token for two-factor authentication
    const secret = speakeasy.generateSecret({ length: 20 });
    const Token = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
      digits: 6,
    });

    // Create a new User object and save to database
    const newUser = new User({
      password: hashedPassword,
      username: username,
      email: email,
      phone: phone,
      secret: secret.base32, // save the secret in the database
    });
    await newUser.save();

    // Create a nodemailer transporter and send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Verification code for your Shopex Account',
      text: `Your verification code is ${Token}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // Handle email sending errors
        console.log(error);
        return res.status(400).json({ error: 'Email could not be sent' });
      } else {
        // Send success response if email was sent successfully
        res.status(200).send('Email sent : ' + info.response);
      }
    });
  } catch (error) {
    // Handle any other errors that occur during registration
    console.log(error);
    return res.status(400).json({ error: 'An error occurred while processing your request' });
  }
};


const verify = async (req, res) => {

  // Retrieve the email and verificationCode from the request
  const { email } = req.query;
  const { verificationCode } = req.body;

  // Retrieve the user details from the database
  const user = await User.findOne({ email: email });

  // Check if the user exists
  if (!user) {
    return res.status(400).json({ error: 'Invalid user' });
  }

  // Verify the verification code
  const isValidToken = speakeasy.totp.verify({
    secret: user.secret,
    encoding: 'base32',
    token: verificationCode,
    window: 3,
  });

  // Check if the verification code is valid
  if (isValidToken) {
    // Create an access token
    const accessToken = createTokens(user);

    // Set the access token as a cookie
    try {
      res.cookie('access-token', accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        secure: true,
        path: '/',
        sameSite: 'none',
      });
      res.status(200).json(accessToken);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'An error occurred while setting the cookie' });
    }
  } else {
    // Delete the user record from the database
    await User.deleteOne({ email: user.email });
    console.log(user.secret);
    console.log(isValidToken);
    return res.status(400).json({ error: 'Invalid token' });
  }
};

const googleRegister = async (req, res) => {
  try {
    const { email, displayName, phone } = req.body;

    // Check if user already exists in the database
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ error: "User already exists" })
    } else {
      // Create a new user object with default password and other details
      const newUser = new User({
        password: "password",
        username: displayName,
        email: email,
        phone: phone,
      });

      // Save the new user object to the database
      await newUser.save();

      // Generate an access token for the new user
      const accessToken = createTokens(newUser);

      // Set the access token as a cookie and send a response with the new user object
      res.cookie('access-token', accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        secure: true,
        path: '/',
        sameSite: 'none',
      });
      res.status(200).json({ user: newUser });
    }
  } catch (error) {
    console.error(error);

    // Send a 500 Internal Server Error response if an error occurs
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
const googleLogin = async (req, res) => {
  try {
    // Extract email from request body
    const { userEmail } = req.body;

    // Find user by email
    const user = await User.findOne({ email: userEmail });

    // If user doesn't exist, return an error
    if (!user) {
      return res.status(400).json({ error: "User doesn't exist" });
    }

    // Generate access token
    const accessToken = createTokens(user);

    // Set access token cookie and return user object
    res.cookie('access-token', accessToken, {
      maxAge: 60 * 60 * 24 * 30 * 1000,
      secure: true,
      sameSite: 'none',
      path: '/'
    });
    res.json({ user });
  } catch (error) {
    // Log error and return internal server error message
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // find user with provided email in database
  const user = await User.findOne({ email: email });

  // if user doesn't exist, return error response
  if (!user) {
    return res.status(400).json({ error: "User doesn't exist" });
  }

  // compare provided password with user's stored password
  const dbPassword = user.password;
  bcrypt.compare(password, dbPassword).then((match) => {
    if (!match) {
      // if passwords don't match, return error response
      res.status(400).json({ error: "Wrong Username or Password" });
    } else {
      // if passwords match, create access token and set cookie
      const accesToken = createTokens(user);

      // Use cookie if available
      res.cookie("access-token", accesToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        path: '/',
        sameSite: 'none',
        secure: true,
      });

      // return success response
      res.json("Logged In");
    }
  });
};

const logout = async (req, res) => {
  const token = req.cookies["access-token"];
  if (!token) {
    return res.status(400).json({ error: "Access token not found" });
  }

  res.clearCookie("access-token"); // Clear the access token cookie

  return res.status(200).send("Logged out successfully.");
};

const forgotPassword = async(req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Generate a secure random token for resetting the password
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Update the user's resetToken field in the database
    await User.updateOne({ email }, { resetToken });

    // Send an email to the user with a link to reset the password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const resetLink = `http://localhost:5173/api/auth/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Your Password",
      html: `To reset your password, please click on the following link: <a href="${resetLink}">${resetLink}</a>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error(error);
        return res.status(400).json({ error: "Error sending email" });
      }
      console.log("Password reset email sent: ", info);
      res.status(200).send("An email has been sent with instructions to reset your password.");
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const password = req.body.password;
    const token = req.query.token;

    // Find the user with the reset token
    const user = await User.findOne({ resetToken: token });
    if (!user) {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    // Update the user's password and clear the reset token
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ email: user.email }, { password: hashedPassword, resetToken: null });

    // Create a new access token and set it as a cookie
    const accessToken = createTokens(user);
    res.cookie('access-token', accessToken, {
      maxAge: 60 * 60 * 24 * 30 * 1000,
    });

    // Send a success response
    return res.status(200).send('Password reset successful');
  } catch (error) {
    // Log any errors and send a response with the error message
    console.log(error);
    return res.status(400).json({ error: 'Error resetting password' });
  }
};



module.exports = {
    register,
    verify,
    login,
    logout,
    forgotPassword,
    resetPassword,
    googleLogin,
    googleRegister,
}
