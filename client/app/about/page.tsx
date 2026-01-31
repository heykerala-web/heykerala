"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Hotel, Sparkles, Mail, Phone, Instagram, Facebook, Twitter } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const features = [
    {
      title: "Curated Destinations",
      description: "Hand-picked spots that showcase Kerala's natural beauty and cultural heritage.",
      icon: MapPin,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Local Events",
      description: "Festivals and cultural experiences that celebrate Kerala's rich traditions.",
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Stays & Hotels",
      description: "Comfortable and scenic accommodations for every budget and preference.",
      icon: Hotel,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "AI-Powered Planning",
      description: "Smart itinerary planning with personalized recommendations for your perfect trip.",
      icon: Sparkles,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ]

  const instagramHighlights = [
    { id: 1, image: "/munnar-tea-plantation.png", caption: "Munnar Tea Gardens" },
    { id: 2, image: "/kerala-backwaters-boat.png", caption: "Backwaters" },
    { id: 3, image: "/kovalam-beach-palm-trees.png", caption: "Kovalam Beach" },
    { id: 4, image: "/onam-festival-pookalam-kathakali.png", caption: "Onam Festival" },
    { id: 5, image: "/periyar-wildlife-sanctuary-lake.png", caption: "Wildlife Sanctuary" },
    { id: 6, image: "/kerala-thrissur-pooram-festival.png", caption: "Thrissur Pooram" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-10 max-w-7xl text-center">
          <h1 className="font-poppins text-5xl md:text-6xl font-bold mb-6">About Hey Kerala</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Your friendly guide to God&apos;s Own Country. Discover the best of Kerala with curated destinations, events,
            and experiences.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-10 max-w-7xl py-12 md:py-16">
        {/* Mission */}
        <section className="mb-16">
          <Card className="border-0 shadow-xl rounded-3xl">
            <CardContent className="p-8 md:p-12">
              <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-6 text-center">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto text-center">
                Hey Kerala is dedicated to showcasing the incredible beauty, culture, and experiences that make Kerala
                truly God&apos;s Own Country. We curate the best destinations, events, and stays to help you plan
                memorable trips. From serene backwaters to misty hill stations, from vibrant festivals to tranquil
                beaches, we bring you closer to the authentic Kerala experience.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-8 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="border-0 shadow-lg hover:shadow-xl transition-all rounded-3xl">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${feature.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <h3 className="font-poppins text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Instagram Highlights */}
        <section className="mb-16">
          <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-8 text-center">Kerala Highlights</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {instagramHighlights.map((highlight) => (
              <div
                key={highlight.id}
                className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer"
              >
                <img
                  src={highlight.image || "/placeholder.svg"}
                  alt={highlight.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium">{highlight.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section>
          <Card className="border-0 shadow-xl rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardContent className="p-8 md:p-12">
              <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-8 text-center">Get in Touch</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-600">hello@heykerala.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-gray-600">+91 123 456 7890</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-8">
                <Button variant="outline" size="lg" className="rounded-full">
                  <Instagram className="h-5 w-5 mr-2" />
                  Instagram
                </Button>
                <Button variant="outline" size="lg" className="rounded-full">
                  <Facebook className="h-5 w-5 mr-2" />
                  Facebook
                </Button>
                <Button variant="outline" size="lg" className="rounded-full">
                  <Twitter className="h-5 w-5 mr-2" />
                  Twitter
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
