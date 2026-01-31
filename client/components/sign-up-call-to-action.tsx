import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SignUpCallToAction() {
  return (
    <section className="rounded-xl bg-emerald-600 text-white py-12 px-6 text-center shadow">
      <h2 className="text-3xl md:text-4xl font-bold">Unlock More of Kerala!</h2>
      <p className="mx-auto mt-3 max-w-2xl text-lg opacity-95">
        Sign up for a free account to save favorites, get personalized recommendations, and access exclusive tips.
      </p>
      <Link href="/register" className="inline-block mt-8">
        <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
          Sign Up Now
        </Button>
      </Link>
    </section>
  )
}
