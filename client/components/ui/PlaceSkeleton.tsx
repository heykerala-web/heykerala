import React from 'react';

const PlaceSkeleton = () => {
    return (
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-full flex flex-col animate-pulse">
            {/* Image Skeleton */}
            <div className="w-full h-48 bg-gray-200"></div>

            {/* Content Skeleton */}
            <div className="p-5 flex-1 flex flex-col">
                {/* Title */}
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>

                {/* Location */}
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>

                {/* Description */}
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>

                {/* Button */}
                <div className="mt-auto h-10 bg-gray-200 rounded-xl w-full"></div>
            </div>
        </div>
    );
};

export default PlaceSkeleton;
