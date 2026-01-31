import Package from "../models/Package";
import { Request, Response, NextFunction } from "express";

export const getPackages = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const packs = await Package.find().lean();
		res.json(packs);
	} catch (err) {
		next(err);
	}
};

export const getPackageById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const pack = await Package.findById(req.params.id).lean();
		if (!pack) return res.status(404).json({ message: "Package not found" });
		res.json(pack);
	} catch (err) {
		next(err);
	}
};