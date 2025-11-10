import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Contact from '../models/Contact';

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 100 })
      .withMessage('Name cannot be more than 100 characters'),
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ max: 1000 })
      .withMessage('Message cannot be more than 1000 characters'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { name, email, message } = req.body;

      // Create contact submission
      const contact = await Contact.create({
        name,
        email,
        message,
      });

      res.status(201).json({
        success: true,
        message: 'Thank you for contacting us! We will get back to you soon.',
        data: {
          id: contact._id,
          name: contact.name,
          email: contact.email,
        },
      });
    } catch (error: any) {
      console.error('Contact submission error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during contact submission',
        error: error.message,
      });
    }
  }
);

// @route   GET /api/contact
// @desc    Get all contact submissions (admin only - should add auth)
// @access  Private (should be protected)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error: any) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

export default router;

