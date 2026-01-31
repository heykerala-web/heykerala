"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { MapPin, Search, ArrowRight } from "lucide-react"

interface Suggestion {
    _id: string
    name: string
    district: string
    slug: string
    category: string
}

interface SearchSuggestionsProps {
    query: string
    onSelect?: () => void
}

export function SearchSuggestions({ query, onSelect }: SearchSuggestionsProps) {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    // Fetch suggestions with debounce
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!query || query.length < 2) {
                setSuggestions([])
                setShow(false)
                return
            }

            setLoading(true)
            try {
                const res = await fetch(`http://localhost:5000/api/places/suggestions?query=${encodeURIComponent(query)}`)
                const data = await res.json()
                if (data.success) {
                    setSuggestions(data.data)
                    setShow(true)
                }
            } catch (error) {
                console.error("Error loading suggestions:", error)
            } finally {
                setLoading(false)
            }
        }

        const timeout = setTimeout(fetchSuggestions, 300)
        return () => clearTimeout(timeout)
    }, [query])

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShow(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    if (!show || (suggestions.length === 0 && !loading)) {
        if (show && suggestions.length === 0 && !loading) {
            return (
                <div ref={wrapperRef} className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50">
                    <p className="text-gray-500 text-sm text-center">No results found</p>
                </div>
            )
        }
        return null
    }

    return (
        <div ref={wrapperRef} className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
            {loading ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                    <span className="inline-block w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-2"></span>
                    Searching...
                </div>
            ) : (
                <div className="flex flex-col">
                    {suggestions.map((item) => (
                        <Link
                            key={item._id}
                            href={`/search?q=${encodeURIComponent(item.name)}`}
                            onClick={onSelect}
                            className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 text-left"
                        >
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                <MapPin className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                                <p className="text-xs text-gray-500 truncate">
                                    {item.district} • {item.category}
                                </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-300" />
                        </Link>
                    ))}
                    <Link
                        href={`/search?q=${encodeURIComponent(query)}`}
                        onClick={onSelect}
                        className="p-3 bg-gray-50 text-center text-sm text-emerald-600 font-medium hover:bg-emerald-50 transition-colors"
                    >
                        See all results for "{query}"
                    </Link>
                </div>
            )}
        </div>
    )
}
