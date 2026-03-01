"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { eventService, Event, EventParams } from "@/services/eventService";
import { EventCard } from "@/components/event-card";
import { EventCalendar } from "@/components/events/EventCalendar";
import { TrendingEventsSection } from "@/components/events/TrendingEventsSection";
import { AIEventRecommendations } from "@/components/events/AIEventRecommendations";
import { Button } from "@/components/ui/button";
import {
  Loader2, Search, MapPin, Filter, X, Calendar, Flame, List,
  Star, ChevronDown
} from "lucide-react";
import {
  FloatingFilterWrapper,
  FilterItem,
  FilterInput,
  FilterSelect,
  FilterButton
} from "@/components/shared/FloatingFilter";

// ── Constants ─────────────────────────────────────────────────
const DISTRICTS = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
  "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
  "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

const CATEGORIES = ["Festival", "Cultural", "Music", "Food", "Workshop", "Sports", "Other"];

const TIME_FILTERS = [
  { label: "All", value: "all" },
  { label: "Today", value: "today" },
  { label: "Tomorrow", value: "tomorrow" },
  { label: "This Week", value: "this_week" },
  { label: "This Month", value: "this_month" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Past", value: "past" },
];

const TABS = [
  { id: "discover", label: "🔥 Discover", icon: Flame },
  { id: "calendar", label: "📅 Calendar", icon: Calendar },
  { id: "list", label: "📋 Browse All", icon: List },
] as const;
type Tab = typeof TABS[number]["id"];

const GROUPED_CATEGORIES = [
  { label: "Upcoming Festivals", emoji: "🎊", key: "Festival" },
  { label: "Cultural Programs", emoji: "🎭", key: "Cultural" },
  { label: "Music & Entertainment", emoji: "🎵", key: "Music" },
  { label: "Food & Local Events", emoji: "🍛", key: "Food" },
  { label: "Workshops", emoji: "🎨", key: "Workshop" },
  { label: "Sports Events", emoji: "🏆", key: "Sports" },
  { label: "More Events", emoji: "🌴", key: "Other" },
];

// ── Page ──────────────────────────────────────────────────────
export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("discover");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState("all");
  const [filters, setFilters] = useState<EventParams>({ search: "", category: "", district: "" });
  const [activeSearch, setActiveSearch] = useState<EventParams>({});
  const [sortBy, setSortBy] = useState("upcoming");

  // Fetch for List/Discover tabs
  const fetchEvents = useCallback(async () => {
    if (activeTab === "calendar") return;
    setLoading(true);
    setError(null);
    try {
      const params: EventParams = {};
      if (activeSearch.search) params.search = activeSearch.search;
      if (activeSearch.category && activeSearch.category !== "all") params.category = activeSearch.category;
      if (activeSearch.district && activeSearch.district !== "all") params.district = activeSearch.district;
      if (timeFilter && timeFilter !== "all") params.timeFilter = timeFilter;
      if (sortBy) params.sort = sortBy === "upcoming" ? "date" : sortBy;

      const response = await eventService.getAll(params);
      if (response?.success) {
        setEvents(response.data || []);
      } else {
        setEvents([]);
        setError(response?.message || "Failed to load events");
      }
    } catch {
      setEvents([]);
      setError("Connection error. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  }, [activeSearch, timeFilter, sortBy, activeTab]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleSearch = () => setActiveSearch({ ...filters });
  const clearFilters = () => {
    setFilters({ search: "", category: "", district: "" });
    setActiveSearch({});
    setTimeFilter("all");
  };

  const isFiltered = Object.values(activeSearch).some(v => v && v !== "all") || timeFilter !== "all";

  // Grouped for Discover view
  const grouped = GROUPED_CATEGORIES.reduce((acc, { key }) => {
    acc[key] = events.filter(e => e.category === key || (key === "Other" && !CATEGORIES.slice(0, -1).includes(e.category)));
    return acc;
  }, {} as Record<string, Event[]>);

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white pb-20 font-sans">

      {/* HERO */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1596401057633-565652ca65a0?q=80&w=2070&auto=format&fit=crop"
            alt="Events & Festivals"
            className="w-full h-full object-cover scale-105 animate-slow-zoom opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          <span className="px-6 py-2 bg-teal-600/20 backdrop-blur-md border border-teal-500/30 text-teal-300 text-[10px] font-black rounded-full uppercase tracking-[0.4em] mb-8 animate-fade-in-up">
            Cultural Tapestry
          </span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.8] mb-8 drop-shadow-2xl animate-fade-in-up">
            Vibrant <br /><span className="text-teal-400">Kerala</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl font-medium animate-fade-in-up delay-100">
            From the thunder of temple drums to the grace of classical dance, immerse yourself in the soul of the land.
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <FloatingFilterWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-4">
            <FilterItem label="What are you looking for?">
              <FilterInput
                icon={<Search className="h-5 w-5" />}
                placeholder="Name, venue, or keyword…"
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
            </FilterItem>
          </div>
          <div className="lg:col-span-3">
            <FilterItem label="Category">
              <FilterSelect icon={<Filter className="h-5 w-5" />} value={filters.category}
                onChange={e => setFilters({ ...filters, category: e.target.value })}>
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </FilterSelect>
            </FilterItem>
          </div>
          <div className="lg:col-span-3">
            <FilterItem label="District">
              <FilterSelect icon={<MapPin className="h-5 w-5" />} value={filters.district}
                onChange={e => setFilters({ ...filters, district: e.target.value })}>
                <option value="">All Kerala</option>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </FilterSelect>
            </FilterItem>
          </div>
          <div className="lg:col-span-2">
            <FilterButton onClick={handleSearch}>Search</FilterButton>
          </div>
        </div>

        {/* Active filter chips */}
        {isFiltered && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 font-medium">Active filters:</span>
            {Object.entries(activeSearch).map(([key, val]) => {
              if (!val || val === "all") return null;
              return (
                <span key={key} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold">
                  {key}: {val}
                  <X className="h-3 w-3 cursor-pointer hover:text-emerald-900" onClick={() => {
                    const nf = { ...filters, [key]: "" };
                    setFilters(nf);
                    setActiveSearch({ ...activeSearch, [key]: "" });
                  }} />
                </span>
              );
            })}
            {timeFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold">
                {TIME_FILTERS.find(t => t.value === timeFilter)?.label}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setTimeFilter("all")} />
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-red-500 h-7 text-xs">
              Clear all
            </Button>
          </div>
        )}
      </FloatingFilterWrapper>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 py-12 space-y-12">

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1.5 bg-gray-100 rounded-2xl w-fit mx-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-xl text-sm font-black tracking-wide transition-all duration-200
                ${activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── CALENDAR TAB ── */}
        {activeTab === "calendar" && (
          <EventCalendar district={activeSearch.district} />
        )}

        {/* ── DISCOVER TAB ── */}
        {activeTab === "discover" && (
          <div className="space-y-16">
            {/* AI Recommendations (logged in users) */}
            <AIEventRecommendations />

            {/* Trending section */}
            <TrendingEventsSection />

            {/* Category sections */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="h-10 w-10 animate-spin mb-4 text-emerald-600" />
                <p>Finding the best events for you…</p>
              </div>
            ) : error ? (
              <ErrorState error={error} onRetry={fetchEvents} />
            ) : (
              GROUPED_CATEGORIES.map(({ label, emoji, key }) => {
                const grpEvents = grouped[key] || [];
                if (grpEvents.length === 0) return null;
                return (
                  <section key={key}>
                    <div className="flex items-center justify-between mb-8 pb-5 border-b border-border/60">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl filter drop-shadow-sm">{emoji}</span>
                        <h2 className="text-2xl md:text-3xl font-outfit font-black text-foreground tracking-tight">{label}</h2>
                      </div>
                      <button
                        onClick={() => { setActiveTab("list"); if (key !== "Other") setFilters(f => ({ ...f, category: key })); handleSearch(); }}
                        className="hidden md:block text-sm font-bold text-primary hover:underline"
                      >
                        View All →
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                      {grpEvents.slice(0, 4).map(e => (
                        <Link href={`/events/${e._id}`} key={e._id}>
                          <EventCard
                            id={e._id} name={e.title} location={e.district}
                            image={e.images?.[0]} description={e.description}
                            category={e.category}
                            date={new Date(e.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            time={e.time}
                            eventStatus={e.eventStatus}
                            viewCount={e.viewCount}
                            isFeatured={e.isFeatured}
                          />
                        </Link>
                      ))}
                    </div>
                  </section>
                );
              })
            )}
          </div>
        )}

        {/* ── LIST/BROWSE TAB ── */}
        {activeTab === "list" && (
          <div className="space-y-8">
            {/* Smart date filter chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400 mr-1">When:</span>
              {TIME_FILTERS.map(tf => (
                <button
                  key={tf.value}
                  onClick={() => setTimeFilter(tf.value)}
                  className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border
                    ${timeFilter === tf.value
                      ? "bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-100"
                      : "border-gray-200 text-gray-600 hover:border-teal-300 hover:text-teal-700"
                    }`}
                >
                  {tf.label}
                </button>
              ))}
              {/* Sort */}
              <div className="ml-auto relative group">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-8 py-2 rounded-full border border-gray-200 text-xs font-black bg-white text-gray-700 focus:outline-none focus:border-teal-400 cursor-pointer"
                >
                  <option value="upcoming">Date ↑</option>
                  <option value="trending">Trending</option>
                  <option value="popular">Most Viewed</option>
                  <option value="newest">Newest</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="h-10 w-10 animate-spin mb-4 text-emerald-600" />
                <p>Loading events…</p>
              </div>
            ) : error ? (
              <ErrorState error={error} onRetry={fetchEvents} />
            ) : events.length === 0 ? (
              <EmptyState onClear={clearFilters} />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Showing <span className="font-black text-gray-900">{events.length}</span> events
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {events.map(e => (
                    <Link href={`/events/${e._id}`} key={e._id} className="block group">
                      <EventCard
                        id={e._id} name={e.title} location={e.district}
                        image={e.images?.[0]} description={e.description}
                        category={e.category}
                        date={new Date(e.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        time={e.time}
                        eventStatus={e.eventStatus}
                        viewCount={e.viewCount}
                        isFeatured={e.isFeatured}
                      />
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="text-center py-20">
      <div className="bg-red-50 border border-red-100 p-8 rounded-2xl shadow-sm inline-block max-w-md">
        <div className="mb-4 bg-red-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
          <X className="h-10 w-10 text-red-500" />
        </div>
        <p className="text-xl font-semibold text-red-800 mb-2">Connection Issue</p>
        <p className="text-red-600 mb-6">{error}</p>
        <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-100" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="mb-4 bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
        <Calendar className="h-10 w-10 text-gray-300" />
      </div>
      <h3 className="text-xl font-bold text-gray-900">No Events Found</h3>
      <p className="mt-2 text-gray-400 max-w-sm mx-auto">Try adjusting your filters or date range.</p>
      <Button variant="outline" className="mt-6" onClick={onClear}>Clear Filters</Button>
    </div>
  );
}
