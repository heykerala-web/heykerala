"use client";

import React, { useState, useEffect } from 'react';
import { getTourismImage, getFullImageUrl } from '@/lib/images';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackName?: string;
    fallbackCategory?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
    src,
    alt,
    fallbackName,
    fallbackCategory,
    className,
    ...props
}) => {
    const [imgSrc, setImgSrc] = useState<string>(src as string);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(src as string);
        setHasError(false);
    }, [src]);

    const handleError = () => {
        if (hasError) return; // Prevent infinite loops

        setHasError(true);
        if (fallbackName && fallbackCategory) {
            setImgSrc(getTourismImage(fallbackName, fallbackCategory));
        } else {
            // Last resort fallback
            setImgSrc('https://image.pollinations.ai/prompt/Kerala%20Tourism%20Scenic?width=800&height=600&nologo=true');
        }
    };

    return (
        <img
            {...props}
            src={imgSrc}
            alt={alt}
            className={className}
            onError={handleError}
        />
    );
};
