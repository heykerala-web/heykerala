export interface Review {
    _id: string;
    user: {
        _id: string;
        name: string;
        avatar?: string;
    };
    targetId: string;
    targetType: "place" | "stay" | "event";
    rating: number;
    title?: string;
    comment: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReviewData {
    targetId: string;
    targetType: "place" | "stay" | "event";
    rating: number;
    title?: string;
    comment: string;
}

export interface UpdateReviewData {
    rating?: number;
    title?: string;
    comment?: string;
}
