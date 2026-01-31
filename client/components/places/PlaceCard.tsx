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
                href={`/places/${place._id}`} // Use _id as per MongoDB, assuming backend returns _id. Or slug if preferred. Using _id for now based on service type.
                className="group bg-white rounded-3xl shadow-lg p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-all duration-300"
            >
                <div className="relative w-full md:w-48 h-48 flex-shrink-0 overflow-hidden rounded-2xl">
                    <img
                        src={place.image || "/placeholder.svg"}
                        alt={place.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>
                <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className="font-poppins font-semibold text-xl md:text-2xl mb-1 group-hover:text-emerald-700 transition-colors">
                                {place.name}
                            </h3>
                            <div className="flex items-center text-gray-600 mb-2">
                                <MapPin className="h-4 w-4 mr-1 text-emerald-600" />
                                {place.location}
                            </div>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-50 rounded-full px-3 py-1 shadow-sm border border-gray-100">
                            <Star className="h-4 w-4 text-emerald-500 fill-emerald-500" />
                            <span className="font-semibold text-gray-700">{place.ratingAvg || 0}</span>
                        </div>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2 md:line-clamp-3 text-sm leading-relaxed">
                        {place.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
                            {place.category}
                        </span>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6">
                            View Details
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
            className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col"
        >
            <div className="relative overflow-hidden h-48 sm:h-56">
                <img
                    src={place.image || "/placeholder.svg"}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
                    <Star className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500" />
                    <span className="text-xs font-bold text-gray-800">{place.ratingAvg || 0}</span>
                </div>
                <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-bold rounded-full">
                        {place.category}
                    </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-poppins font-bold text-lg leading-tight mb-0.5 text-shadow-sm">
                        {place.name}
                    </h3>
                    <div className="flex items-center text-white/90 text-xs font-medium">
                        <MapPin className="h-3 w-3 mr-1" />
                        {place.location}
                    </div>
                </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {place.description}
                </p>
                <div className="mt-auto">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 font-medium tracking-wide">
                        Explore
                    </Button>
                </div>
            </div>
        </Link>
    );
};

export default PlaceCard;
