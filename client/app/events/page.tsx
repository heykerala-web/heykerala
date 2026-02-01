"use client";

import { useEffect, useState } from "react";
import { eventService, Event, EventParams } from "@/services/eventService";
import { EventCard } from "@/components/event-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, Search, MapPin, Calendar, Filter, X } from "lucide-react";
import {
  FloatingFilterWrapper,
  FilterItem,
  FilterInput,
  FilterSelect,
  FilterButton
} from "@/components/shared/FloatingFilter";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<EventParams>({
    search: "",
    category: "",
    district: "",
    date: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [activeSearch, setActiveSearch] = useState<EventParams>({});

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: EventParams = {};
      if (activeSearch.search) params.search = activeSearch.search;
      if (activeSearch.category && activeSearch.category !== "all") params.category = activeSearch.category;
      if (activeSearch.district && activeSearch.district !== "all") params.district = activeSearch.district;
      if (activeSearch.date) params.date = activeSearch.date;

      const response = await eventService.getAll(params);
      if (response && response.success) {
        setEvents(response.data);
      } else {
        setEvents([]);
        setError(response?.message || "Failed to load events");
      }
    } catch (error: any) {
      console.error("Failed to fetch events", error);
      setEvents([]);
      setError("Connection error. Please check if the database is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [activeSearch]);

  const handleSearch = () => {
    setActiveSearch({ ...filters });
  };

  const clearFilters = () => {
    setFilters({ search: "", category: "", district: "", date: "" });
    setActiveSearch({});
  };

  // Group events logic
  const groupEventsByCategory = (events: Event[]) => {
    const categories = ["Festival", "Cultural", "Music", "Food", "Workshop", "Sports", "Other"];
    const grouped: { [key: string]: Event[] } = {};

    categories.forEach(cat => {
      grouped[cat] = events.filter(e => e.category === cat);
    });

    // Group remaining into 'Other' if not matched
    const knownCats = new Set(categories);
    const others = events.filter(e => !knownCats.has(e.category) && e.category !== "Other");
    if (others.length > 0) {
      grouped["Other"] = [...(grouped["Other"] || []), ...others];
    }

    return grouped;
  };

  const grouped = groupEventsByCategory(events);
  const isFiltered = Object.keys(activeSearch).length > 0 && Object.values(activeSearch).some(v => v !== "" && v !== "all");

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      {/* 🔹 CINEMATIC HERO BANNER */}
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

      {/* 🔹 Search & Filters Bar (Floating) */}
      <FloatingFilterWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-end">
          {/* Search Input */}
          <div className="lg:col-span-4">
            <FilterItem label="What are you looking for?">
              <FilterInput
                icon={<Search className="h-5 w-5" />}
                placeholder="Name, venue, or keyword..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </FilterItem>
          </div>

          {/* Category Dropdown */}
          <div className="lg:col-span-3">
            <FilterItem label="Event Type">
              <FilterSelect
                icon={<Filter className="h-5 w-5" />}
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All Categories</option>
                <option value="Festival">Festivals</option>
                <option value="Cultural">Cultural</option>
                <option value="Music">Music & Show</option>
                <option value="Food">Food & Drink</option>
                <option value="Workshop">Workshops</option>
                <option value="Sports">Sports</option>
              </FilterSelect>
            </FilterItem>
          </div>

          {/* District Dropdown */}
          <div className="lg:col-span-2">
            <FilterItem label="Location">
              <FilterSelect
                icon={<MapPin className="h-5 w-5" />}
                value={filters.district}
                onChange={(e) => setFilters({ ...filters, district: e.target.value })}
              >
                <option value="">All</option>
                <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                <option value="Kochi">Kochi</option>
                <option value="Kozhikode">Kozhikode</option>
                <option value="Wayanad">Wayanad</option>
                <option value="Munnar">Munnar</option>
                <option value="Alappuzha">Alappuzha</option>
              </FilterSelect>
            </FilterItem>
          </div>

          {/* Date Picker */}
          <div className="lg:col-span-2">
            <FilterItem label="When?">
              <FilterInput
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              />
            </FilterItem>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-1">
            <FilterButton onClick={handleSearch}>
              Go
            </FilterButton>
          </div>
        </div>

        {/* Active Filters Display */}
        {isFiltered && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">Active filters:</span>
            {Object.entries(activeSearch).map(([key, value]) => {
              if (!value || value === "all") return null;
              return (
                <span key={key} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm">
                  {/* @ts-ignore */}
                  {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-emerald-900"
                    onClick={() => {
                      const newFilters = { ...filters, [key]: "" };
                      setFilters(newFilters);
                      setActiveSearch({ ...activeSearch, [key]: "" });
                    }}
                  />
                </span>
              )
            })}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-red-500 h-7 text-xs">
              Clear all
            </Button>
          </div>
        )}
      </FloatingFilterWrapper>

      {/* 🔹 Event Content Sections */}
      <div className="container mx-auto px-4 py-12 space-y-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-emerald-600" />
            <p>Finding the best events for you...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="bg-red-50 border border-red-100 p-8 rounded-2xl shadow-sm inline-block max-w-md">
              <div className="mb-4 bg-red-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                <X className="h-10 w-10 text-red-500" />
              </div>
              <p className="text-xl font-semibold text-red-800 mb-2">Connection Issue</p>
              <p className="text-red-600 mb-6">{error}</p>
              <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-100" onClick={fetchEvents}>Retry Connection</Button>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="mb-4 bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No Events Found</h3>
            <p className="mt-2 text-gray-400 max-w-sm mx-auto">We couldn't find any events matching your search. Try adjusting your filters or date.</p>
            <Button variant="outline" className="mt-6" onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : isFiltered ? (
          /* 🔹 View if Filtered: Single Grid */
          <div>
            <h2 className="text-3xl md:text-4xl font-outfit font-bold text-foreground mb-6 flex items-center gap-3">
              Search Results <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">{events.length}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event) => (
                <Link href={`/events/${event._id}`} key={event._id} className="block group">
                  <EventCard
                    id={event._id}
                    name={event.title}
                    location={event.district} // Using district as location for card
                    image={event.images[0]}
                    description={event.description}
                    category={event.category}
                    date={new Date(event.startDate).toLocaleDateString()}
                    time={event.time || "All Day"}
                  />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          /* 🔹 Default View: Grouped Sections */
          <div className="space-y-16">

            {/* Festivals */}
            {grouped["Festival"]?.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-border/60">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl filter drop-shadow-md">🎊</span>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-outfit font-bold text-foreground tracking-tight">Upcoming Festivals</h2>
                      <p className="text-muted-foreground font-medium mt-1">Experience the grandeur of Kerala&apos;s traditions</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="hidden md:flex text-primary hover:text-white hover:bg-primary rounded-full px-8 h-12 font-bold uppercase tracking-widest text-xs transition-all duration-300">View All</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {grouped["Festival"].slice(0, 4).map(e => (
                    <Link href={`/events/${e._id}`} key={e._id}>
                      <EventCard id={e._id} name={e.title} location={e.district} image={e.images[0]} description={e.description} category={e.category} date={new Date(e.startDate).toLocaleDateString()} time={e.time} />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Cultural */}
            {grouped["Cultural"]?.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border/60">
                  <span className="text-4xl filter drop-shadow-md">🎭</span>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-outfit font-bold text-foreground tracking-tight">Cultural Programs</h2>
                    <p className="text-muted-foreground font-medium mt-1">Dance, art, and theatre performances</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {grouped["Cultural"].slice(0, 4).map(e => (
                    <Link href={`/events/${e._id}`} key={e._id}>
                      <EventCard id={e._id} name={e.title} location={e.district} image={e.images[0]} description={e.description} category={e.category} date={new Date(e.startDate).toLocaleDateString()} time={e.time} />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Music */}
            {grouped["Music"]?.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border/60">
                  <span className="text-4xl filter drop-shadow-md">🎵</span>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-outfit font-bold text-foreground tracking-tight">Music & Entertainment</h2>
                    <p className="text-muted-foreground font-medium mt-1">Live concerts and musical nights</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {grouped["Music"].slice(0, 4).map(e => (
                    <Link href={`/events/${e._id}`} key={e._id}>
                      <EventCard id={e._id} name={e.title} location={e.district} image={e.images[0]} description={e.description} category={e.category} date={new Date(e.startDate).toLocaleDateString()} time={e.time} />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Food */}
            {grouped["Food"]?.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border/60">
                  <span className="text-4xl filter drop-shadow-md">🍛</span>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-outfit font-bold text-foreground tracking-tight">Food & Local Events</h2>
                    <p className="text-muted-foreground font-medium mt-1">Taste the authentic flavors of Kerala</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {grouped["Food"].slice(0, 4).map(e => (
                    <Link href={`/events/${e._id}`} key={e._id}>
                      <EventCard id={e._id} name={e.title} location={e.district} image={e.images[0]} description={e.description} category={e.category} date={new Date(e.startDate).toLocaleDateString()} time={e.time} />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Others */}
            {grouped["Other"]?.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border/60">
                  <span className="text-4xl filter drop-shadow-md">🌴</span>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-outfit font-bold text-foreground tracking-tight">More Events</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {grouped["Other"].slice(0, 4).map(e => (
                    <Link href={`/events/${e._id}`} key={e._id}>
                      <EventCard id={e._id} name={e.title} location={e.district} image={e.images[0]} description={e.description} category={e.category} date={new Date(e.startDate).toLocaleDateString()} time={e.time} />
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
