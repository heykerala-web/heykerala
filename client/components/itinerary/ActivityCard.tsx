import { SmartImage } from "../ui/SmartImage";

interface Activity {
  time: string;
  name: string;
  desc: string;
  image: string;
  duration: string;
  cost: number;
  lat: number;
  lng: number;
}

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  // Determine if this is a food-related activity
  const foodTerms = ['breakfast', 'lunch', 'dinner', 'restaurant', 'meal', 'food', 'cafe', 'dining', 'cuisine', 'dish', 'curry'];
  const isFood = foodTerms.some(term => activity.name.toLowerCase().includes(term) || activity.desc.toLowerCase().includes(term));

  // Map to SmartImage supported categories
  const category: any = isFood ? 'restaurant' : 'place';

  const handleViewOnMap = () => {
    const mapElement = document.getElementById('itinerary-map');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Trigger map focusing
      window.dispatchEvent(new CustomEvent('focus-map-location', {
        detail: { lat: activity.lat, lng: activity.lng, name: activity.name }
      }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="relative h-48 bg-gray-100 flex-shrink-0">
        <SmartImage
          src={activity.image}
          alt={activity.name}
          fallbackName={activity.name}
          category={category}
          aspectRatio="none"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
          {activity.time}
        </div>
        {activity.duration && (
          <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs z-10">
            ⏱️ {activity.duration}
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{activity.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{activity.desc}</p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 gap-2">
          <button
            onClick={handleViewOnMap}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors font-semibold outline-none"
            aria-label={`View ${activity.name} on map`}
          >
            <span>📍</span>
            <span className="text-xs decoration-dotted underline underline-offset-4">View on Map</span>
          </button>
          <div className="flex items-center gap-1">
            {activity.cost > 0 && (
              <span className="text-emerald-700 font-bold">
                ₹{activity.cost}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}








