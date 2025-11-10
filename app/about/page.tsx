export const metadata = {
  title: "About | Hey Kerala",
  description: "Learn about Hey Kerala and our mission.",
}

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold">About Hey Kerala</h1>
      <p className="mt-4 text-gray-700 max-w-3xl">
        Hey Kerala is your friendly guide to God&apos;s Own Country. From serene backwaters to lush hills, we curate the
        best places, events, and stays so you can plan memorable trips with ease.
      </p>
      <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-3">
        <div className="rounded-xl bg-white shadow p-6">
          <h3 className="font-semibold mb-2">Curated Destinations</h3>
          <p className="text-sm text-gray-700">Hand-picked spots that showcase Kerala&apos;s beauty.</p>
        </div>
        <div className="rounded-xl bg-white shadow p-6">
          <h3 className="font-semibold mb-2">Local Events</h3>
          <p className="text-sm text-gray-700">Festivals and cultural experiences worth your time.</p>
        </div>
        <div className="rounded-xl bg-white shadow p-6">
          <h3 className="font-semibold mb-2">Stays & Hotels</h3>
          <p className="text-sm text-gray-700">Comfortable and scenic places to rest and recharge.</p>
        </div>
      </div>
    </main>
  )
}
