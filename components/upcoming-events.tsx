import { EventCard } from "./event-card"

const events = [
  {
    id: "e1",
    name: "Onam Festival Celebration",
    date: "Aug 29, 2025",
    time: "10:00 AM",
    location: "Thiruvananthapuram",
    image: "/onam-festival-pookalam-kathakali.png",
    description: "Traditional dance, music, pookalam and sumptuous feast celebrating Kerala's grand festival.",
    category: "Festival",
  },
  {
    id: "e2",
    name: "Theyyam Performance",
    date: "Sep 15, 2025",
    time: "7:00 PM",
    location: "Kannur",
    image: "/theyyam-performance-ritual-art.png",
    description: "Witness the breathtaking ritual art form of North Kerala in its full grandeur.",
    category: "Cultural",
  },
  {
    id: "e3",
    name: "Boat Race Championship",
    date: "Oct 12, 2025",
    time: "2:00 PM",
    location: "Alleppey",
    image: "/snake-boat-race-kerala.png",
    description: "Thrilling snake boat races and crowds cheering along the serene backwaters.",
    category: "Sports",
  },
  {
    id: "e4",
    name: "Spice Festival",
    date: "Nov 5, 2025",
    time: "9:00 AM",
    location: "Kumily",
    image: "/kerala-spice-market-festival.png",
    description: "Dive into Kerala's spices, aromas and culinary showcases by local artisans.",
    category: "Food",
  },
]

export function UpcomingEvents() {
  return (
    <section aria-labelledby="upcoming-events-heading">
      <div className="text-center mb-8">
        <h2 id="upcoming-events-heading" className="text-3xl md:text-4xl font-bold text-gray-900">
          Upcoming Events & Festivals
        </h2>
        <p className="mt-2 text-gray-600">Join the vibrant celebrations happening across Kerala</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {events.map((e) => (
          <EventCard key={e.id} {...e} />
        ))}
      </div>
    </section>
  )
}
