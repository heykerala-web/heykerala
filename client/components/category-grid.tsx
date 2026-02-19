import Link from "next/link"

const categories = [
  {
    name: "Hill Station",
    description: "Misty mountains & tea gardens",
    href: "/explore/category/Hill Station",
    gradient: "from-primary/80 to-primary",
    count: "10+ places",
    image: "https://images.unsplash.com/photo-1590510328503-903069695d38?auto=format&fit=crop&w=1200&q=80",
    icon: "🏔️",
  },
  {
    name: "Beach",
    description: "Sun, sand & sea",
    href: "/explore/category/Beach",
    gradient: "from-blue-500/80 to-blue-600",
    count: "15+ beaches",
    image: "https://images.unsplash.com/photo-1590050811270-e322662c919d?auto=format&fit=crop&w=1200&q=80",
    icon: "🏖️",
  },
  {
    name: "Backwaters",
    description: "Houseboats & serene canals",
    href: "/explore/category/Backwaters",
    gradient: "from-primary/60 to-primary/90",
    count: "12+ spots",
    image: "https://images.unsplash.com/photo-1602216056096-3c40cc0c9855?auto=format&fit=crop&w=1200&q=80",
    icon: "🛶",
  },
  {
    name: "Waterfalls",
    description: "Cascading nature's beauty",
    href: "/explore/category/Waterfalls",
    gradient: "from-cyan-400 to-cyan-600",
    count: "30+ falls",
    image: "https://images.unsplash.com/photo-1540555700478-4be289aefcf1?auto=format&fit=crop&w=1200&q=80",
    icon: "🌊",
  },
  {
    name: "Wildlife",
    description: "Sanctuaries & safaris",
    href: "/explore/category/Wildlife",
    gradient: "from-green-500 to-green-700",
    count: "18+ reserves",
    image: "https://images.unsplash.com/photo-1581023779269-80517c80536c?auto=format&fit=crop&w=1200&q=80",
    icon: "🐘",
  },
  {
    name: "Adventure",
    description: "Trekking, paragliding & more",
    href: "/explore/category/Adventure",
    gradient: "from-orange-400 to-orange-600",
    count: "50+ activities",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    icon: "🧗",
  },
  {
    name: "History",
    description: "Prehistoric caves & ancient carvings",
    href: "/explore/category/History",
    gradient: "from-indigo-400 to-indigo-600",
    count: "5+ sites",
    image: "https://images.unsplash.com/photo-1589310344464-9d1034446465?auto=format&fit=crop&w=1200&q=80",
    icon: "📜",
  },
  {
    name: "Heritage",
    description: "Culture, history & palaces",
    href: "/explore/category/Heritage Site",
    gradient: "from-purple-400 to-purple-600",
    count: "8+ sites",
    image: "https://images.unsplash.com/photo-1589921200632-132d75f2ee3f?auto=format&fit=crop&w=1200&q=80",
    icon: "🏛️",
  },
  {
    name: "Spirituality",
    description: "Sacred temples and spiritual retreats",
    href: "/explore/category/Spirituality",
    gradient: "from-yellow-400 to-orange-500",
    count: "20+ temples",
    image: "https://images.unsplash.com/photo-1590510328503-903069695d38?auto=format&fit=crop&w=1200&q=80",
    icon: "🛕",
  },
]

export function CategoryGrid() {
  return (
    <section>
      <div className="text-center mb-16 md:mb-24">
        <h2 className="text-h2 font-outfit mb-4">Explore by Category</h2>
        <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
          From misty mountains to serene backwaters, find the experience that speaks to you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group relative h-[450px] rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 block"
          >
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              {/* Refined Overlays */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Content Area */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
              {/* Category Icon/Tag */}
              <div className="mb-6">
                <span className="text-4xl group-hover:scale-125 transition-transform duration-500 inline-block">
                  {category.icon}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-3xl font-outfit font-bold text-white tracking-tight">
                  {category.name}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed max-w-[240px]">
                  {category.description}
                </p>

                <div className="pt-4 flex items-center gap-3 text-white font-semibold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <span>Explore Now</span>
                  <div className="h-0.5 w-10 bg-accent rounded-full" />
                </div>
              </div>

              {/* Count Badge - Top Left */}
              <div className="absolute top-8 left-8">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-full text-white text-[10px] font-outfit font-bold uppercase tracking-[0.2em]">
                  {category.count}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
