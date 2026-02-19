"use client"

import * as React from "react"
import { Search, Sparkles, MapPin, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { API_URL } from "@/lib/api"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SearchResult {
    _id: string;
    name: string;
    description?: string;
    category: string;
    district: string;
    image: string;
    score?: number;
    type: 'place' | 'stay' | 'event';
}

export function SmartSearch() {
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [isOpen, setIsOpen] = React.useState(false)
    const [activeTab, setActiveTab] = React.useState<'all' | 'place' | 'stay' | 'event'>('all')

    const searchRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Debounce search
    React.useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim()) {
                handleSearch();
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn)
    }, [query, activeTab])

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setIsOpen(true);

        try {
            const response = await fetch(`${API_URL}/ai/search?q=${encodeURIComponent(query)}&type=${activeTab}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setResults(data);
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'place', label: 'Places' },
        { id: 'stay', label: 'Stays' },
        { id: 'event', label: 'Events' },
    ]

    return (
        <div className="relative max-w-3xl mx-auto" ref={searchRef}>
            <div className="relative group z-20">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary z-10">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                </div>
                <Input
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (!e.target.value) setIsOpen(false);
                        else setIsOpen(true);
                    }}
                    onFocus={() => query && setIsOpen(true)}
                    placeholder={
                        activeTab === 'all' ? "Search by vibe: 'Quiet hills' or 'Luxury resorts'..." :
                            activeTab === 'place' ? "Search places..." :
                                activeTab === 'stay' ? "Search stays..." :
                                    "Search events..."
                    }
                    className="w-full h-16 pl-14 pr-32 rounded-3xl bg-white border-0 shadow-2xl text-lg focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-300"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
                    {query && (
                        <button
                            type="button"
                            onClick={() => { setQuery(""); setIsOpen(false) }}
                            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                    <button
                        onClick={(e) => handleSearch(e)}
                        className="bg-primary text-white px-6 py-2 rounded-2xl font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-md hover:shadow-lg"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Results Dropdown */}
            {isOpen && (query || results.length > 0) && (
                <div className="absolute top-full mt-4 w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">

                    {/* Tabs */}
                    <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 flex gap-2 overflow-x-auto no-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                                    activeTab === tab.id
                                        ? "bg-white text-primary shadow-sm ring-1 ring-slate-100"
                                        : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-700"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                        {isLoading ? (
                            <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-sm font-medium animate-pulse">Finding the best spots...</p>
                            </div>
                        ) : results.length > 0 ? (
                            <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                {results.map((result, idx) => (
                                    <Link
                                        key={idx}
                                        href={
                                            result.type === 'stay' ? `/stay/${result._id}` :
                                                result.type === 'event' ? `/events/${result._id}` :
                                                    `/explore/${result._id}`
                                        }
                                        className="flex items-center gap-4 p-4 hover:bg-primary/5 transition-colors group"
                                    >
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 bg-slate-100">
                                            <img
                                                src={result.image || "/placeholder.svg"}
                                                alt={result.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                                                    result.type === 'stay' ? "bg-blue-100 text-blue-600" :
                                                        result.type === 'event' ? "bg-purple-100 text-purple-600" :
                                                            "bg-green-100 text-green-600"
                                                )}>
                                                    {result.type === 'place' ? 'Destination' : result.type}
                                                </span>
                                                {result.score && result.score > 0.8 && (
                                                    <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
                                                        <Sparkles className="h-3 w-3" /> Top Match
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="font-outfit font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors truncate text-lg">
                                                {result.name}
                                            </h4>
                                            <p className="text-xs text-slate-500 line-clamp-1 mb-2">{result.description}</p>

                                            <div className="flex items-center gap-3 text-xs text-slate-400">
                                                <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-medium">{result.category}</span>
                                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {result.district}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-slate-400">
                                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="h-8 w-8 text-slate-300" />
                                </div>
                                <p className="text-slate-600 font-medium">No results found</p>
                                <p className="text-sm mt-1">Try adjusting your search or switching tabs.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
