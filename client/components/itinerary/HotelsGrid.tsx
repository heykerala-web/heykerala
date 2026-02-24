import { SmartImage } from "../ui/SmartImage";

interface Hotel {
  id: string;
  name: string;
  price: number;
  rating: number;
  distanceKm: number;
  image: string;
}

interface HotelsGridProps {
  hotels: Hotel[];
}

export default function HotelsGrid({ hotels }: HotelsGridProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span>🏨</span>
        Recommended Hotels
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <SmartImage
                src={hotel.image}
                alt={hotel.name}
                fallbackName={hotel.name}
                category="stay"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold z-10">
                ⭐ {hotel.rating}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{hotel.name}</h3>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>📍 {hotel.distanceKm} km away</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-2xl font-bold text-emerald-600">
                  ₹{hotel.price.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">/night</span>
              </div>

              <button className="w-full mt-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}








