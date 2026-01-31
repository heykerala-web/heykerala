export interface Review {
    _id: string;
    user: {
        _id: string;
        name: string;
        avatar?: string;
    };
    place: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface CreateReviewData {
    placeId: string;
    rating: number;
    comment: string;
}
