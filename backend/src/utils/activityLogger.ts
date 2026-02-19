import ActivityLog from "../models/ActivityLog";

export const logActivity = async (
    userId: string | undefined | null,
    action: string,
    details?: string,
    req?: any
) => {
    try {
        await ActivityLog.create({
            user: userId || null,
            action,
            details,
            ip: req?.ip || req?.connection?.remoteAddress,
            userAgent: req?.get('User-Agent') || 'Unknown'
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};
