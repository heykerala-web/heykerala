export type Place = {
  id: string
  name: string
  location: string
  image: string
  rating: number
  description: string
  longDescription: string
  highlights: string[]
  category: string
}

export type Hotel = {
  id: string
  name: string
  location: string
  image: string
  rating: number
  price: number
  amenities: string[]
}

export type Event = {
  id: string
  name: string
  date: string
  time: string
  location: string
  image: string
  description: string
  category: string
}

export const places: Place[] = [
  {
    id: "1",
    name: "Munnar Tea Gardens",
    location: "Munnar, Idukki",
    image: "/munnar-tea-plantation.png",
    rating: 4.8,
    description: "Endless tea plantations in the Western Ghats with cool breeze and scenic viewpoints.",
    longDescription:
      "Munnar is famous for sprawling tea estates, misty hills, and serene viewpoints. Wake up to the scent of tea leaves and enjoy winding roads that reveal breathtaking vistas.",
    highlights: ["Tea estates", "Scenic viewpoints", "Cool climate", "Trekking"],
    category: "Hill Station",
  },
  {
    id: "2",
    name: "Alleppey Backwaters",
    location: "Alleppey, Alappuzha",
    image: "/kerala-backwaters-boat.png",
    rating: 4.9,
    description: "Serene canals and lagoons, perfect for houseboat cruises and village life views.",
    longDescription:
      "Alleppey offers a network of tranquil canals and lagoons. Experience houseboat stays, coconut groves, and the slow rhythm of backwater life.",
    highlights: ["Houseboats", "Canals & lagoons", "Village life", "Sunsets"],
    category: "Backwaters",
  },
  {
    id: "3",
    name: "Kovalam Beach",
    location: "Kovalam, Thiruvananthapuram",
    image: "/kovalam-beach-palm-trees.png",
    rating: 4.6,
    description: "Golden sand, calm waters and a laid-back vibe along the palm-lined coast.",
    longDescription:
      "Kovalam is a beach lover's paradise with golden sands, palm-lined shores, and calm waters ideal for swimming and sunbathing.",
    highlights: ["Lighthouse", "Golden sands", "Seafood", "Sunrise"],
    category: "Beach",
  },
  {
    id: "4",
    name: "Periyar Wildlife Sanctuary",
    location: "Thekkady, Idukki",
    image: "/periyar-wildlife-sanctuary-lake.png",
    rating: 4.7,
    description: "Lush forests with elephants, birds and boat safaris on the Periyar Lake.",
    longDescription:
      "Periyar is known for rich biodiversity and scenic boat rides on the lake. Spot elephants, birds, and enjoy the wilderness of the Western Ghats.",
    highlights: ["Boat safari", "Elephants", "Birdlife", "Spice gardens"],
    category: "Wildlife",
  },
]

export const hotels: Hotel[] = [
  {
    id: "h1",
    name: "Backwater Resort Kumarakom",
    location: "Kumarakom, Kottayam",
    image: "/luxury-backwater-resort-kerala.png",
    rating: 4.8,
    price: 8500,
    amenities: ["WiFi", "Restaurant", "Parking"],
  },
  {
    id: "h2",
    name: "Hill View Resort Munnar",
    location: "Munnar, Idukki",
    image: "/munnar-hill-resort-fog-valley.png",
    rating: 4.7,
    price: 6200,
    amenities: ["WiFi", "Restaurant", "Parking"],
  },
  {
    id: "h3",
    name: "Beach Resort Kovalam",
    location: "Kovalam, Thiruvananthapuram",
    image: "/kovalam-beach-resort-sea-view.png",
    rating: 4.6,
    price: 7800,
    amenities: ["WiFi", "Restaurant", "Parking"],
  },
  {
    id: "h4",
    name: "Heritage Hotel Kochi",
    location: "Fort Kochi, Ernakulam",
    image: "/colonial-heritage-hotel-kochi.png",
    rating: 4.9,
    price: 9200,
    amenities: ["WiFi", "Restaurant", "Parking"],
  },
]

export const events: Event[] = [
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

// Helpers
export function getPlaceById(id: string) {
  return places.find((p) => p.id === id)
}
export function getHotelById(id: string) {
  return hotels.find((h) => h.id === id)
}
export function getEventById(id: string) {
  return events.find((e) => e.id === id)
}
