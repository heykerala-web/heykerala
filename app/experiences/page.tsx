import { Button } from "@/components/ui/button"
export const metadata = {
  title: "Experiences | Hey Kerala",
  description: "Unique experiences and activities in Kerala",
}

export default function ExperiencesPage() {
  const experiences = [
    {
      title: "Houseboat Stay",
      description: "Cruise through serene backwaters on a traditional houseboat",
      image: "/kerala-backwaters-boat.png",
      duration: "1-3 days",
      price: "₹8,000+",
    },
    {
      title: "Spice Plantation Tour",
      description: "Explore aromatic spice gardens in the Western Ghats",
      image: "/kerala-spice-market-festival.png",
      duration: "Half day",
      price: "₹1,500+",
    },
    {
      title: "Ayurveda Retreat",
      description: "Rejuvenate with traditional Kerala Ayurvedic treatments",
      image: "https://www.tyndistravel.com/uploads/blog/og_image/banner-4-1-crop12.jpg?height=300&width=400",
      duration: "3-14 days",
      price: "₹5,000+",
    },
    {
      title: "Kathakali Performance",
      description: "Watch the classical dance-drama of Kerala",
      image: "/onam-festival-pookalam-kathakali.png",
      duration: "2 hours",
      price: "₹500+",
    },
  ]

  return (
    <main className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Kerala Experiences</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Immerse yourself in the authentic culture, traditions, and natural beauty of God&apos;s Own Country
        </p>
      </header>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {experiences.map((exp, i) => (
          <article key={i} className="rounded-xl bg-white shadow-lg overflow-hidden hover:shadow-xl transition">
            <img src={exp.image || "/placeholder.svg"} alt={exp.title} className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{exp.title}</h3>
              <p className="text-gray-600 mb-4">{exp.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Duration: {exp.duration}</span>
                <span className="font-semibold text-emerald-600">{exp.price}</span>
              </div>
              <Button className="w-full mt-4">Learn More</Button>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
