"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Mountain, Palette, TreePine, MapPin, Church, ArrowRight } from "lucide-react"

export default function WhereToGoPage() {
  const [activeTab, setActiveTab] = useState("attractions")

  // Get tab from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tab = urlParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    }
  }, [])

  const tabs = [
    { id: "attractions", label: "Attractions", icon: Mountain },
    { id: "culture", label: "Art & Culture", icon: Palette },
    { id: "picnic", label: "Picnic Spots", icon: TreePine },
    { id: "regions", label: "Regions", icon: MapPin },
    { id: "spirituality", label: "Spirituality", icon: Church },
  ]

  // ✅ Updated with free online image URLs
  const attractionsData = [
    {
      title: "Trending",
      image: "https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2023/12/20140736/Athirapally-Waterfall.jpg",
      description: "Most popular destinations right now",
      count: "25+ places",
      href: "/attractions/trending",
    },
    {
      title: "Hills",
      image: "https://upload.wikimedia.org/wikipedia/commons/6/67/DR0069DSC_9221.jpg",
      description: "Misty mountains and tea plantations",
      count: "40+ hills",
      href: "/attractions/hills",
    },
    {
      title: "Beaches",
      image: "https://www.keralaholidays.com/uploads/tourpackages/main/Ripples-of-Kerala.jpg",
      description: "Golden sands and azure waters",
      count: "35+ beaches",
      href: "/attractions/beaches",
    },
    {
      title: "Backwaters",
      image: "https://c.ndtvimg.com/2025-08/tv011i6g_kerala-backwaters_625x300_18_August_25.jpeg?im=FeatureCrop,algorithm=dnn,width=1200,height=738",
      description: "Serene canals and houseboats",
      count: "20+ waterways",
      href: "/attractions/backwaters",
    },
    {
      title: "Islands",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      description: "Pristine island getaways",
      count: "15+ islands",
      href: "/attractions/islands",
    },
    {
      title: "Waterfalls",
      image: "https://www.keralatourism.org/images/enchanting_kerala/large/keralamkundu_waterfalls_malappuram20220607175322_1196_1.jpg",
      description: "Cascading natural wonders",
      count: "30+ waterfalls",
      href: "/attractions/waterfalls",
    },
    {
      title: "Wildlife",
      image: "https://irisholidays.com/keralatourism/wp-content/uploads/2020/04/chinnar-wildlife-sanctuary.gif",
      description: "Exotic animals and bird watching",
      count: "18+ reserves",
      href: "/attractions/wildlife",
    },
    {
      title: "Adventure",
      image: "https://irisholidays.com/keralatourism/wp-content/uploads/2014/07/Paragiliding-kerala.jpg",
      description: "Thrilling outdoor activities",
      count: "50+ activities",
      href: "/attractions/adventure",
    },
  ]

  const cultureData = [
    {
      title: "Museums",
      image: "https://upload.wikimedia.org/wikipedia/commons/6/61/Napier_Museum_Thiruvananthapuram.jpg",
      description: "Art, history and cultural museums",
      count: "25+ museums",
      href: "/culture/museums",
    },
    {
      title: "Heritage Sites",
      image: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Mattancherry_Palace_02.JPG",
      description: "Historical palaces and monuments",
      count: "40+ sites",
      href: "/culture/heritage",
    },
    {
      title: "Art Galleries",
      image: "https://images.unsplash.com/photo-1586486940912-58f21f2dd8a3",
      description: "Contemporary and traditional art",
      count: "20+ galleries",
      href: "/culture/galleries",
    },
    {
      title: "Cultural Centers",
      image: "https://images.unsplash.com/photo-1599058917212-b6cc7a74abf0",
      description: "Performance venues and cultural hubs",
      count: "30+ centers",
      href: "/culture/centers",
    },
    {
      title: "Traditional Arts",
      image: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Kathakali_dancer.jpg",
      description: "Kathakali, Theyyam and folk arts",
      count: "15+ art forms",
      href: "/culture/traditional-arts",
    },
    {
      title: "Festivals",
      image: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Thrissur_pooram_festival.jpg",
      description: "Colorful festivals and celebrations",
      count: "50+ festivals",
      href: "/culture/festivals",
    },
  ]

  const picnicData = [
    {
      title: "Zoological Parks",
      image: "https://upload.wikimedia.org/wikipedia/commons/4/48/ZooThiruvananthapuram.jpg",
      description: "Wildlife parks and botanical gardens",
      count: "8+ parks",
      href: "/picnic/zoos",
    },
    {
      title: "Elephant Sanctuaries",
      image: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Elephants_in_Kerala.jpg",
      description: "Elephant camps and rehabilitation centers",
      count: "12+ centers",
      href: "/picnic/elephants",
    },
    {
      title: "Amusement Parks",
      image: "https://images.unsplash.com/photo-1578922879675-89d7c52e12a1",
      description: "Theme parks and water parks",
      count: "15+ parks",
      href: "/picnic/amusement",
    },
    {
      title: "Children's Parks",
      image: "https://images.unsplash.com/photo-1524492449090-8d4c3f1f2f61",
      description: "Family-friendly recreational areas",
      count: "25+ parks",
      href: "/picnic/children",
    },
    {
      title: "Dams & Reservoirs",
      image: "https://upload.wikimedia.org/wikipedia/commons/7/71/Idukki_Dam2.jpg",
      description: "Engineering marvels and scenic spots",
      count: "20+ dams",
      href: "/picnic/dams",
    },
  ]

  const regionsData = [
    {
      title: "Northern Kerala",
      image: "https://upload.wikimedia.org/wikipedia/commons/f/f2/St.Angelos_Fort_Kannur.jpg",
      description: "Kannur, Kasaragod, Kozhikode, Wayanad",
      count: "4 districts",
      href: "/regions/northern",
    },
    {
      title: "Central Kerala",
      image: "https://images.unsplash.com/photo-1524492449090-8d4c3f1f2f61",
      description: "Ernakulam, Thrissur, Palakkad, Malappuram",
      count: "4 districts",
      href: "/regions/central",
    },
    {
      title: "Southern Kerala",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Padmanabhaswamy_Temple_in_Tiruvananthapuram.jpg",
      description: "Thiruvananthapuram, Kollam, Pathanamthitta",
      count: "3 districts",
      href: "/regions/southern",
    },
    {
      title: "Hill Districts",
      image: "https://images.unsplash.com/photo-1516569422553-07fce0b03d5e",
      description: "Idukki, Wayanad mountain regions",
      count: "2 districts",
      href: "/regions/hills",
    },
    {
      title: "Backwater Regions",
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
      description: "Alappuzha, Kottayam waterways",
      count: "2 districts",
      href: "/regions/backwaters",
    },
    {
      title: "Coastal Belt",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      description: "Entire 590km coastline",
      count: "14 districts",
      href: "/regions/coastal",
    },
  ]

  const spiritualityData = [
    {
      title: "Ancient Temples",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Padmanabhaswamy_Temple_in_Tiruvananthapuram.jpg",
      description: "Historic Hindu temples and shrines",
      count: "200+ temples",
      href: "/spirituality/temples",
    },
    {
      title: "Churches",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/34/St._Francis_Church_Kochi.jpg",
      description: "Colonial and modern churches",
      count: "150+ churches",
      href: "/spirituality/churches",
    },
    {
      title: "Mosques",
      image: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Cheraman_Juma_Mosque.jpg",
      description: "Historic Islamic architecture",
      count: "100+ mosques",
      href: "/spirituality/mosques",
    },
    {
      title: "Synagogues",
      image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Paradesi_Synagogue%2C_Kochi.jpg",
      description: "Jewish heritage sites",
      count: "8+ synagogues",
      href: "/spirituality/synagogues",
    },
    {
      title: "Pilgrimage Sites",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/39/Sabarimala_temple.jpg",
      description: "Sacred pilgrimage destinations",
      count: "50+ sites",
      href: "/spirituality/pilgrimage",
    },
    {
      title: "Ashrams & Retreats",
      image: "https://images.unsplash.com/photo-1518600506278-4e8ef466b810",
      description: "Spiritual centers and meditation retreats",
      count: "30+ ashrams",
      href: "/spirituality/ashrams",
    },
  ]

  const getTabData = () => {
    switch (activeTab) {
      case "attractions":
        return attractionsData
      case "culture":
        return cultureData
      case "picnic":
        return picnicData
      case "regions":
        return regionsData
      case "spirituality":
        return spiritualityData
      default:
        return attractionsData
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20 lg:pb-8">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-green-700 via-teal-600 to-emerald-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="font-poppins text-5xl md:text-7xl font-bold mb-6">Where to go</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Discover the diverse experiences that make Kerala truly God&apos;s Own Country
          </p>
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="text-lg font-medium">✨ 500+ Amazing Destinations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white shadow-lg sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-8 py-6 whitespace-nowrap border-b-4 transition-all duration-300 ${
                    activeTab === tab.id
                      ? "border-yellow-500 text-green-700 bg-yellow-50"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="font-semibold">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-4 py-12">
        <div
          className={`grid gap-8 ${
            activeTab === "attractions"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
              : activeTab === "regions"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {getTabData().map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Count Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-sm font-semibold text-gray-800">{item.count}</span>
                </div>

                {/* Arrow indicator */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-poppins text-2xl font-bold mb-2 group-hover:text-yellow-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-700/0 to-green-700/0 group-hover:from-green-700/10 group-hover:to-transparent transition-all duration-500" />
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="container mx-auto px-4 pb-8">
        <div className="bg-gradient-to-r from-green-700 to-teal-600 rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-4">Need Help Planning?</h2>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Our AI assistant can create personalized recommendations based on your interests
          </p>
          <Link
            href="/ai-guide"
            className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors text-lg"
          >
            🤖 Get AI Recommendations
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </main>
  )
}
