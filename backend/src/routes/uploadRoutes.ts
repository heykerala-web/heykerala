import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

import { upload } from "../middleware/uploadMiddleware";

// Endpoint: POST /api/upload
router.post("/", upload.single("image"), (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // Construct public URL
        // Assumes backend serves /uploads static folder
        const imageUrl = `/uploads/${req.file.filename}`;

        res.json({
            success: true,
            url: imageUrl,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Upload failed", error: error.message });
    }
});

export default router;
