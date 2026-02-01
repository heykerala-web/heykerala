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
        <div className="absolute top-4 bottom-4 left-4 md:left-[500px] lg:left-[520px] w-[calc(100%-32px)] md:w-[420px] lg:w-[480px] bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl z-50 flex flex-col overflow-hidden border border-white/40 animate-in slide-in-from-left-8 fade-in duration-500">

            {/* Header Image Area */}
            <div className="relative h-80 flex-shrink-0">
                <img
                    src={place.images?.[0] || place.image || "/placeholder.svg"}
                    alt={place.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md h-12 w-12"
                >
                    <X className="h-6 w-6" />
                </Button>

                <div className="absolute bottom-8 left-8 right-8 text-white">
                    <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-primary text-primary-foreground border-none text-[10px] font-bold tracking-widest uppercase">
                            {place.category}
                        </Badge>
                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[10px] font-semibold">
                            <Star className="h-3 w-3 fill-accent text-accent" />
                            {place.ratingAvg}
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">{place.name}</h2>
                    <div className="flex items-center gap-1.5 text-white/80 text-sm">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span>{place.district}, Kerala</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
                <div className="p-6 space-y-8">

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-14 rounded-2xl font-bold text-base shadow-lg shadow-primary/20 transition-all active:scale-95">
                            Plan This Trip
                        </Button>
                        <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-muted hover:bg-muted transition-all">
                            <Heart className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">The Experience</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {place.description}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {place.tags?.map((tag: string) => (
                                <span key={tag} className="text-[10px] px-3 py-1.5 bg-muted rounded-full text-muted-foreground font-bold uppercase tracking-wider">
                                    #{tag}
                                </span>
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
