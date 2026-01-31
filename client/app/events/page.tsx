"use client";

import { useEffect, useState } from "react";
import { eventService, Event, EventParams } from "@/services/eventService";
import { EventCard } from "@/components/event-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, Search, MapPin, Calendar, Filter, X } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<EventParams>({
    search: "",
    category: "",
    district: "",
    date: ""
  });

  const [activeSearch, setActiveSearch] = useState<EventParams>({});

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Fetch all events then filter client/server side. 
      // For this UI, we might want to fetch based on active filters.
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
      }
    } catch (error) {
      console.error("Failed to fetch events", error);
      setEvents([]);
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
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">

      {/* 🔹 Top Banner */}
      <div className="relative bg-teal-900 h-[300px] md:h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1596401057633-565652ca65a0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="relative z-10 text-center px-4">
          <span className="inline-block py-1 px-3 rounded-full bg-teal-800/50 border border-teal-600 text-teal-100 text-sm font-medium mb-4 backdrop-blur-sm">
            Discover Kerala's Soul
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-md">
            Events & Festivals in Kerala
          </h1>
          <p className="text-teal-100 text-lg md:text-xl max-w-2xl mx-auto font-light">
            From majestic temple festivals to vibrant food carnivals, never miss a moment.
          </p>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      {/* 🔹 Search & Filters Bar (Floating) */}
      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 lg:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">

          {/* Search Input */}
          <div className="lg:col-span-4 space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Search Event</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Name, venue, or keyword..."
                className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="lg:col-span-3 space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Category</label>
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                className="w-full h-11 pl-10 pr-4 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer"
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
              </select>
            </div>
          </div>

          {/* District Dropdown */}
          <div className="lg:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">District</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                className="w-full h-11 pl-10 pr-4 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer"
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
              </select>
            </div>
          </div>

          {/* Date Picker */}
          <div className="lg:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Date</label>
            <div className="relative">
              <Input
                type="date"
                className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-all cursor-pointer"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-1">
            <Button
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-200"
              onClick={handleSearch}
            >
              Search
            </Button>
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
      </div>

      {/* 🔹 Event Content Sections */}
      <div className="container mx-auto px-4 py-12 space-y-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-emerald-600" />
            <p>Finding the best events for you...</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              Search Results <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{events.length}</span>
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
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🎉</span>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Upcoming Festivals</h2>
                      <p className="text-gray-500 mt-1">Experience the grandeur of Kerala's traditions</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="hidden md:flex text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">View All</Button>
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
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-3xl">🎭</span>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Cultural Programs</h2>
                    <p className="text-gray-500 mt-1">Dance, art, and theatre performances</p>
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
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-3xl">🎵</span>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Music & Entertainment</h2>
                    <p className="text-gray-500 mt-1">Live concerts and musical nights</p>
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
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-3xl">🍲</span>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Food & Local Events</h2>
                    <p className="text-gray-500 mt-1">Taste the authentic flavors of Kerala</p>
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
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-3xl">🧩</span>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">More Events</h2>
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
