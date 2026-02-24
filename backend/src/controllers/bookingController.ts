// ...existing code...
import Booking from "../models/Booking";
import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const bookingSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().optional(),
  packageId: Joi.string().optional(),
  date: Joi.date().min('now').required() // Prevent past dates
});

const stayBookingSchema = Joi.object({
  stayId: Joi.string().required(),
  roomType: Joi.string().required(),
  checkIn: Joi.date().min('now').required(),
  checkOut: Joi.date().greater(Joi.ref('checkIn')).required(),
  guests: Joi.object({
    adults: Joi.number().min(1).default(1),
    children: Joi.number().min(0).default(0)
  }).required()
});

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = bookingSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const booking = await Booking.create(req.body);
    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    next(err);
  }
};
// ...existing code...

// --- Stay Booking Functions ---

export const createStayBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const { error } = stayBookingSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { stayId, roomType, checkIn, checkOut, guests } = req.body;

    const booking = await Booking.create({
      userId,
      stayId,
      roomType,
      checkIn,
      checkOut,
      guests,
      status: 'pending'
    });

    res.status(201).json({ message: "Stay booking request sent", booking });
  } catch (err) {
    next(err);
  }
};

export const getUserBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const authUser = (req as any).user;

    // Security check: Only allow user to see their own bookings unless admin
    if (authUser.role !== 'Admin' && authUser._id.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to view these bookings" });
    }

    const bookings = await Booking.find({ userId: userId }).populate('stayId').populate('packageId');
    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).populate('stayId').populate('userId', 'name email').populate('packageId');
    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};
