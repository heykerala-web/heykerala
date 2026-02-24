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
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  label: string;
  description: string;
}

// COMPONENT -----------------------
export default function PlanTripPage() {
  const router = useRouter();

  // STEP STATE
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

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
  const [loadingMessage, setLoadingMessage] = useState("Analyzing your preferences...");

  // OPTIONS
  const durations = ["1-2 days", "3-4 days", "5-7 days", "8-10 days", "10+ days", "Custom"];
  const budgets = ["Budget", "Mid-range", "Premium", "Luxury"];
  const travelers = ["Solo", "Couple", "Family", "Small Group", "Large Group"];

  const interests: InterestOption[] = [
    { value: "Backwaters", icon: "🚤", label: "Backwaters", description: "Serene boat rides & housestays" },
    { value: "Beaches", icon: "🏖️", label: "Beaches", description: "Sun, sand & coastal vibes" },
    { value: "Hill Stations", icon: "⛰️", label: "Hill Stations", description: "Cool mist & tea plantations" },
    { value: "Culture & Heritage", icon: "🏛️", label: "Culture", description: "Ancient arts & traditions" },
    { value: "Wildlife", icon: "🦁", label: "Wildlife", description: "Jungles & exotic species" },
    { value: "Adventure Sports", icon: "🎈", label: "Adventure", description: "Thrills & outdoor activities" },
  ];

  const loadingMessages = [
    "Analyzing your preferences...",
    "Finding the best routes in Kerala...",
    "Selecting hidden gems just for you...",
    "Optimizing for your budget...",
    "Consulting local travel experts (AI version)...",
    "Almost ready to show your dream trip!",
  ];

  useEffect(() => {
    if (loading) {
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[i]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  // FETCH PREMIUM PACKAGES
  useEffect(() => {
    fetch("/api/packages")
      .then((res) => res.json())
      .then((data: PackageType[]) => setPackages(data))
      .catch(() => setPackages([]));
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

  const nextStep = () => {
    if (currentStep === 1) {
      if (!form.duration || !form.budget || !form.travelers) {
        alert("Please select duration, budget, and travelers first.");
        return;
      }
    }
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // GENERATE PLAN
  const generatePlan = async (selectedMode: "manual" | "ai") => {
    const finalInterests = [...form.interests];
    if (customInterest.trim()) {
      finalInterests.push(customInterest.trim());
    }

    if (finalInterests.length === 0) {
      alert("Please select at least 1 interest.");
      return;
    }

    setMode(selectedMode);
    setLoading(true);

    const payload = { ...form, interests: finalInterests };

    try {
      const res = await fetch(`/api/itinerary/${selectedMode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to generate plan");

      router.push(`/plan-trip/result?data=${encodeURIComponent(JSON.stringify(data))}`);
    } catch (err: any) {
      alert(err.message || "An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      {/* HERO SECTION - REFINED */}
      <div className="relative h-[400px] flex items-center justify-center text-white overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          src="https://lp-cms-production.imgix.net/2025-04/shutterstock524524162.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium tracking-wide uppercase">Discover Your Kerala</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            Your Journey, <span className="text-emerald-400">Perfected.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto font-light"
          >
            Escape the ordinary. Let our intelligence craft a personalized
            story for your next Kerala adventure.
          </motion.p>
        </div>
      </div>

      {/* WIZARD CONTAINER */}
      <div className="max-w-4xl mx-auto -mt-16 relative z-20 px-4">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">

          {/* PROGRESS BAR */}
          <div className="h-1.5 w-full bg-gray-100 flex">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-full transition-all duration-500 ease-out ${s <= currentStep ? "bg-emerald-500 flex-1" : "bg-transparent w-0"
                  }`}
              />
            ))}
          </div>

          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {/* STEP 1: BASICS */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8"
                >
                  <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Trip Fundamentals</h2>
                    <p className="text-gray-500">Let's set the stage for your Kerala experience</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Duration */}
                    <div className="space-y-4">
                      <label className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Duration
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {durations.slice(0, 4).map((d) => (
                          <button
                            key={d}
                            onClick={() => setForm({ ...form, duration: d })}
                            className={`p-3 text-sm rounded-xl border transition-all ${form.duration === d
                                ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold"
                                : "bg-white border-gray-100 hover:border-gray-300"
                              }`}
                          >
                            {d}
                          </button>
                        ))}
                        <button
                          onClick={() => setForm({ ...form, duration: "Custom" })}
                          className={`p-3 text-sm rounded-xl border transition-all col-span-2 ${form.duration === "Custom" || (!durations.slice(0, 4).includes(form.duration) && form.duration !== "")
                              ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold"
                              : "bg-white border-gray-100 hover:border-gray-300"
                            }`}
                        >
                          Custom Plan
                        </button>
                      </div>
                      {form.duration === "Custom" && (
                        <input
                          type="text"
                          placeholder="e.g. 15 days"
                          className="w-full p-3 border border-emerald-200 rounded-xl bg-emerald-50/30 focus:ring-2 focus:ring-emerald-500 outline-none"
                          onChange={(e) => setForm({ ...form, duration: e.target.value })}
                        />
                      )}
                    </div>

                    {/* Budget */}
                    <div className="space-y-4">
                      <label className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                        <Wallet className="w-4 h-4" /> Budget
                      </label>
                      <div className="space-y-2">
                        {budgets.map((b) => (
                          <button
                            key={b}
                            onClick={() => setForm({ ...form, budget: b })}
                            className={`w-full p-3 text-sm text-left px-4 rounded-xl border transition-all flex justify-between items-center ${form.budget === b
                                ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold shadow-sm"
                                : "bg-white border-gray-100 hover:border-gray-300"
                              }`}
                          >
                            {b}
                            {form.budget === b && <CheckCircle2 className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Travelers */}
                    <div className="space-y-4">
                      <label className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                        <Users className="w-4 h-4" /> Travelers
                      </label>
                      <div className="space-y-2">
                        {travelers.map((t) => (
                          <button
                            key={t}
                            onClick={() => setForm({ ...form, travelers: t })}
                            className={`w-full p-3 text-sm text-left px-4 rounded-xl border transition-all flex justify-between items-center ${form.travelers === t
                                ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold shadow-sm"
                                : "bg-white border-gray-100 hover:border-gray-300"
                              }`}
                          >
                            {t}
                            {form.travelers === t && <CheckCircle2 className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button
                      onClick={nextStep}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all hover:gap-4 shadow-lg shadow-emerald-200"
                    >
                      Next Step <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: INTERESTS */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8"
                >
                  <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">What calls to you?</h2>
                    <p className="text-gray-500">Select the vibes that match your journey</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {interests.map((interest) => {
                      const isActive = form.interests.includes(interest.value);
                      return (
                        <button
                          key={interest.value}
                          onClick={() => toggleInterest(interest.value)}
                          className={`relative p-5 rounded-2xl border text-left transition-all group ${isActive
                              ? "bg-emerald-50 border-emerald-500 ring-4 ring-emerald-50"
                              : "bg-white border-gray-100 hover:border-emerald-200"
                            }`}
                        >
                          <div className="flex gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${isActive ? "bg-emerald-500 text-white scale-110" : "bg-gray-50 group-hover:bg-emerald-100"
                              }`}>
                              {interest.icon}
                            </div>
                            <div>
                              <h3 className={`font-bold ${isActive ? "text-emerald-900" : "text-gray-800"}`}>
                                {interest.label}
                              </h3>
                              <p className="text-sm text-gray-500">{interest.description}</p>
                            </div>
                          </div>
                          {isActive && (
                            <div className="absolute top-4 right-4 text-emerald-600">
                              <CheckCircle2 className="w-6 h-6" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-400">Something else?</label>
                    <input
                      type="text"
                      placeholder="e.g. Photography, Ayurveda, Cooking classes..."
                      value={customInterest}
                      onChange={(e) => setCustomInterest(e.target.value)}
                      className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>

                  <div className="pt-6 flex justify-between">
                    <button
                      onClick={prevStep}
                      className="text-gray-500 hover:text-gray-800 px-6 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all"
                    >
                      <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all hover:gap-4 shadow-lg shadow-emerald-200"
                    >
                      Finalize <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: REVIEW & GENERATE */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8"
                >
                  <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Ready to Go?</h2>
                    <p className="text-gray-500">Review your preferences and generate your plan</p>
                  </div>

                  <div className="bg-emerald-900 text-white rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full -mr-20 -mt-20" />

                    <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Duration</span>
                        <p className="text-lg font-semibold">{form.duration}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Budget</span>
                        <p className="text-lg font-semibold">{form.budget}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Travelers</span>
                        <p className="text-lg font-semibold">{form.travelers}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Interests</span>
                        <p className="text-lg font-semibold truncate">
                          {form.interests.length} Selected
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-emerald-800 flex flex-wrap gap-2">
                      {form.interests.map(i => (
                        <span key={i} className="px-3 py-1 bg-emerald-800/50 rounded-full text-xs font-medium text-emerald-200">
                          {i}
                        </span>
                      ))}
                      {customInterest && (
                        <span className="px-3 py-1 bg-emerald-800/50 rounded-full text-xs font-medium text-emerald-200">
                          {customInterest}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => generatePlan("manual")}
                      className="group p-8 rounded-[2rem] border border-gray-100 bg-white hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-50 transition-all text-left"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <Zap className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Standard Plan</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Instantly get a curated itinerary based on our seasonal favorites and expert routes.
                      </p>
                    </button>

                    <button
                      onClick={() => generatePlan("ai")}
                      className="group p-8 rounded-[2rem] bg-gradient-to-br from-orange-500 to-rose-500 text-white hover:shadow-xl hover:shadow-orange-200 transition-all text-left relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
                      <div className="relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                          <Sparkles className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">AI Smart Generation</h3>
                        <p className="text-sm text-white/80 leading-relaxed">
                          Our advanced AI crafts a unique, point-to-point itinerary optimized specifically for your preferences.
                        </p>
                      </div>
                    </button>
                  </div>

                  <div className="pt-6 flex justify-start">
                    <button
                      onClick={prevStep}
                      className="text-gray-500 hover:text-gray-800 px-6 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all"
                    >
                      <ArrowLeft className="w-5 h-5" /> Back to Interests
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* EMERGENCY QUICK ACCESS */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Emergency", number: "112", icon: Phone, color: "text-red-600 bg-red-50" },
            { name: "Medical", number: "108", icon: Shield, color: "text-blue-600 bg-blue-50" },
            { name: "Police", number: "100", icon: Phone, color: "text-slate-600 bg-slate-50" },
            { name: "Tourist", number: "1363", icon: MapPin, color: "text-emerald-600 bg-emerald-50" },
          ].map((c) => (
            <div key={c.name} className="p-4 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}>
                <c.icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{c.name}</div>
                <div className="text-sm font-bold text-gray-900">{c.number}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LOADING OVERLAY */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative">
              <div className="w-24 h-24 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-emerald-600 animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-2">Creating Your Magic</h2>
            <p className="text-emerald-600 font-medium h-6">{loadingMessage}</p>
            <div className="mt-12 text-sm text-gray-400 max-w-xs leading-relaxed">
              This usually takes less than 30 seconds. We're scanning thousands of possibilities to find your perfect match.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREMIUM PACKAGES - MODERNIZED */}
      <section className="max-w-6xl mx-auto mt-32 px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="text-left">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Curated Masterpieces</h2>
            <p className="text-gray-500 max-w-md">Prefer a pre-designed experience? Explore our award-winning travel collections.</p>
          </div>
          <button className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            View All Packages <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.length === 0 ? (
            [1, 2, 3].map(i => (
              <div key={i} className="bg-gray-100 animate-pulse h-[450px] rounded-[2.5rem]" />
            ))
          ) : (
            packages.map((p) => (
              <motion.div
                whileHover={{ y: -10 }}
                key={p._id || p.title}
                className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-emerald-100 border border-gray-100 transition-all overflow-hidden"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={p.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-emerald-900">
                    {p.duration}
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{p.title}</h3>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">Starting at</span>
                      <div className="text-2xl font-black text-emerald-600">₹{p.price.toLocaleString()}</div>
                    </div>
                    <button className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-900 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
