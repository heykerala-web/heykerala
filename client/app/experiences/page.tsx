"use client"

import { Button } from "@/components/ui/button"
import { Clock, IndianRupee, MapPin, Star } from "lucide-react"
import Link from "next/link"

export default function ExperiencesPage() {
  const experiences = [
    {
      id: 1,
      title: "Houseboat Stay",
      description: "Cruise through serene backwaters on a traditional houseboat. Experience the tranquil beauty of Kerala's waterways while enjoying authentic local cuisine.",
      image: "/kerala-backwaters-boat.png",
      duration: "1-3 days",
      price: "₹8,000+",
      location: "Alleppey, Alappuzha",
      rating: 4.9,
      category: "Backwaters",
    },
    {
      id: 2,
      title: "Spice Plantation Tour",
      description: "Explore aromatic spice gardens in the Western Ghats. Learn about cardamom, pepper, cinnamon, and other spices that make Kerala famous.",
      image: "/kerala-spice-market-festival.png",
      duration: "Half day",
      price: "₹1,500+",
      location: "Thekkady, Idukki",
      rating: 4.7,
      category: "Cultural",
    },
    {
      id: 3,
      title: "Ayurveda Retreat",
      description: "Rejuvenate with traditional Kerala Ayurvedic treatments. Experience authentic wellness therapies in serene natural settings.",
      image: "/kerala-backwaters-houseboat-golden-sunset.png",
      duration: "3-14 days",
      price: "₹5,000+",
      location: "Various Locations",
      rating: 4.8,
      category: "Wellness",
    },
    {
      id: 4,
      title: "Kathakali Performance",
      description: "Watch the classical dance-drama of Kerala. Experience this ancient art form with elaborate costumes and expressive storytelling.",
      image: "/onam-festival-pookalam-kathakali.png",
      duration: "2 hours",
      price: "₹500+",
      location: "Kochi, Ernakulam",
      rating: 4.6,
      category: "Cultural",
    },
    {
      id: 5,
      title: "Tea Plantation Tour",
      description: "Walk through lush tea gardens in Munnar. Learn about tea processing and enjoy breathtaking views of rolling hills.",
      image: "/munnar-tea-plantation.png",
      duration: "3-4 hours",
      price: "₹800+",
      location: "Munnar, Idukki",
      rating: 4.8,
      category: "Nature",
    },
    {
      id: 6,
      title: "Wildlife Safari",
      description: "Spot elephants, tigers, and exotic birds in Periyar Wildlife Sanctuary. Experience the rich biodiversity of Kerala's forests.",
      image: "/periyar-wildlife-sanctuary-lake.png",
      duration: "Half day",
      price: "₹1,200+",
      location: "Thekkady, Idukki",
      rating: 4.7,
      category: "Wildlife",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-10 max-w-7xl">
          <h1 className="font-poppins text-4xl md:text-5xl font-bold mb-4">Kerala Experiences</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Immerse yourself in the authentic culture, traditions, and natural beauty of God&apos;s Own Country
          </p>
        </div>
      </div>

      {/* Experiences Grid */}
      <div className="container mx-auto px-4 md:px-6 lg:px-10 max-w-7xl py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img
                  src={exp.image || "/placeholder.svg"}
                  alt={exp.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-medium rounded-full">
                    {exp.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold text-gray-800">{exp.rating}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-poppins text-xl font-semibold mb-2">{exp.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{exp.description}</p>
                <div className="flex items-center text-gray-600 text-sm mb-4">
                  <MapPin className="h-4 w-4 mr-1 text-emerald-600" />
                  {exp.location}
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{exp.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <IndianRupee className="h-4 w-4" />
                    <span>{exp.price}</span>
                  </div>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                  Learn More
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
