import Link from "next/link"

const categories = [
  {
    name: "Attractions",
    description: "Hills, beaches, backwaters & more",
    href: "/where-to-go?tab=attractions",
    gradient: "from-emerald-400 to-emerald-600",
    count: "150+ places",
    image: "/munnar-tea-gardens-rolling-green-hills.png",
    icon: "🏔️",
  },
  {
    name: "Art & Culture",
    description: "Museums, galleries & heritage",
    href: "/where-to-go?tab=culture",
    gradient: "from-purple-400 to-purple-600",
    count: "80+ venues",
    image: "https://images.mid-day.com/images/images/2025/sep/5onam2025-1756966932795_d.png",
    icon: "🎨",
  },
  {
    name: "Picnic Spots",
    description: "Family-friendly outdoor spaces",
    href: "/where-to-go?tab=picnic",
    gradient: "from-orange-400 to-orange-600",
    count: "60+ spots",
    image: "https://www.singlefaretaxi.com/blog/wp-content/uploads/2021/12/best-treehouses-in-thekkady-850x550.jpg",
    icon: "🧺",
  },
  {
    name: "Regions",
    description: "Explore by districts & cities",
    href: "/where-to-go?tab=regions",
    gradient: "from-blue-400 to-blue-600",
    count: "14 districts",
    image: "https://s3.india.com/wp-content/uploads/2024/12/Eco-friendly-Travel-In-Kerala.jpg?impolicy=Medium_Widthonly&w=350&h=263",
    icon: "🗺️",
  },
  {
    name: "Spirituality",
    description: "Temples, churches & sacred sites",
    href: "/where-to-go?tab=spirituality",
    gradient: "from-yellow-400 to-yellow-600",
    count: "200+ sites",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEguiGbHL-SPNaVwoXBAMDPuUp44_wm1U9-M7-D-oz8PVGEDV7LiPcSDedl89Qb68TTZtHnphRRwahn8_a55uJWdjoGdfHNkzav1dCN6eYo-6FpBbvGiNbd93SGKElaeXNjMbvcY1wkBE2l8/s1600/Discourse+1.jpg",
    icon: "🛕",
  },
  {
    name: "Plan Trip",
    description: "Complete travel planning guide",
    href: "/plan-trip",
    gradient: "from-red-400 to-red-600",
    count: "All services",
    image: "https://i.ytimg.com/vi/-GbLgJ2eOZk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDe-_wukB4wPC7NYk4FhKBgw5f5Og",
    icon: "📋",
  },
]

export function CategoryGrid() {
  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-4">Explore Kerala by Category</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover the diverse experiences that make Kerala truly God&apos;s Own Country
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
          >
            {/* Background Image */}
            <div className="aspect-[4/3] relative">
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
              />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              {/* Count Badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-sm font-semibold text-gray-800">{category.count}</span>
              </div>

              {/* Icon */}
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>

              {/* Title and Description */}
              <h3 className="font-poppins text-2xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                {category.name}
              </h3>
              <p className="text-white/90 text-sm mb-4 leading-relaxed">{category.description}</p>

              {/* CTA */}
              <div className="flex items-center text-white font-medium group-hover:text-yellow-300 transition-colors">
                <span className="mr-2">Explore now</span>
                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              </div>
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-3xl transition-all duration-300" />
          </Link>
        ))}
      </div>
    </section>
  )
}
