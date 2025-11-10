import Link from "next/link"

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-2 text-gray-700">The page you are looking for was not found.</p>
      <Link href="/" className="mt-6 inline-block text-emerald-600 hover:underline">
        Go home
      </Link>
    </main>
  )
}
