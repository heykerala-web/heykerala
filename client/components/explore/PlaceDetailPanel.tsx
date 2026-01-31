import { X, Star, MapPin, Share2, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface PlaceDetailPanelProps {
    place: any;
    onClose: () => void;
}

export function PlaceDetailPanel({ place, onClose }: PlaceDetailPanelProps) {
    if (!place) return null;

    return (
        <div className="absolute top-4 bottom-4 left-4 md:left-[470px] lg:left-[520px] w-[calc(100%-32px)] md:w-[400px] lg:w-[450px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-left-4 fade-in duration-300">

            {/* Header Image Area */}
            <div className="relative h-64 flex-shrink-0">
                <img
                    src={place.images?.[0] || place.image || "/placeholder.svg"}
                    alt={place.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md"
                >
                    <X className="h-5 w-5" />
                </Button>

                <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h2 className="text-3xl font-bold mb-2 shadow-sm">{place.name}</h2>
                    <div className="flex items-center gap-4 text-sm font-medium">
                        <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {place.ratingAvg || "New"} ({place.totalReviews || 0})
                        </span>
                        <span className="flex items-center gap-1 px-2 py-1">
                            <MapPin className="h-4 w-4" />
                            {place.location || place.district}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
                <div className="p-6 space-y-8">

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button className="flex-1 bg-black text-white hover:bg-gray-800 rounded-xl h-12">
                            Add to Trip
                        </Button>
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-gray-200">
                            <Heart className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-gray-200">
                            <Share2 className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="font-bold text-lg mb-3">About</h3>
                        <p className="text-gray-600 leading-relaxed text-base">
                            {place.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {place.tags?.map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Gallery (Small preview) */}
                    {place.images && place.images.length > 1 && (
                        <div>
                            <h3 className="font-bold text-lg mb-3">Gallery</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {place.images.slice(1, 4).map((img: string, i: number) => (
                                    <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                                        <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Link href={`/places/${place._id}`} target="_blank" className="block">
                        <Button variant="outline" className="w-full rounded-xl h-12 border-gray-200 text-gray-600 hover:text-black hover:border-black">
                            View Full Details <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </ScrollArea>
        </div>
    );
}
