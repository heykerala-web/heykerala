// ...existing code...
import Booking from "../models/Booking";
import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

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
  checkIn: Joi.date().required(), // Removed min('now') to avoid timezone/clock issues
  checkOut: Joi.date().greater(Joi.ref('checkIn')).required(),
  guests: Joi.object({
    adults: Joi.number().min(1).default(1),
    children: Joi.number().min(0).default(0)
  }).required(),
  totalPrice: Joi.number().required()
}).unknown(true); // Allow unknown fields for robustness

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

    console.log("📥 Received Stay Booking Payload:", JSON.stringify(req.body, null, 2));

    const { error } = stayBookingSchema.validate(req.body);
    if (error) {
      console.log("❌ Booking Validation Error:", error.details[0].message);
      return res.status(400).json({ message: error.details[0].message });
    }

    const { stayId, roomType, checkIn, checkOut, guests, totalPrice } = req.body;

    const stay = await mongoose.model('Stay').findById(stayId);
    if (!stay) return res.status(404).json({ message: "Stay not found" });

    // Minimum Stay Validation
    const minStay = stay.minStay || 1;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

    if (nights < minStay) {
      return res.status(400).json({ message: `Minimum stay is ${minStay} night(s).` });
    }

    // Real-time Availability Check
    const selectedRoom = stay.roomTypes?.find((r: any) => r.name === roomType);
    const totalRoomsOfType = selectedRoom ? selectedRoom.count : 1; // Default to 1 if no specific room type

    const overlappingBookings = await Booking.countDocuments({
      stayId,
      roomType,
      status: { $in: ['confirmed', 'completed', 'pending'] }, // Consider pending as blocked temporarily
      $or: [
        { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
      ]
    });

    if (overlappingBookings >= totalRoomsOfType) {
      return res.status(400).json({ message: "No rooms available for the selected dates." });
    }

    // Generate Random Booking ID: HK-2026-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedBookingId = `HK-2026-${randomSuffix}`;

    const booking = await Booking.create({
      userId,
      stayId,
      roomType,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending',
      bookingId: generatedBookingId
    });

    res.status(201).json({
      success: true,
      message: "Booking initiated. Please complete payment.",
      booking
    });
  } catch (err) {
    next(err);
  }
};

const restaurantBookingSchema = Joi.object({
  restaurantId: Joi.string().required(),
  bookingDate: Joi.date().min('now').required(),
  bookingTime: Joi.string().required(), // HH:MM
  numberOfGuests: Joi.number().min(1).required(),
  tableType: Joi.string().optional()
});

export const createRestaurantBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?._id;
    const { error } = restaurantBookingSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { restaurantId, bookingDate, bookingTime, numberOfGuests, tableType } = req.body;

    // Validation: Capacity and Hours
    const restaurant = await mongoose.model('Stay').findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    // Simple capacity check (in a real app, we'd check current aggregate bookings for that slot)
    if (restaurant.totalCapacity && numberOfGuests > restaurant.totalCapacity) {
      return res.status(400).json({ message: "Group size exceeds restaurant capacity" });
    }

    const booking = await Booking.create({
      userId,
      restaurantId,
      bookingDate,
      bookingTime,
      numberOfGuests,
      tableType,
      status: 'pending' // Usually needs approval
    });

    res.status(201).json({
      success: true,
      message: "Table reservation request sent",
      booking
    });
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

export const getContributorBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contributorId = (req as any).user?._id;

    // Find stays/restaurants created by this contributor
    const myProperties = await mongoose.model('Stay').find({ createdBy: contributorId }).select('_id');
    const propertyIds = myProperties.map(p => p._id);

    const bookings = await Booking.find({
      $or: [
        { stayId: { $in: propertyIds } },
        { restaurantId: { $in: propertyIds } }
      ]
    }).populate('stayId').populate('restaurantId').populate('userId', 'name email');

    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

export const getSingleBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const authUser = (req as any).user;

    const booking = await Booking.findById(id).populate('stayId').populate('packageId');
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Security check: Only allow user to see their own booking unless admin or contributor 
    if (authUser.role !== 'Admin' && authUser._id.toString() !== booking.userId.toString()) {
      const stay = booking.stayId as any;
      if (stay?.createdBy?.toString() !== authUser._id.toString()) {
        return res.status(403).json({ message: "Not authorized to view this booking" });
      }
    }

    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};
