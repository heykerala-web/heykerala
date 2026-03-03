import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, MapPin, Calendar, Star } from "lucide-react"

export function CallToAction() {
  return (
    <section className="relative group">
      <div className="relative rounded-[3rem] overflow-hidden shadow-2xl bg-primary min-h-[600px] flex items-center">
        {/* Background Image with Parallax-like feel */}
        <div className="absolute inset-0">
          <img
            src="/places/alappuzhabackwaters.webp"
            alt="Cinematic Kerala"
            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-[3000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full py-20 px-10 md:px-24">
          <div className="max-w-3xl space-y-10">
            <div className="space-y-4">
              <span className="text-accent font-bold uppercase tracking-[0.3em] text-xs">Begin Your Story</span>
              <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter leading-[1.1]">
                Kerala is calling.<br />
                <span className="opacity-60 italic font-medium tracking-tight">Answer the call.</span>
              </h2>
            </div>

            <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-xl">
              Experience the timeless beauty of the backwaters, the emerald embrace of the mountains, and the golden soul of our coastlines.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Link href="/explore">
                <Button className="h-16 px-10 rounded-2xl bg-white text-primary hover:bg-white/90 font-bold text-lg shadow-xl hover:shadow-2xl transition-all active:scale-95 group/btn">
                  Explore Destinations
                  <ArrowRight className="ml-3 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <Link href="/add-listing">
                <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/20 bg-transparent text-white hover:bg-white/10 font-bold text-lg backdrop-blur-md transition-all">
                  Join the Community
                </Button>
              </Link>
            </div>

            {/* Trust Markers */}
            <div className="flex flex-wrap items-center gap-10 pt-12 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
                  <Star className="h-4 w-4 text-accent fill-accent" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Highly Rated</p>
                  <p className="text-sm font-bold text-white">4.9/5 Average</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Expansive</p>
                  <p className="text-sm font-bold text-white">500+ Destinations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Decorative Glass */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 hidden lg:block animate-pulse" />
        <div className="absolute bottom-10 right-40 w-32 h-32 bg-accent/10 backdrop-blur-xl rounded-full border border-white/10 hidden lg:block" />
      </div>
    </section>
  )
}
