import { HotelCard } from "./hotel-card"

const featuredHotels = [
  {
    id: "h1",
    name: "Backwater Resort Kumarakom",
    location: "Kumarakom, Kottayam",
    image: "/stay/beach-safarihomestay.jpg",
    rating: 4.8,
    price: 8500,
    amenities: ["WiFi", "Restaurant", "Parking"],
  },
  {
    id: "h2",
    name: "Hill View Resort Munnar",
    location: "Munnar, Idukki",
    image: "/stay/green-gates-hotel.jpg",
    rating: 4.7,
    price: 6200,
    amenities: ["WiFi", "Restaurant", "Parking"],
  },
  {
    id: "h3",
    name: "Beach Resort Kovalam",
    location: "Kovalam, Thiruvananthapuram",
    image: "/stay/zostel-kochi.jpg",
    rating: 4.6,
    price: 7800,
    amenities: ["WiFi", "Restaurant", "Parking"],
  },
  {
    id: "h4",
    name: "Heritage Hotel Kochi",
    location: "Fort Kochi, Ernakulam",
    image: "/stay/the-terracecafe.jpg",
    rating: 4.9,
    price: 9200,
    amenities: ["WiFi", "Restaurant", "Parking"],
  },
]

export function FeaturedHotels() {
  return (
    <section aria-labelledby="featured-hotels-heading">
      <div className="text-center mb-8">
        <h2 id="featured-hotels-heading" className="text-3xl md:text-4xl font-outfit font-bold text-foreground">
          Featured Hotels & Resorts
        </h2>
        <p className="mt-2 text-muted-foreground">Stay in comfort and luxury at Kerala&apos;s finest accommodations</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {featuredHotels.map((h) => (
          <HotelCard key={h.id} {...h} />
        ))}
      </div>
    </section>
  )
}
