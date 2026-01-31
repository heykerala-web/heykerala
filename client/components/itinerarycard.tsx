type ItineraryDay = {
  day: number;
  place: string;
  activities: string[];
  notes?: string;
};

interface ItineraryCardProps {
  day: ItineraryDay;
}

export default function ItineraryCard({ day }: ItineraryCardProps) {
  return (
    <div className="bg-white p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold">
        Day {day.day}: {day.place}
      </h2>

      <ul className="mt-2 list-disc pl-6">
        {day.activities.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>

      {day.notes && (
        <p className="mt-2 text-sm text-gray-600">{day.notes}</p>
      )}
    </div>
  );
}
