"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { contactAPI } from "@/lib/api"

export default function ContactPage() {
  const router = useRouter()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const successParam = urlParams.get("success")
    if (successParam === "1") {
      setSuccess(true)
    }
  }, [])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = String(formData.get("name") || "").trim()
    const email = String(formData.get("email") || "").trim()
    const message = String(formData.get("message") || "").trim()

    // Client-side validation
    if (!name || !email || !message) {
      setError("Please fill in all fields.")
      setLoading(false)
      return
    }

    try {
      // Call backend API
      const response = await contactAPI.submit({ name, email, message })

      if (response.success) {
        setSuccess(true)
        // Reset form
        e.currentTarget.reset()
        router.push("/contact?success=1")
      } else {
        setError(response.message || "Failed to send message. Please try again.")
        if (response.errors) {
          const errorMsg = response.errors.map((e: any) => e.msg).join(", ")
          setError(errorMsg)
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
      <p className="mt-2 text-gray-700 max-w-2xl">
        Questions, suggestions, or partnership ideas? We would love to hear from you.
      </p>

      {success && (
        <div className="mt-6 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 p-4">
          Thank you! We&apos;ll get back to you soon.
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-md bg-red-50 text-red-800 border border-red-200 p-4">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="mt-8 grid gap-4 max-w-xl">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="How can we help?"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send message"}
        </button>
      </form>
    </main>
  )
}
