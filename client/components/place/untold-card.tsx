"use client";

import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { getFullImageUrl } from "@/lib/images";

interface UntoldCardProps {
    place: any;
    index: number;
}

export function UntoldCard({ place, index }: UntoldCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative h-[450px] w-full max-w-[320px] rounded-3xl overflow-hidden cursor-pointer"
        >
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-[2rem] blur opacity-0 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>

            <Link href={`/places/${place._id}`} className="relative block h-full w-full bg-black rounded-3xl overflow-hidden border border-white/10">
                {/* Background Image with Reveal Effect */}
                <div className="absolute inset-0">
                    <img
                        src={getFullImageUrl(place.image || place.images?.[0], place.name, place.category, undefined, place.updatedAt)}
                        alt={place.name}
                        className="w-full h-full object-cover transition-all duration-1000 scale-110 group-hover:scale-100 group-hover:rotate-1 group-hover:blur-0 grayscale group-hover:grayscale-0 brightness-[0.6] group-hover:brightness-100"
                    />
                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md text-primary text-[10px] font-bold uppercase tracking-[0.2em] border border-primary/30 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Untold
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold text-white tracking-tight leading-tight group-hover:text-primary transition-colors">
                            {place.name}
                        </h3>

                        <div className="flex items-center gap-1.5 text-white/60 text-xs font-medium">
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            <span>{place.district}</span>
                        </div>
                    </div>

                    <p className="text-white/70 text-sm leading-relaxed translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 font-light italic">
                        "{place.untoldStory}"
                    </p>

                    <div className="pt-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                        <div className="h-0.5 w-12 bg-primary rounded-full" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
