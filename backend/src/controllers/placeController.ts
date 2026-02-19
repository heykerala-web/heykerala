import { Request, Response } from "express";
import mongoose from "mongoose";
import Place from "../models/Place";

// Create a new place (Admin only)
export const createPlace = async (req: Request, res: Response) => {
  try {
    const place = await Place.create({ ...req.body, status: 'approved' }); // Admin created is auto-approved
    res.status(201).json({
      success: true,
      data: place,
    });
  } catch (error: any) {
    console.error("Error creating place:", error);
    res.status(400).json({
      success: false,
      message: "Error creating place",
      error: error.message,
    });
  }
};

// Submit a new place (User)
export const submitPlace = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const place = await Place.create({
      ...req.body,
      status: 'pending',
      createdBy: userId
    });
    res.status(201).json({
      success: true,
      message: "Place submitted successfully for review.",
      data: place
    });
  } catch (error: any) {
    console.error("Error submitting place:", error);
    res.status(400).json({
      success: false,
      message: "Error submitting place",
      error: error.message
    });
  }
};

// Get place by ID
export const getPlaceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Place ID format",
      });
    }

    const place = await Place.findById(id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    const isApproved = place.status === 'approved' || !place.status;
    const isAdmin = (req as any).user && (req as any).user.role === 'Admin';

    if (!isApproved && !isAdmin) {
      return res.status(403).json({ success: false, message: "Place pending approval" });
    }

    res.json({
      success: true,
      data: place,
    });
  } catch (error: any) {
    console.error("Error fetching place by ID:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching place",
      error: error.message,
    });
  }
};

// Get place by slug
export const getPlaceBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const place = await Place.findOne({ slug });

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    const isApproved = place.status === 'approved' || !place.status;
    const isAdmin = (req as any).user && (req as any).user.role === 'Admin';

    if (!isApproved && !isAdmin) {
      return res.status(403).json({ success: false, message: "Place pending approval" });
    }

    res.json({
      success: true,
      data: place,
    });
  } catch (error: any) {
    console.error("Error fetching place:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching place",
      error: error.message,
    });
  }
};

// Get all places (Search, Filter, Sort, Pagination)
export const getAllPlaces = async (req: Request, res: Response) => {
  try {
    const { category, district, search, sort, page = 1, limit = 10, minRating, type, status, budget } = req.query;

    const query: any = {
      $or: [{ status: 'approved' }, { status: { $exists: false } }]
    };

    // If admin and requesting other status, allow it
    if ((req as any).user && (req as any).user.role === 'Admin' && status) {
      query.status = status;
    }

    // Budget Filter
    if (budget) {
      const budgetStr = budget as string;
      if (budgetStr === 'Low') {
        query.priceLevel = { $in: ['Free', 'Cheap'] };
      } else if (budgetStr === 'Mid') {
        query.priceLevel = 'Moderate';
      } else if (budgetStr === 'High') {
        query.priceLevel = { $in: ['Expensive', 'Luxury'] };
      }
    }


    // Helper to map type to categories
    if (type) {
      const typeStr = type as string;
      if (typeStr === 'ThingsToDo') {
        query.category = { $in: ['Hill Station', 'Beach', 'Backwaters', 'Wildlife', 'Waterfalls', 'Adventure', 'Museum', 'Heritage Site', 'Temple', 'Church', 'Mosque', 'Pilgrimage', 'Nature', 'Culture', 'History', 'City'] };
      } else if (typeStr === 'Stays') {
        query.category = { $in: ['Resort', 'Hotel', 'Homestay'] };
      } else if (typeStr === 'Restaurants') {
        query.category = { $in: ['Restaurant', 'Cafe', 'Food'] };
      } else if (typeStr === 'Locations') {
        // Broad geographic categories
        query.category = { $in: ['Hill Station', 'Beach', 'Backwaters', 'Wildlife', 'Waterfalls'] };
      }
    }

    // specific Category Filter (overrides type if provided, or combined? Better to override or intersection. For now, specific category takes precedence if strictly set, but usually UI won't send both conflictingly. Let's allow specific category to refine type if needed, but existing logic `category = category` overwrites `query.category`. So if both exist, specific category wins, which is correct behavior.)
    if (category && category !== 'all') {
      query.category = category;
    }

    if (district && district !== 'all') query.district = district;
    if (minRating) query.ratingAvg = { $gte: parseFloat(minRating as string) };

    // Search
    if (search) {
      const searchRegex = new RegExp(search as string, "i");
      query.$or = [
        { name: searchRegex },
        { location: searchRegex },
        { district: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ];
    }

    // Sorting
    let sortOptions: any = { createdAt: -1 }; // Default: Newest
    if (sort === 'popular') sortOptions = { ratingAvg: -1, totalReviews: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };
    if (sort === 'name') sortOptions = { name: 1 };

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const places = await Place.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Place.countDocuments(query);

    res.json({
      success: true,
      data: places,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error("Error fetching places:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching places",
      error: error.message,
    });
  }
};

// Search suggestions
export const getSearchSuggestions = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      return res.json({ success: true, data: [] });
    }

    const searchRegex = new RegExp(query, "i");

    const suggestions = await Place.find({
      $or: [
        { name: searchRegex },
        { location: searchRegex },
        { district: searchRegex }
      ]
    })
      .select("name district category slug _id")
      .limit(6);

    res.json({
      success: true,
      data: suggestions,
    });
  } catch (error: any) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({ success: false, message: "Error fetching suggestions", error: error.message });
  }
};

// Get nearby places (by District or Lat/Lng)
export const getNearbyPlaces = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id);

    if (!place) {
      return res.status(404).json({ success: false, message: "Place not found" });
    }

    // First try geospatial if lat/lng exists (Simple approximation or just specific district)
    // For now, simpler approach: Same District + Same Category fallback
    const nearby = await Place.find({
      district: place.district,
      _id: { $ne: id }
    })
      .limit(4)
      .select("name slug image images district category ratingAvg");

    res.json({
      success: true,
      data: nearby,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching nearby places", error: error.message });
  }
};

// Update a place
export const updatePlace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Place ID format",
      });
    }

    // If files uploaded, add them to images array
    if (req.files && Array.isArray(req.files)) {
      const newImages = (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`);
      req.body.images = [...(req.body.images || []), ...newImages];
    }

    const place = await Place.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    res.json({
      success: true,
      data: place,
    });
  } catch (error: any) {
    console.error("Error updating place:", error);
    res.status(400).json({
      success: false,
      message: "Error updating place",
      error: error.message,
    });
  }
};

// Delete a place
export const deletePlace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Place ID format",
      });
    }

    const place = await Place.findByIdAndDelete(id);

    if (!place) {
      return res.status(404).json({ success: false, message: "Place not found" });
    }

    res.json({ success: true, message: "Place deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error deleting place", error: error.message });
  }
};
