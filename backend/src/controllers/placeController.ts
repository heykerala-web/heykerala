import { Request, Response } from "express";
import mongoose from "mongoose";
import Place from "../models/Place";
import Review from "../models/Review";
import cache from "../utils/cache";

// Cache TTLs
const PLACES_LIST_TTL = 5 * 60;   // 5 minutes
const TRENDING_TTL = 10 * 60;  // 10 minutes

// Helper to escape special characters for regex
const escapeRegex = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Create a new place (Admin only)
export const createPlace = async (req: Request, res: Response) => {
  try {
    // Whitelist fields for admin creation
    const {
      name, slug, district, category, description, image, images,
      location, latitude, longitude, tags, nearby, highlights,
      bestTimeToVisit, entryFee, openingHours, isUntold, untoldStory,
      priceLevel
    } = req.body;

    const place = await Place.create({
      name, slug, district, category, description, image, images,
      location, latitude, longitude, tags, nearby, highlights,
      bestTimeToVisit, entryFee, openingHours, isUntold, untoldStory,
      priceLevel,
      status: 'approved' // Admin created is auto-approved
    });

    // Invalidate list cache so fresh data shows
    cache.del('places');

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
    // Strictly whitelist fields for user submission to prevent mass assignment (e.g. settings status to approved)
    const {
      name, slug, district, category, description, image, images,
      location, latitude, longitude, tags, nearby, highlights,
      bestTimeToVisit, entryFee, openingHours, isUntold, untoldStory,
      priceLevel
    } = req.body;

    const place = await Place.create({
      name, slug, district, category, description, image, images,
      location, latitude, longitude, tags, nearby, highlights,
      bestTimeToVisit, entryFee, openingHours, isUntold, untoldStory,
      priceLevel,
      status: 'pending',
      createdBy: userId
    });
    cache.del('places');
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
    const user = (req as any).user;
    const isAdmin = user && user.role === 'Admin';
    const isCreator = user && place.createdBy?.toString() === user?._id?.toString();

    if (!isApproved && !isAdmin && !isCreator) {
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
    const user = (req as any).user;
    const isAdmin = user && user.role === 'Admin';
    const isCreator = user && place.createdBy?.toString() === user?._id?.toString();

    if (!isApproved && !isAdmin && !isCreator) {
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
    const { category, district, search, sort, page = 1, limit = 10, minRating, type, status, budget, untold } = req.query;

    // Build cache key from query params (skip for admin status queries)
    const user = (req as any).user;
    const userId = user?._id;
    const isAdmin = user && user.role === 'Admin';

    const query: any = {
      $or: [
        { status: 'approved' },
        { status: { $exists: false } }
      ]
    };

    // If logged in, allow creator to see their own pending items
    if (userId) {
      query.$or.push({ createdBy: userId });
    }

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

    // Untold Filter
    if (untold === 'true') {
      query.isUntold = true;
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
      const searchRegex = new RegExp(escapeRegex(search as string), "i");
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

    const total = await Place.countDocuments(query);
    const places = await Place.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const responseData = {
      success: true,
      data: places,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    };

    // Store in cache (only for non-admin queries)
    const isAdminQuery = (req as any).user && (req as any).user.role === 'Admin';
    if (!isAdminQuery || !status) {
      const cacheKey = `places_${JSON.stringify(req.query)}`;
      cache.set(cacheKey, responseData, PLACES_LIST_TTL);
    }

    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    res.json(responseData);
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

    const searchRegex = new RegExp(escapeRegex(query), "i");

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

    // Whitelist allowed fields for update
    const updateData: any = {};
    const allowedFields = [
      'name', 'slug', 'district', 'category', 'description', 'image', 'images',
      'location', 'latitude', 'longitude', 'tags', 'nearby', 'highlights',
      'bestTimeToVisit', 'entryFee', 'openingHours', 'isUntold', 'untoldStory',
      'priceLevel', 'status'
    ];

    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    // Sync primary image if images provided but image is not
    if ((!updateData.image || updateData.image === '') && updateData.images && updateData.images.length > 0) {
      updateData.image = updateData.images[0];
    }

    const place = await Place.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    cache.del('places');

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

    // Cascading delete reviews
    await Review.deleteMany({ targetId: id, targetType: "place" });
    cache.del('places');

    res.json({ success: true, message: "Place deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error deleting place", error: error.message });
  }
};

// --- Dynamic Trending System Functions ---

/**
 * Get Top 5 Trending Places based on engagement score
 * score = (views * 1) + (bookmarks * 3) + (totalReviews * 5) + (searchClicks * 2)
 */
export const getTrendingPlaces = async (req: Request, res: Response) => {
  try {
    // Check cache first (10 min TTL — trending rarely changes)
    const cachedTrending = cache.get<any>('places_trending');
    if (cachedTrending) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedTrending);
    }

    // Optimization: Fetch only top 50 places by views as candidates for trending
    // This avoids loading thousands of documents into memory.
    const places = await Place.find({
      $or: [{ status: 'approved' }, { status: { $exists: false } }]
    })
      .sort({ views: -1 })
      .limit(50);

    const trendingPlaces = places.map((place: any) => {
      const score =
        (place.views || 0) * 1 +
        (place.bookmarks || 0) * 3 +
        (place.totalReviews || 0) * 5 +
        (place.searchClicks || 0) * 2;

      return {
        ...place.toObject(),
        trendingScore: score
      };
    });

    // Sort by score descending and take top 5
    const sortedPlaces = trendingPlaces
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 5);

    const trendingResponse = { success: true, data: sortedPlaces };
    cache.set('places_trending', trendingResponse, TRENDING_TTL);
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate=120');
    res.json(trendingResponse);
  } catch (error: any) {
    console.error("Error fetching trending places:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching trending places",
      error: error.message
    });
  }
};

/**
 * Increment Place view count
 */
export const incrementPlaceView = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Place.findByIdAndUpdate(id, { $inc: { views: 1 } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Increment Search Click count
 */
export const incrementSearchClick = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Place.findByIdAndUpdate(id, { $inc: { searchClicks: 1 } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Increment Bookmark count
 */
export const incrementBookmarkClick = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Place.findByIdAndUpdate(id, { $inc: { bookmarks: 1 } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
