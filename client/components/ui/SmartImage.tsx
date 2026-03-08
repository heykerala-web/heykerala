"use client";

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { getFallbackImage, getFullImageUrl } from '@/lib/images';
import { cn } from '@/lib/utils';

/**
 * ARCHITECT-GRADE SMART IMAGE COMPONENT
 * 
 * Features:
 * 1. ZERO Layout Shift: Uses aspect-ratio or fixed dimensions.
 * 2. Multi-tier Fallbacks: Handles broken links via category-based curated static images.
 * 3. Next.js Optimized: Integrates with next/image for automatic compression/lazy-loading.
 * 4. Hydration Safe: State management for error handling doesn't block initial render.
 */

interface SmartImageProps extends Omit<ImageProps, 'src'> {
    src: string | null | undefined;
    category?: 'restaurant' | 'place' | 'stay' | 'event' | 'default';
    aspectRatio?: 'square' | 'video' | 'portrait' | 'wide' | 'none';
    images?: string[];
    fallbackName?: string;
    containerClassName?: string;
    updatedAt?: string | Date;
}

export const SmartImage: React.FC<SmartImageProps> = ({
    src,
    images = [],
    alt,
    category = 'default',
    aspectRatio = 'video',
    fallbackName,
    className,
    containerClassName,
    fill = true, // Default to fill for flexible containers
    updatedAt,
    ...props
}) => {
    const [imgSrc, setImgSrc] = useState<string>('');
    const [hasError, setHasError] = useState(false);

    // Determine the initial source
    useEffect(() => {
        const initialSrc = getFullImageUrl(src, fallbackName, category, images, updatedAt);
        setImgSrc(initialSrc);
        setHasError(false);
    }, [src, category, fallbackName, images, updatedAt]);

    const handleError = () => {
        if (hasError) return; // Prevent cascade loops

        setHasError(true);
        // Step back to static curated fallback
        setImgSrc(getFallbackImage(category));
    };

    // Aspect Ratio mapping
    const ratioClasses = {
        square: 'aspect-square',
        video: 'aspect-video',
        portrait: 'aspect-[3/4]',
        wide: 'aspect-[21/9]',
        none: '',
    };

    return (
        <div className={cn(
            "relative overflow-hidden bg-gray-50 dark:bg-gray-800",
            ratioClasses[aspectRatio],
            containerClassName
        )}>
            {/* Shimmer/Skeleton placeholder */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-shimmer opacity-100" />

            {imgSrc && (
                <Image
                    priority={props.priority}
                    quality={props.quality || 75}
                    sizes={props.sizes || "33vw"}
                    {...props}
                    src={imgSrc}
                    alt={alt || fallbackName || 'Hey Kerala Tourism'}
                    fill={fill}
                    className={cn(
                        "object-cover transition-all duration-700 opacity-0",
                        hasError ? "scale-105 saturate-[1.1]" : "scale-100",
                        className
                    )}
                    onError={handleError}
                    onLoadingComplete={(img) => {
                        img.classList.replace("opacity-0", "opacity-100");
                    }}
                    loading={props.priority ? undefined : "lazy"}
                />
            )}
        </div>
    );
};
