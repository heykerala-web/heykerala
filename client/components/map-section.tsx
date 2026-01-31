export function MapSection() {
  return (
    <section aria-labelledby="map-section-heading">
      <div className="text-center mb-8">
        <h2 id="map-section-heading" className="text-3xl md:text-4xl font-bold text-gray-900">
          Explore Kerala
        </h2>
        <p className="mt-2 text-gray-600">Discover destinations across the state with our map preview</p>
      </div>

      <div className="rounded-xl overflow-hidden bg-white shadow">
        <div className="relative h-80">
          <img
            src="/placeholder.svg?height=500&width=1000"
            alt="Map preview of Kerala"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10" />
        </div>
      </div>
    </section>
  )
}
