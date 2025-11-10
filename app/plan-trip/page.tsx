"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  MapPin,
  Plane,
  Hotel,
  Phone,
  FileText,
  Calendar,
  Map,
  CreditCard,
  Wifi,
  Car,
  Shield,
  ArrowRight,
  Star,
} from "lucide-react"

export default function PlanTripPage() {
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [customPlan, setCustomPlan] = useState({
    duration: "",
    budget: "",
    interests: [],
    travelers: "",
  })

  const planningServices = [
    {
      title: "Tourist Information Centers",
      description: "Get local insights, maps, and expert guidance",
      icon: MapPin,
      color: "bg-blue-500",
      features: ["Free maps", "Local guides", "24/7 support"],
    },
    {
      title: "How to Reach",
      description: "Transportation options and travel routes",
      icon: Plane,
      color: "bg-green-500",
      features: ["Flight booking", "Train routes", "Bus services"],
    },
    {
      title: "Yathri Nivas Booking",
      description: "Government accommodation booking",
      icon: Hotel,
      color: "bg-purple-500",
      features: ["Budget stays", "Online booking", "Clean facilities"],
    },
    {
      title: "Interactive Maps",
      description: "Offline maps and navigation",
      icon: Map,
      color: "bg-orange-500",
      features: ["Offline access", "GPS navigation", "Points of interest"],
    },
    {
      title: "Visa Information",
      description: "Visa requirements and immigration",
      icon: FileText,
      color: "bg-red-500",
      features: ["Visa on arrival", "Requirements", "Processing time"],
    },
    {
      title: "Emergency Contacts",
      description: "District-wise emergency services",
      icon: Phone,
      color: "bg-yellow-500",
      features: ["Police", "Medical", "Tourist helpline"],
    },
    {
      title: "Currency Exchange",
      description: "Live rates and exchange points",
      icon: CreditCard,
      color: "bg-indigo-500",
      features: ["Live rates", "ATM locations", "Exchange centers"],
    },
    {
      title: "Internet & Connectivity",
      description: "WiFi spots and mobile networks",
      icon: Wifi,
      color: "bg-teal-500",
      features: ["Free WiFi spots", "SIM cards", "Data plans"],
    },
    {
      title: "Transportation",
      description: "Local transport and rentals",
      icon: Car,
      color: "bg-pink-500",
      features: ["Car rentals", "Auto booking", "Public transport"],
    },
  ]

  const premiumPackages = [
    {
      id: 1,
      title: "Kerala Highlights",
      duration: "5 Days / 4 Nights",
      price: "₹25,000",
      originalPrice: "₹30,000",
      rating: 4.8,
      reviews: 1250,
      image: "/kerala-backwaters-houseboat-golden-sunset.png",
      highlights: ["Munnar Tea Gardens", "Alleppey Backwaters", "Kochi Heritage", "Thekkady Wildlife"],
      includes: ["Accommodation", "Meals", "Transport", "Guide"],
      badge: "Most Popular",
    },
    {
      id: 2,
      title: "Beach & Hills Combo",
      duration: "7 Days / 6 Nights",
      price: "₹35,000",
      originalPrice: "₹42,000",
      rating: 4.9,
      reviews: 890,
      image: "/kovalam-beach-palm-trees-sunrise.png",
      highlights: ["Kovalam Beach", "Munnar Hills", "Varkala Cliffs", "Wayanad Forests"],
      includes: ["Luxury Stay", "All Meals", "Private Car", "Activities"],
      badge: "Premium",
    },
    {
      id: 3,
      title: "Cultural Kerala",
      duration: "6 Days / 5 Nights",
      price: "₹28,000",
      originalPrice: "₹35,000",
      rating: 4.7,
      reviews: 650,
      image: "/onam-festival-pookalam-kathakali.png",
      highlights: ["Kathakali Shows", "Temple Tours", "Spice Gardens", "Village Life"],
      includes: ["Heritage Hotels", "Cultural Shows", "Local Guide", "Experiences"],
      badge: "Cultural",
    },
  ]

  const customOptions = {
    duration: ["3-4 days", "5-7 days", "8-10 days", "10+ days"],
    budget: ["Budget (₹15k-25k)", "Mid-range (₹25k-50k)", "Luxury (₹50k+)"],
    interests: ["Beaches", "Hills", "Backwaters", "Wildlife", "Culture", "Adventure", "Ayurveda", "Food"],
    travelers: ["Solo", "Couple", "Family", "Group (4+)"],
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20 lg:pb-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-kerala-green via-emerald-600 to-teal-600 text-white py-20 overflow-hidden">
      {/* Background Image */}
      <img
        src="https://lp-cms-production.imgix.net/2025-04/shutterstock524524162.jpg?auto=format,compress&q=72&w=1440&h=810&fit=crop"
        alt="Kerala Backwaters"
        className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none select-none"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4 text-center">
        <h1 className="font-poppins text-5xl md:text-7xl font-bold mb-6">Plan your trip</h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-4xl mx-auto">
        From transportation to accommodation, cultural experiences to adventure activities - we&apos;ve got
        everything covered for your perfect Kerala journey
        </p>
        <div className="flex flex-wrap justify-center gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2">
          <span className="text-lg font-medium">🏨 500+ Hotels</span>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2">
          <span className="text-lg font-medium">🚗 Transport Included</span>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2">
          <span className="text-lg font-medium">🎯 Custom Itineraries</span>
        </div>
        </div>
      </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Premium Packages */}
        <section>
          <div className="text-center mb-12">
            <h2 className="font-poppins text-4xl font-bold mb-4">Premium Travel Packages</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Carefully curated experiences with the best of Kerala, including luxury stays and exclusive activities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {premiumPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative"
              >
                {pkg.badge && (
                  <div className="absolute top-4 left-4 z-10 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {pkg.badge}
                  </div>
                )}

                <div className="relative h-64">
                  <img src={pkg.image || "/placeholder.svg"} alt={pkg.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold">{pkg.rating}</span>
                      </div>
                      <span className="text-sm opacity-90">({pkg.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-poppins font-bold text-xl mb-1">{pkg.title}</h3>
                      <p className="text-gray-600 text-sm">{pkg.duration}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-kerala-green">{pkg.price}</div>
                      <div className="text-sm text-gray-500 line-through">{pkg.originalPrice}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Highlights:</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {pkg.highlights.map((highlight, idx) => (
                        <div key={idx} className="text-sm text-gray-600 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-kerala-green rounded-full" />
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Includes:</h4>
                    <div className="flex flex-wrap gap-2">
                      {pkg.includes.map((item, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-kerala-green hover:bg-kerala-green/90 text-lg py-3">
                    Book Now - Save ₹
                    {Number.parseInt(pkg.originalPrice.replace("₹", "").replace(",", "")) -
                      Number.parseInt(pkg.price.replace("₹", "").replace(",", ""))}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Custom Trip Planner */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-4xl font-bold mb-4">Create Your Custom Trip</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Tell us your preferences and we&apos;ll create a personalized Kerala itinerary just for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Object.entries(customOptions).map(([key, options]) => (
              <div key={key}>
                <Label className="text-base font-semibold mb-3 block capitalize">{key}</Label>
                <div className="space-y-2">
                  {options.map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type={key === "interests" ? "checkbox" : "radio"}
                        name={key}
                        value={option}
                        className="rounded border-gray-300 text-kerala-green focus:ring-kerala-green"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-kerala-green hover:bg-kerala-green/90 px-12 py-4 text-lg">
              <Calendar className="h-5 w-5 mr-2" />
              Create My Custom Itinerary
            </Button>
          </div>
        </section>

        {/* Planning Services */}
        <section>
          <div className="text-center mb-12">
            <h2 className="font-poppins text-4xl font-bold mb-4">Essential Travel Services</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything you need for a smooth and memorable Kerala experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {planningServices.map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="font-poppins text-lg">{service.title}</CardTitle>
                      <p className="text-gray-600 text-sm">{service.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-kerala-green rounded-full" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-kerala-green group-hover:text-white transition-colors bg-transparent"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Emergency Contacts Preview */}
        <section className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white">
          <div className="text-center mb-8">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-4">Emergency Contacts</h2>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              District-wise emergency numbers and important contacts for your safety
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { name: "Emergency", number: "112", icon: Phone },
              { name: "Tourist Helpline", number: "1363", icon: MapPin },
              { name: "Medical", number: "108", icon: Shield },
              { name: "Police", number: "100", icon: Phone },
            ].map((contact) => (
              <div key={contact.name} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <contact.icon className="h-8 w-8 mx-auto mb-2" />
                <div className="font-bold text-2xl">{contact.number}</div>
                <div className="text-sm opacity-90">{contact.name}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-white text-red-500 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold">
              View District-wise Contacts
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </section>
      </div>
    </main>
  )
}
