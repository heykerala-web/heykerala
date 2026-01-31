import Link from "next/link"

const categories = [
  {
    name: "Hill Station",
    description: "Misty mountains & tea gardens",
    href: "/explore/category/Hill Station",
    gradient: "from-emerald-400 to-emerald-600",
    count: "10+ places",
    image: "/munnar-tea-gardens-rolling-green-hills.png",
    icon: "🏔️",
  },
  {
    name: "Beach",
    description: "Sun, sand & sea",
    href: "/explore/category/Beach",
    gradient: "from-blue-400 to-blue-600",
    count: "15+ beaches",
    image: "https://www.keralaholidays.com/uploads/tourpackages/main/Ripples-of-Kerala.jpg",
    icon: "🏖️",
  },
  {
    name: "Backwaters",
    description: "Houseboats & serene canals",
    href: "/explore/category/Backwaters",
    gradient: "from-teal-400 to-teal-600",
    count: "12+ spots",
    image: "https://c.ndtvimg.com/2025-08/tv011i6g_kerala-backwaters_625x300_18_August_25.jpeg?im=FeatureCrop,algorithm=dnn,width=1200,height=738",
    icon: "🛶",
  },
  {
    name: "Waterfalls",
    description: "Cascading nature's beauty",
    href: "/explore/category/Waterfalls",
    gradient: "from-cyan-400 to-cyan-600",
    count: "30+ falls",
    image: "https://www.keralatourism.org/images/enchanting_kerala/large/keralamkundu_waterfalls_malappuram20220607175322_1196_1.jpg",
    icon: "🌊",
  },
  {
    name: "Wildlife",
    description: "Sanctuaries & safaris",
    href: "/explore/category/Wildlife",
    gradient: "from-green-500 to-green-700",
    count: "18+ reserves",
    image: "https://irisholidays.com/keralatourism/wp-content/uploads/2020/04/chinnar-wildlife-sanctuary.gif",
    icon: "🐘",
  },
  {
    name: "Adventure",
    description: "Trekking, paragliding & more",
    href: "/explore/category/Adventure",
    gradient: "from-orange-400 to-orange-600",
    count: "50+ activities",
    image: "https://irisholidays.com/keralatourism/wp-content/uploads/2014/07/Paragiliding-kerala.jpg",
    icon: "🧗",
  },
  {
    name: "History",
    description: "Prehistoric caves & ancient carvings",
    href: "/explore/category/History",
    gradient: "from-indigo-400 to-indigo-600",
    count: "5+ sites",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    icon: "📜",
  },
  {
    name: "Heritage",
    description: "Culture, history & palaces",
    href: "/explore/category/Heritage Site",
    gradient: "from-purple-400 to-purple-600",
    count: "8+ sites",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Mattancherry_Palace_02.JPG",
    icon: "🏛️",
  },
  {
    name: "Spirituality",
    description: "Sacred temples and spiritual retreats",
    href: "/explore/category/Spirituality",
    gradient: "from-yellow-400 to-orange-500",
    count: "20+ temples",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Padmanabhaswamy_Temple_in_Tiruvananthapuram.jpg",
    icon: "🛕",
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
