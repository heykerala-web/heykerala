"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Users,
  Wallet,
  Mountain,
  Phone,
  MapPin,
  Shield,
  LucideIcon,
} from "lucide-react";

// TYPES ---------------------------
interface PackageType {
  _id: string;
  image: string;
  title: string;
  duration: string;
  price: number;
}

interface TripForm {
  duration: string;
  budget: string;
  interests: string[];
  travelers: string;
}

interface InterestOption {
  value: string;
  icon: string;
}

// COMPONENT -----------------------
export default function PlanTripPage() {
  const router = useRouter();

  // FORM STATE
  const [form, setForm] = useState<TripForm>({
    duration: "",
    budget: "",
    interests: [],
    travelers: "",
  });

  const [mode, setMode] = useState<"manual" | "ai">("manual");
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<PackageType[]>([]);

  const [customInterest, setCustomInterest] = useState("");

  // OPTIONS
  const durations = ["3-4 days", "5-7 days", "8-10 days", "10+ days", "Custom"];
  const budgets = ["Budget", "Mid-range", "Luxury", "Custom"];
  const travelers = ["Solo", "Couple", "Family", "Group", "Custom"];

  const interests: InterestOption[] = [
    { value: "Backwaters", icon: "🚤" },
    { value: "Beaches", icon: "🏖️" },
    { value: "Hill Stations", icon: "⛰️" },
    { value: "Culture & Heritage", icon: "🏛️" },
    { value: "Wildlife", icon: "🦁" },
    { value: "Adventure Sports", icon: "🎈" },
  ];

  // FETCH PREMIUM PACKAGES
  useEffect(() => {
    fetch("/api/packages")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch packages");
        }
        return res.json();
      })
      .then((data: PackageType[]) => setPackages(data))
      .catch((err) => {
        // Silently handle backend connection errors
        console.log("Packages API unavailable, using empty list");
        setPackages([]);
      });
  }, []);

  // Toggle Interest
  const toggleInterest = (value: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter((i) => i !== value)
        : [...prev.interests, value],
    }));
  };

  // GENERATE PLAN
  const generatePlan = async () => {
    if (!form.duration || !form.budget || !form.travelers) {
      alert("Please fill all fields!");
      return;
    }

    const finalInterests = [...form.interests];
    if (customInterest.trim()) {
      finalInterests.push(customInterest.trim());
    }

    if (finalInterests.length === 0) {
      alert("Please select at least 1 interest or type a custom one.");
      return;
    }

    setLoading(true);

    const payload = { ...form, interests: finalInterests };

    const res = await fetch(`/api/itinerary/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok || data.error) {
      alert(data.error || "Failed to generate plan. Please try again.");
      return;
    }

    router.push(
      `/plan-trip/result?data=${encodeURIComponent(JSON.stringify(data))}`
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20">
      {/* HERO SECTION */}
      <div className="relative bg-gradient-to-r from-emerald-700 to-teal-600 text-white py-20 overflow-hidden">
        <img
          src="https://lp-cms-production.imgix.net/2025-04/shutterstock524524162.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Plan Your Kerala Trip
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Create your perfect Kerala experience with personalized itineraries
            based on your style, budget & interests.
          </p>
        </div>
      </div>

      {/* MAIN FORM */}
      <div className="max-w-5xl mx-auto mt-12 bg-white p-10 rounded-3xl shadow-xl border space-y-10">
        <h2 className="text-4xl font-bold text-center">
          Create Your Custom Itinerary
        </h2>
        <p className="text-center text-gray-500 mb-10">
          Tell us your preferences and we’ll design the perfect Kerala trip
        </p>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Duration */}
          <div>
            <label className="font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Trip Duration
            </label>

            <select
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="w-full mt-2 p-3 rounded-xl border bg-gray-50"
            >
              <option value="">Select duration</option>
              {durations.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>

            {form.duration === "Custom" && (
              <input
                type="text"
                placeholder="Enter days (e.g., 12 days)"
                className="w-full mt-3 p-3 border rounded-xl bg-white"
                onChange={(e) =>
                  setForm({ ...form, duration: e.target.value })
                }
              />
            )}
          </div>

          {/* Budget */}
          <div>
            <label className="font-semibold flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              Budget Range
            </label>

            <select
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className="w-full mt-2 p-3 rounded-xl border bg-gray-50"
            >
              <option value="">Select budget</option>
              {budgets.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>

            {form.budget === "Custom" && (
              <input
                type="text"
                placeholder="Enter custom budget (e.g., ₹45,000)"
                className="w-full mt-3 p-3 border rounded-xl bg-white"
                onChange={(e) =>
                  setForm({ ...form, budget: e.target.value })
                }
              />
            )}
          </div>

          {/* Travelers */}
          <div>
            <label className="font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              Number of Travelers
            </label>

            <select
              value={form.travelers}
              onChange={(e) =>
                setForm({ ...form, travelers: e.target.value })
              }
              className="w-full mt-2 p-3 rounded-xl border bg-gray-50"
            >
              <option value="">Select</option>
              {travelers.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            {form.travelers === "Custom" && (
              <input
                type="number"
                min={1}
                placeholder="Enter number"
                className="w-full mt-3 p-3 border rounded-xl bg-white"
                onChange={(e) =>
                  setForm({ ...form, travelers: e.target.value })
                }
              />
            )}
          </div>
        </div>

        {/* INTERESTS */}
        <div>
          <label className="font-semibold flex items-center gap-2 text-lg mb-4">
            <Mountain className="w-5 h-5 text-emerald-600" />
            Select Your Interests
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {interests.map(({ value, icon }) => {
              const active = form.interests.includes(value);
              return (
                <button
                  key={value}
                  onClick={() => toggleInterest(value)}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition
                    ${active
                      ? "bg-emerald-50 border-emerald-600"
                      : "bg-gray-50 border-gray-200"
                    }`}
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="font-medium flex-1 text-left">{value}</span>
                  {active && <span className="text-emerald-600">✔</span>}
                </button>
              );
            })}
          </div>

          {/* Custom Interest Input */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Other interest? (e.g. Yoga, Photography, Food Tour...)"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              className="w-full p-4 rounded-xl border bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
          <button
            onClick={() => {
              setMode("manual");
              generatePlan();
            }}
            disabled={loading}
            className="py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-lg"
          >
            ⚡ Quick Plan (Manual)
          </button>

          <button
            onClick={() => {
              setMode("ai");
              generatePlan();
            }}
            disabled={loading}
            className="py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-lg"
          >
            ✨ AI Smart Plan
          </button>
        </div>

        {/* EMERGENCY CONTACTS */}
        <div className="mt-12 p-6 rounded-2xl bg-red-50 border border-red-200">
          <h3 className="text-xl font-bold text-red-700 mb-4">
            Emergency Contacts
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Emergency", number: "112", icon: Phone },
              { name: "Medical", number: "108", icon: Shield },
              { name: "Police", number: "100", icon: Phone },
              { name: "Tourist Helpline", number: "1363", icon: MapPin },
            ].map((c) => (
              <div
                key={c.name}
                className="p-4 bg-white shadow rounded-xl text-center"
              >
                <c.icon className="mx-auto mb-2 text-red-600" />
                <div className="text-xl font-bold text-red-600">
                  {c.number}
                </div>
                <div className="text-sm text-gray-600">{c.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PREMIUM PACKAGES */}
      <section className="max-w-6xl mx-auto mt-20">
        <h2 className="text-4xl font-bold text-center mb-10">
          Premium Kerala Packages
        </h2>

        <div className="grid md:grid-cols-3 gap-6 px-4">
          {packages.length === 0 && (
            <p className="text-center text-gray-500 col-span-3">
              No packages found.
            </p>
          )}

          {packages.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow-lg border p-4"
            >
              <img
                src={p.image}
                className="rounded-xl h-40 w-full object-cover"
              />

              <h3 className="text-xl font-bold mt-3">{p.title}</h3>
              <p className="text-gray-600">{p.duration}</p>

              <div className="mt-2 text-emerald-700 text-xl font-bold">
                ₹{p.price}
              </div>

              <button className="mt-4 w-full py-2 bg-emerald-600 text-white rounded-xl">
                Book Now
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
