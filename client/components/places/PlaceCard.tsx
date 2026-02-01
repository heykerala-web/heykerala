import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';
import { Place } from '@/services/placeService';
import { Button } from '@/components/ui/button';

interface PlaceCardProps {
    place: Place;
    viewMode?: 'grid' | 'list' | 'map';
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, viewMode = 'grid' }) => {
    if (viewMode === 'list') {
        return (
            <Link
                href={`/places/${place._id}`}
                className="group bg-card rounded-[2rem] border border-border p-6 flex flex-col md:flex-row gap-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            >
                <div className="relative w-full md:w-56 h-48 flex-shrink-0 overflow-hidden rounded-[1.5rem] shadow-inner">
                    <img
                        src={place.images?.[0] || place.image || "/placeholder.svg"}
                        alt={place.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </div>
                <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className="font-outfit font-bold text-2xl md:text-3xl mb-1 text-foreground group-hover:text-primary transition-colors">
                                {place.name}
                            </h3>
                            <div className="flex items-center text-muted-foreground font-medium text-sm">
                                <MapPin className="h-4 w-4 mr-1.5 text-primary" />
                                {place.location}
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 bg-muted/80 backdrop-blur-md rounded-full px-4 py-2 border border-border shadow-sm">
                            <Star className="h-4 w-4 text-accent fill-accent" />
                            <span className="font-bold text-foreground text-base">{place.ratingAvg || 0}</span>
                        </div>
                    </div>
                    <p className="text-muted-foreground mb-6 line-clamp-2 md:line-clamp-3 text-sm leading-relaxed font-inter font-light">
                        {place.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                        <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">
                            {place.category}
                        </span>
                        <Button size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl px-8 h-10 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 active:scale-95 transition-all">
                            Explore
                        </Button>
                    </div>
                </div>
            </Link>
        );
    }

    // Grid View (Default)
    return (
        <Link
            href={`/places/${place._id}`}
            className="group bg-card rounded-[2rem] border border-border overflow-hidden hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 h-full flex flex-col shadow-sm"
        >
            <div className="relative overflow-hidden h-48 sm:h-56">
                <img
                    src={place.images?.[0] || place.image || "/placeholder.svg"}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 shadow-sm border border-black/5">
                    <Star className="h-4 w-4 text-accent fill-accent" />
                    <span className="text-sm font-bold text-foreground">{place.ratingAvg || 0}</span>
                </div>
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary/95 backdrop-blur-md text-white text-[10px] uppercase tracking-[0.2em] font-bold rounded-full border border-white/20">
                        {place.category}
                    </span>
                </div>
                <div className="absolute bottom-4 left-6 right-6 text-white overflow-hidden">
                    <h3 className="font-outfit font-bold text-2xl leading-tight mb-1 drop-shadow-md group-hover:text-accent transition-colors">
                        {place.name}
                    </h3>
                    <div className="flex items-center text-white/90 text-xs font-bold uppercase tracking-widest">
                        <MapPin className="h-3.5 w-3.5 mr-1.5 text-accent" />
                        {place.location}
                    </div>
                </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 leading-relaxed font-inter font-light">
                    {place.description}
                </p>
                <div className="mt-auto">
                    <Button className="w-full bg-primary hover:bg-primary/95 text-primary-foreground rounded-2xl h-12 font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 active:scale-95 transition-all">
                        Explore Now
                    </Button>
                </div>
            </div>
        </Link>
    );
};

export default PlaceCard;
