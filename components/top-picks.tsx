"use client"

import { useState } from "react"
import Link from "next/link"
import { Star, MapPin, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

const topPicks = [
  {
    id: "1",
    name: "Munnar Tea Gardens",
    location: "Munnar, Idukki",
    image: "/munnar-tea-plantation.png",
    rating: 4.8,
    reviews: 1250,
    category: "Hill Station",
    price: "Free",
    description: "Rolling hills covered in emerald tea plantations",
  },
  {
    id: "2",
    name: "Alleppey Backwaters",
    location: "Alleppey, Alappuzha",
    image: "/kerala-backwaters-boat.png",
    rating: 4.9,
    reviews: 2100,
    category: "Backwaters",
    price: "₹2,500+",
    description: "Serene houseboat cruises through palm-lined canals",
  },
  {
    id: "3",
    name: "Kovalam Beach",
    location: "Kovalam, Thiruvananthapuram",
    image: "/kovalam-beach-palm-trees.png",
    rating: 4.6,
    reviews: 890,
    category: "Beach",
    price: "Free",
    description: "Crescent-shaped beach with lighthouse views",
  },
  {
    id: "4",
    name: "Periyar Wildlife Sanctuary",
    location: "Thekkady, Idukki",
    image: "/periyar-wildlife-sanctuary-lake.png",
    rating: 4.7,
    reviews: 1560,
    category: "Wildlife",
    price: "₹300+",
    description: "Spot elephants and exotic birds in pristine forests",
  },
]

export function TopPicks() {
  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-2">Top Picks for You</h2>
          <p className="text-gray-600">Handpicked destinations loved by travelers</p>
        </div>
        <Button variant="outline" className="hidden md:flex bg-transparent">
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topPicks.map((place) => (
          <div
            key={place.id}
            className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative">
              <img
                src={place.image || "/placeholder.svg"}
                alt={place.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={() => toggleFavorite(place.id)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
              >
                <Heart
                  className={`h-4 w-4 ${favorites.includes(place.id) ? "text-red-500 fill-red-500" : "text-gray-600"}`}
                />
              </button>
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 bg-kerala-green text-white text-xs font-medium rounded-full">
                  {place.category}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-poppins font-semibold text-lg line-clamp-1">{place.name}</h3>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{place.rating}</span>
                </div>
              </div>

              <div className="flex items-center text-gray-600 text-sm mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {place.location}
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{place.description}</p>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">{place.reviews} reviews</div>
                <div className="font-semibold text-kerala-green">{place.price}</div>
              </div>

              <Link href={`/places/${place.id}`}>
                <Button className="w-full mt-3 bg-kerala-green hover:bg-kerala-green/90">View Details</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
