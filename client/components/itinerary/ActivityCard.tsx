"use client";

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
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <img
          src={activity.image}
          alt={activity.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {activity.time}
        </div>
        {activity.duration && (
          <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs">
            ⏱️ {activity.duration}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{activity.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{activity.desc}</p>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-emerald-600">
            <span>📍</span>
            <span className="text-xs">View on Map</span>
          </div>
          {activity.cost > 0 && (
            <div className="text-emerald-700 font-semibold">
              ₹{activity.cost}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}








