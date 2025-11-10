import { PlaceCard } from "./place-card"

const topPlaces = [
  {
    id: "1",
    name: "Munnar Tea Gardens",
    location: "Munnar, Idukki",
    image: "/munnar-tea-plantation.png",
    rating: 4.8,
    description: "Endless tea plantations in the Western Ghats with cool breeze and scenic viewpoints.",
    category: "Hill Station",
  },
  {
    id: "2",
    name: "Alleppey Backwaters",
    location: "Alleppey, Alappuzha",
    image: "/kerala-backwaters-boat.png",
    rating: 4.9,
    description: "Serene canals and lagoons, perfect for houseboat cruises and village life views.",
    category: "Backwaters",
  },
  {
    id: "3",
    name: "Kovalam Beach",
    location: "Kovalam, Thiruvananthapuram",
    image: "/kovalam-beach-palm-trees.png",
    rating: 4.6,
    description: "Golden sand, calm waters and a laid-back vibe along the palm-lined coast.",
    category: "Beach",
  },
  {
    id: "4",
    name: "Periyar Wildlife Sanctuary",
    location: "Thekkady, Idukki",
    image: "/periyar-wildlife-sanctuary-lake.png",
    rating: 4.7,
    description: "Lush forests with elephants, birds and boat safaris on the Periyar Lake.",
    category: "Wildlife",
  },
]

export function TopPlaces() {
  return (
    <section aria-labelledby="top-places-heading">
      <div className="text-center mb-8">
        <h2 id="top-places-heading" className="text-3xl md:text-4xl font-bold text-gray-900">
          Top Places in Kerala
        </h2>
        <p className="mt-2 text-gray-600">Discover the most loved destinations across God&apos;s Own Country</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {topPlaces.map((p) => (
          <PlaceCard key={p.id} {...p} />
        ))}
      </div>
    </section>
  )
}
