import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
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

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: req.body.role || "Tourist", // Default to Tourist
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
