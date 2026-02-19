"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { hotels, getHotelById } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  MapPin,
  Star,
  Phone,
  Globe,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  Wifi,
  Car,
  UtensilsCrossed,
  Check,
} from "lucide-react"
import dynamic from "next/dynamic";
const LeafletMap = dynamic(() => import("@/app/components/Map/LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-3xl" />
});
import toast from "react-hot-toast"

export default function HotelDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("1")

  const hotelId = params.id as string
  const hotel = getHotelById(hotelId) || hotels[0]

  // Mock images
  const images = [hotel.image, hotel.image, hotel.image, hotel.image]

  // Coordinates
  const coords: Record<string, [number, number]> = {
    "Kumarakom": [9.6171, 76.4295],
    "Munnar": [10.0889, 77.0595],
    "Kovalam": [8.3667, 76.9833],
    "Fort Kochi": [9.9312, 76.2673],
  }
  const locationKey = hotel.location.split(",")[0]
  const [lat, lng] = coords[locationKey] || [10.5276, 76.2144]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleBook = () => {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates")
      return
    }
    toast.success("Redirecting to booking...")
    // In real app, redirect to booking page with hotel details
  }

  const amenitiesIcons: Record<string, any> = {
    WiFi: Wifi,
    Parking: Car,
    Restaurant: UtensilsCrossed,
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Image Gallery */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-500 ${idx === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
          >
            <img
              src={img || "/placeholder.svg"}
              alt={`${hotel.name} - Image ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        ))}

        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-3 h-3 rounded-full transition-colors ${idx === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
            />
          ))}
        </div>

        <Link
          href="/hotels"
          className="absolute top-6 left-6 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </Link>

        <div className="absolute top-6 right-6 z-20 flex gap-3">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <Heart className={`h-6 w-6 ${isFavorite ? "text-red-500 fill-red-500" : "text-white"}`} />
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              toast.success("Link copied!")
            }}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <Share2 className="h-6 w-6 text-white" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-10">
          <div className="container mx-auto max-w-7xl">
            <h1 className="font-poppins text-4xl md:text-5xl font-bold text-white mb-2">{hotel.name}</h1>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{hotel.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="text-lg font-semibold">{hotel.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 lg:px-10 max-w-7xl py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card className="rounded-3xl shadow-lg border-0">
              <CardContent className="p-6 md:p-8">
                <h2 className="font-poppins text-2xl md:text-3xl font-bold mb-4">About This Hotel</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Experience luxury and comfort at {hotel.name}, located in the heart of {hotel.location}. This
                  beautiful property offers world-class amenities and exceptional service, making it the perfect choice
                  for your stay in Kerala.
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <Card className="rounded-3xl shadow-lg border-0">
                <CardContent className="p-6 md:p-8">
                  <h2 className="font-poppins text-2xl md:text-3xl font-bold mb-6">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hotel.amenities.map((amenity, idx) => {
                      const Icon = amenitiesIcons[amenity] || Check
                      return (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                          <Icon className="h-5 w-5 text-emerald-600" />
                          <span className="text-gray-700 font-medium">{amenity}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Map */}
            <Card className="rounded-3xl shadow-lg border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 md:p-8 border-b">
                  <h2 className="font-poppins text-2xl md:text-3xl font-bold mb-2">Location</h2>
                  <p className="text-gray-600">{hotel.location}</p>
                </div>
                <LeafletMap
                  center={[lat, lng]}
                  zoom={12}
                  markers={[{ lat, lng, title: hotel.name, description: hotel.location }]}
                  height="400px"
                />
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card className="rounded-3xl shadow-lg border-0 sticky top-24">
              <CardContent className="p-6 md:p-8">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-emerald-600 flex items-center gap-1 mb-2">
                    <IndianRupee className="h-6 w-6" />
                    <span>{hotel.price.toLocaleString()}</span>
                    <span className="text-lg text-gray-500 font-normal">/night</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span>{hotel.rating} rating</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Check-out</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num.toString()}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button
                  onClick={handleBook}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-14 text-lg font-semibold mb-3"
                >
                  Book Now
                </Button>

                <div className="text-center text-sm text-gray-600">
                  <p>Free cancellation up to 24 hours before check-in</p>
                </div>

                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>+91 123 456 7890</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Globe className="h-4 w-4" />
                    <span>www.hotelwebsite.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}






