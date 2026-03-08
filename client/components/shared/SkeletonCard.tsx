"use client"

import React from "react"

interface SkeletonCardProps {
    variant?: 'place' | 'stay' | 'event'
}

export const SkeletonCard = ({ variant = 'place' }: SkeletonCardProps) => {
    return (
        <div className="group relative h-full flex flex-col rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden animate-pulse">
            <div className={`relative ${variant === 'event' ? 'h-56' : 'h-64'} bg-gray-200`} />

            <div className="flex flex-col flex-1 p-5 space-y-4">
                <div className="h-6 bg-gray-200 rounded-full w-3/4" />

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded-full" />
                        <div className="h-4 bg-gray-200 rounded-full w-1/2" />
                    </div>
                    {variant === 'event' && (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 bg-gray-200 rounded-full" />
                            <div className="h-4 bg-gray-200 rounded-full w-1/3" />
                        </div>
                    )}
                </div>

                <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded-full w-full" />
                    <div className="h-4 bg-gray-200 rounded-full w-5/6" />
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded-full w-24" />
                    <div className="h-4 bg-gray-200 rounded-full w-4" />
                </div>
            </div>
        </div>
    )
}
