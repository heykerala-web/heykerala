"use client";

import { useState } from "react";
import { Grid, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlaceGalleryProps {
    images: string[];
    name: string;
}

export default function PlaceGallery({ images, name }: PlaceGalleryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Use up to 5 images for the grid
    const displayImages = images.slice(0, 5);

    // Fill with placeholders if less than 5 images
    while (displayImages.length < 5) {
        displayImages.push("/placeholder.svg");
    }

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setIsOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        setIsOpen(false);
        document.body.style.overflow = "auto";
    };

    const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="relative group">
            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 h-[400px] md:h-[550px] rounded-3xl overflow-hidden shadow-2xl">
                {/* Main large image */}
                <div
                    className="md:col-span-2 md:row-span-2 relative cursor-pointer overflow-hidden"
                    onClick={() => openLightbox(0)}
                >
                    <img
                        src={displayImages[0]}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                </div>

                {/* 4 Smaller images */}
                {displayImages.slice(1).map((img, idx) => (
                    <div
                        key={idx}
                        className="hidden md:block relative cursor-pointer overflow-hidden"
                        onClick={() => openLightbox(idx + 1)}
                    >
                        <img
                            src={img}
                            alt={`${name} ${idx + 2}`}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                    </div>
                ))}

                <Button
                    onClick={() => openLightbox(0)}
                    className="absolute bottom-6 right-6 bg-white/90 hover:bg-white text-black font-semibold rounded-xl border-none shadow-xl flex gap-2 py-6 px-6 backdrop-blur-md"
                >
                    <Grid className="h-5 w-5" />
                    Show all photos
                </Button>
            </div>

            {/* Lightbox Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="flex justify-between items-center p-6 text-white">
                        <span className="font-medium">{currentIndex + 1} / {images.length}</span>
                        <button onClick={closeLightbox} className="p-3 hover:bg-white/10 rounded-full transition-colors">
                            <X className="h-8 w-8" />
                        </button>
                    </div>

                    <div className="flex-1 relative flex items-center justify-center p-4 md:p-12">
                        <button
                            onClick={prevImage}
                            className="absolute left-4 md:left-8 p-4 hover:bg-white/10 rounded-full text-white transition-all hover:scale-110"
                        >
                            <ChevronLeft className="h-10 w-10" />
                        </button>

                        <img
                            src={images[currentIndex]}
                            alt={`${name} gallery`}
                            className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                        />

                        <button
                            onClick={nextImage}
                            className="absolute right-4 md:right-8 p-4 hover:bg-white/10 rounded-full text-white transition-all hover:scale-110"
                        >
                            <ChevronRight className="h-10 w-10" />
                        </button>
                    </div>

                    <div className="p-8 text-center text-white/60 text-sm font-medium">
                        {name} &copy; HeyKerala Premium Gallery
                    </div>
                </div>
            )}
        </div>
    );
}
