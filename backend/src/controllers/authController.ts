import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import User, { IUser } from "../models/User"; //make sure to import IUser interface

// Helper: generate JWT
const generateToken = (id: string): string =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

//Register User
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Validate role
    const requestedRole = req.body.role || "Tourist";
    if (requestedRole === "Admin") {
      res.status(400).json({ message: "Admin role cannot be selected during signup" });
      return;
    }

    if (!["Tourist", "Contributor"].includes(requestedRole)) {
      res.status(400).json({ message: "Invalid role selected" });
      return;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: requestedRole,
    });

    // Ensure _id is available and stringified
    const token = generateToken(user._id as string);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
        savedPlaces: user.savedPlaces,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Login User
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user._id as string);

    // Log Activity
    const { logActivity } = await import("../utils/activityLogger");
    await logActivity(user._id as string, "LOGIN", "User logged in", req);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
        savedPlaces: user.savedPlaces,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get Current User
export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
        savedPlaces: user.savedPlaces,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Update User Role
export const updateRole = async (req: any, res: Response): Promise<void> => {
  try {
    const { role } = req.body;

    if (!["Tourist", "Contributor"].includes(role)) {
      res.status(400).json({ message: "Invalid role. Only Tourist or Contributor allowed." });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.role === "Admin") {
      res.status(400).json({ message: "Admin role cannot be changed" });
      return;
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Role updated to ${role}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
        savedPlaces: user.savedPlaces,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Forgot Password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "No user found with that email" });
      return;
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expire
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await user.save();

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    console.log("Password Reset URL:", resetUrl);

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click on the link below to reset your password: \n\n ${resetUrl}`;

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"${process.env.FROM_NAME || "HeyKerala"}" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Password reset token",
        text: message,
      });

      res.status(200).json({
        success: true,
        message: "Email sent",
        resetUrl: process.env.NODE_ENV === "development" ? resetUrl : undefined
      });
    } catch (err: any) {
      console.error("Email Sending Error:", err.message);

      // If in development, don't fail the request because we've already logged the reset URL
      if (process.env.NODE_ENV === "development") {
        res.status(200).json({
          success: true,
          message: "Email could not be sent, but reset link is provided (Dev Mode)",
          resetUrl: resetUrl
        });
        return;
      }

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Reset Password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }

    // Set new password
    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
