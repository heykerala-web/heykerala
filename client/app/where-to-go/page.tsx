"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Mountain, Palette, TreePine, MapPin, Church, ArrowRight, Sparkles } from "lucide-react"

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
    { id: "untold", label: "Untold", icon: Sparkles },
  ]

  // ✅ Updated with free online image URLs
  const attractionsData = [
    {
      title: "Untold",
      image: "https://www.keralatourism.org/images/enchanting_kerala/large/keralamkundu_waterfalls_malappuram20220607175322_1196_1.jpg",
      description: "Hidden gems and secret stories",
      count: "10+ secrets",
      href: "/places?untold=true",
    },
    {
      title: "Trending",
      image: "https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2023/12/20140736/Athirapally-Waterfall.jpg",
      description: "Most popular destinations right now",
      count: "25+ places",
      href: "/explore/category/all",
    },
    {
      title: "Hills",
      image: "https://upload.wikimedia.org/wikipedia/commons/6/67/DR0069DSC_9221.jpg",
      description: "Misty mountains and tea plantations",
      count: "40+ hills",
      href: "/explore/category/Hill Station",
    },
    {
      title: "Beaches",
      image: "https://www.keralaholidays.com/uploads/tourpackages/main/Ripples-of-Kerala.jpg",
      description: "Golden sands and azure waters",
      count: "35+ beaches",
      href: "/explore/category/Beach",
    },
    {
      title: "Backwaters",
      image: "https://c.ndtvimg.com/2025-08/tv011i6g_kerala-backwaters_625x300_18_August_25.jpeg?im=FeatureCrop,algorithm=dnn,width=1200,height=738",
      description: "Serene canals and houseboats",
      count: "20+ waterways",
      href: "/explore/category/Backwaters",
    },
    {
      title: "Islands",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      description: "Pristine island getaways",
      count: "15+ islands",
      href: "/explore/category/Island",
    },
    {
      title: "Waterfalls",
      image: "https://www.keralatourism.org/images/enchanting_kerala/large/keralamkundu_waterfalls_malappuram20220607175322_1196_1.jpg",
      description: "Cascading natural wonders",
      count: "30+ waterfalls",
      href: "/explore/category/Waterfalls",
    },
    {
      title: "Wildlife",
      image: "https://irisholidays.com/keralatourism/wp-content/uploads/2020/04/chinnar-wildlife-sanctuary.gif",
      description: "Exotic animals and bird watching",
      count: "18+ reserves",
      href: "/explore/category/Wildlife",
    },
    {
      title: "Adventure",
      image: "https://irisholidays.com/keralatourism/wp-content/uploads/2014/07/Paragiliding-kerala.jpg",
      description: "Thrilling outdoor activities",
      count: "50+ activities",
      href: "/explore/category/Adventure",
    },
  ]

  const cultureData = [
    {
      title: "Museums",
      image: "https://upload.wikimedia.org/wikipedia/commons/6/61/Napier_Museum_Thiruvananthapuram.jpg",
      description: "Art, history and cultural museums",
      count: "25+ museums",
      href: "/explore/category/Museum",
    },
    {
      title: "Heritage Sites",
      image: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Mattancherry_Palace_02.JPG",
      description: "Historical palaces and monuments",
      count: "40+ sites",
      href: "/explore/category/Heritage Site",
    },
    {
      title: "Art Galleries",
      image: "https://images.unsplash.com/photo-1586486940912-58f21f2dd8a3",
      description: "Contemporary and traditional art",
      count: "20+ galleries",
      href: "/explore/category/Culture",
    },
    {
      title: "Cultural Centers",
      image: "https://images.unsplash.com/photo-1599058917212-b6cc7a74abf0",
      description: "Performance venues and cultural hubs",
      count: "30+ centers",
      href: "/explore/category/Culture",
    },
    {
      title: "Traditional Arts",
      image: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Kathakali_dancer.jpg",
      description: "Kathakali, Theyyam and folk arts",
      count: "15+ art forms",
      href: "/explore/category/Culture",
    },
    {
      title: "Festivals",
      image: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Thrissur_pooram_festival.jpg",
      description: "Colorful festivals and celebrations",
      count: "50+ festivals",
      href: "/explore/category/Culture",
    },
  ]

  const picnicData = [
    {
      title: "Zoological Parks",
      image: "https://upload.wikimedia.org/wikipedia/commons/4/48/ZooThiruvananthapuram.jpg",
      description: "Wildlife parks and botanical gardens",
      count: "8+ parks",
      href: "/explore/category/Wildlife",
    },
    {
      title: "Elephant Sanctuaries",
      image: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Elephants_in_Kerala.jpg",
      description: "Elephant camps and rehabilitation centers",
      count: "12+ centers",
      href: "/explore/category/Wildlife",
    },
    {
      title: "Amusement Parks",
      image: "https://images.unsplash.com/photo-1578922879675-89d7c52e12a1",
      description: "Theme parks and water parks",
      count: "15+ parks",
      href: "/explore/category/Adventure",
    },
    {
      title: "Children's Parks",
      image: "https://images.unsplash.com/photo-1524492449090-8d4c3f1f2f61",
      description: "Family-friendly recreational areas",
      count: "25+ parks",
      href: "/explore/category/Nature",
    },
    {
      title: "Dams & Reservoirs",
      image: "https://upload.wikimedia.org/wikipedia/commons/7/71/Idukki_Dam2.jpg",
      description: "Engineering marvels and scenic spots",
      count: "20+ dams",
      href: "/explore/category/Nature",
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
      href: "/explore/category/Temple",
    },
    {
      title: "Churches",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/34/St._Francis_Church_Kochi.jpg",
      description: "Colonial and modern churches",
      count: "150+ churches",
      href: "/explore/category/Church",
    },
    {
      title: "Mosques",
      image: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Cheraman_Juma_Mosque.jpg",
      description: "Historic Islamic architecture",
      count: "100+ mosques",
      href: "/explore/category/Mosque",
    },
    {
      title: "Synagogues",
      image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Paradesi_Synagogue%2C_Kochi.jpg",
      description: "Jewish heritage sites",
      count: "8+ synagogues",
      href: "/explore/category/Heritage Site",
    },
    {
      title: "Pilgrimage Sites",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/39/Sabarimala_temple.jpg",
      description: "Sacred pilgrimage destinations",
      count: "50+ sites",
      href: "/explore/category/Pilgrimage",
    },
    {
      title: "Ashrams & Retreats",
      image: "https://images.unsplash.com/photo-1518600506278-4e8ef466b810",
      description: "Spiritual centers and meditation retreats",
      count: "30+ ashrams",
      href: "/explore/category/Pilgrimage",
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
      case "untold":
        return [
          {
            title: "Maravanthuruthu",
            image: "https://www.keralatourism.org/images/enchanting_kerala/large/maravanthuruthu_water_street_kottayam20220607175322_1196_1.jpg",
            description: "Hidden water streets and village life",
            count: "Secret Gem",
            href: "/places/maravanthuruthu",
          },
          {
            title: "Nelliyampathy Hills",
            image: "https://upload.wikimedia.org/wikipedia/commons/6/67/DR0069DSC_9221.jpg",
            description: "Misty mountains and tea estates",
            count: "Untold Story",
            href: "/places/nelliyampathy",
          },
          {
            title: "Chendamangalam",
            image: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Mattancherry_Palace_02.JPG",
            description: "Traditional weaving and heritage",
            count: "Hidden Heritage",
            href: "/places/chendamangalam",
          }
        ]
      default:
        return attractionsData
    }
  }

  return (
    <main className="min-h-screen bg-background pb-20 lg:pb-8">
      {/* Hero Header */}
      <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Zoom Animation */}
        <div className="absolute inset-0 z-0">
          <img
            src="/munnar-tea-gardens-rolling-green-hills.png"
            alt="Kerala Tea Gardens"
            className="w-full h-full object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/80 backdrop-blur-[2px]" />
        </div>

        <div className="relative container mx-auto px-6 max-w-7xl text-center z-10 pt-20">
          <h1 className="font-outfit text-6xl md:text-9xl font-bold mb-8 tracking-tighter text-white drop-shadow-2xl animate-fade-in-up">
            Where to go
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto font-inter font-light leading-relaxed drop-shadow-lg animate-fade-in-up [animation-delay:200ms]">
            Discover the diverse experiences that make Kerala truly God&apos;s Own Country
          </p>
          <div className="flex justify-center animate-fade-in-up [animation-delay:400ms]">
            <div className="bg-white/10 backdrop-blur-xl rounded-full px-8 py-4 border border-white/20 shadow-2xl transition-all duration-500 hover:bg-white/20 hover:scale-105">
              <span className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-white">
                ✨ 500+ Amazing Destinations
              </span>
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
                  className={`flex items-center gap-3 px-10 py-8 whitespace-nowrap border-b-4 transition-all duration-500 ${activeTab === tab.id
                    ? "border-accent text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                >
                  <Icon className={`h-6 w-6 ${activeTab === tab.id ? "text-accent" : "text-muted-foreground"}`} />
                  <span className="font-outfit font-bold uppercase tracking-widest text-xs">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div
          className={`grid gap-10 ${activeTab === "attractions"
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
              className="group relative overflow-hidden rounded-[2.5rem] shadow-sm border border-border hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 bg-card"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Count Badge */}
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md rounded-full px-4 py-1.5 shadow-sm border border-black/5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{item.count}</span>
                </div>

                {/* Arrow indicator */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:scale-110 border border-white/20 group-hover:border-transparent">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-white font-outfit text-3xl font-bold mb-2 group-hover:text-accent transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed font-inter font-light">{item.description}</p>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-transparent transition-all duration-500" />
            </Link>
          ))}
        </div>
      </div>


      {/* Bottom CTA */}
      <div className="container mx-auto px-6 pb-20 max-w-7xl">
        <div className="relative bg-primary rounded-[3rem] p-12 md:p-20 text-white text-center overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="font-outfit text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">Need Help Planning?</h2>
            <p className="text-xl opacity-80 mb-12 max-w-2xl mx-auto font-inter leading-relaxed text-white">
              Our AI assistant can create personalized recommendations based on your unique interests and travel style.
            </p>
            <Link
              href="/ai-guide"
              className="inline-flex items-center gap-3 bg-accent hover:bg-accent/90 text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300 shadow-xl shadow-accent/20 active:scale-95"
            >
              🤖 Get AI Recommendations
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
