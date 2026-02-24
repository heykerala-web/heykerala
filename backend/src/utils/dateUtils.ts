export const isPastDate = (date: Date | string): boolean => {
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate < today;
};

export const isValidDateRange = (startDate: Date | string, endDate: Date | string): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return end >= start;
};

export const toIST = (date: Date | string): string => {
    return new Date(date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
};
