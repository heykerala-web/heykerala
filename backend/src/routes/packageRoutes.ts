import express from "express";
import { getPackages, getPackageById } from "../controllers/packageController";
 const router = express.Router();
 router.get("/", getPackages);
 router.get("/:id", getPackageById);
 export default router;