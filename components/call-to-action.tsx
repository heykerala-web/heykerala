import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, MapPin, Calendar, Star } from "lucide-react"

export function CallToAction() {
  const quickStats = [
    { icon: MapPin, label: "500+ Destinations", color: "text-blue-400" },
    { icon: Calendar, label: "Year-round Travel", color: "text-green-400" },
    { icon: Star, label: "4.8★ Rated Experience", color: "text-yellow-400" },
  ]

  return (
    <section className="relative overflow-hidden">
      {/* Main CTA Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
        {/* Background with multiple images */}
        <div className="absolute inset-0">
          <div className="grid grid-cols-3 h-full">
            <img
              src="/kerala-backwaters-houseboat-golden-sunset.png"
              alt="Kerala backwaters"
              className="w-full h-full object-cover"
            />
            <img
              src="/munnar-tea-gardens-rolling-green-hills.png"
              alt="Munnar tea gardens"
              className="w-full h-full object-cover"
            />
            <img
              src="/kovalam-beach-palm-trees-sunrise.png"
              alt="Kovalam beach"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Darker gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-emerald-900/80 to-teal-800/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center py-24 px-8 text-white">
          {/* Floating elements */}
          <div className="absolute top-8 left-8 bg-white/10 backdrop-blur-sm rounded-full p-3 animate-bounce">
            <span className="text-2xl">🌴</span>
          </div>
          <div className="absolute top-12 right-12 bg-white/10 backdrop-blur-sm rounded-full p-3 animate-pulse">
            <span className="text-2xl">🏔️</span>
          </div>
          <div className="absolute bottom-12 left-16 bg-white/10 backdrop-blur-sm rounded-full p-3 animate-bounce delay-300">
            <span className="text-2xl">🏖️</span>
          </div>

          {/* Main content */}
          <div className="max-w-4xl mx-auto">
            <h2 className="font-poppins text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              Ready to Explore
              <span className="block text-yellow-300">Kerala?</span>
            </h2>

            <p className="text-lg md:text-2xl mb-8 opacity-95 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Join thousands of travelers who have discovered the magic of God&apos;s Own Country. 
              From serene backwaters to misty mountains, your perfect Kerala adventure awaits.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              {quickStats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-5 py-2 hover:scale-105 transition-transform"
                >
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <span className="font-semibold">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/where-to-go">
                <Button
                  size="lg"
                  className="bg-yellow-300 text-black hover:bg-yellow-400 px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Where to go
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>

              <Link href="/plan-trip">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-emerald-700 px-10 py-4 rounded-full font-bold text-lg backdrop-blur-md shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Plan My Trip
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/90">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm">✓</span>
                </div>
                <span className="text-sm font-medium">Trusted by 50K+ travelers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm">🏆</span>
                </div>
                <span className="text-sm font-medium">Award-winning experiences</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm">📱</span>
                </div>
                <span className="text-sm font-medium">24/7 AI assistance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-yellow-300/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-blue-300/5 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="relative -mt-1">
        <svg viewBox="0 0 1200 120" className="w-full h-12 fill-current text-gray-50">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
        </svg>
      </div>
    </section>
  )
}
