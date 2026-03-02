import { X, Star, MapPin, Share2, Heart, ExternalLink, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

interface PlaceDetailPanelProps {
    place: any;
    isFavorite: boolean;
    onToggleSave: () => void;
    onClose: () => void;
}

export function PlaceDetailPanel({ place, isFavorite, onToggleSave, onClose }: PlaceDetailPanelProps) {
    const { t } = useLanguage();
    if (!place) return null;

    const handleShare = () => {
        const url = `${window.location.origin}/places/${place._id}`;
        navigator.clipboard.writeText(url);
        // Could add a toast here, but keeping it simple as requested
        alert("Link copied to clipboard! 🌴");
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden animate-in slide-in-from-left duration-300">

            {/* Header Image Area */}
            <div className="relative h-72 lg:h-80 flex-shrink-0">
                <img
                    src={place.images?.[0] || place.image || "/placeholder.svg"}
                    alt={place.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-6 left-6 flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md h-12 w-12 border border-white/20"
                        title={t("back_to_results")}
                    >
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                <div className="absolute top-6 right-6 flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleShare}
                        className="bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md h-12 w-12 border border-white/30 active:scale-95 transition-all"
                        title={t("share_this_place")}
                    >
                        <Share2 className="h-5 w-5" />
                    </Button>
                </div>

                <div className="absolute bottom-8 left-8 right-8 text-white">
                    <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-primary text-primary-foreground border-none text-[10px] font-bold tracking-widest uppercase">
                            {place.category}
                        </Badge>
                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[10px] font-semibold">
                            <Star className="h-3 w-3 fill-accent text-accent" />
                            {place.ratingAvg}
                        </div>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2 truncate">{place.name}</h2>
                    <div className="flex items-center gap-1.5 text-white/80 text-xs">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span>{place.district}, Kerala</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
                <div className="p-6 space-y-8">

                    {/* Action Buttons */}
                    <div className="flex gap-4 sticky bottom-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 -mx-6 border-t z-10">
                        <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-xl font-bold text-sm shadow-md shadow-primary/20 transition-all active:scale-95">
                            {t("plan_this_trip")}
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={onToggleSave}
                            className={cn(
                                "h-12 w-12 rounded-xl border-muted transition-all shrink-0",
                                isFavorite ? "bg-red-50 border-red-100 text-red-500 hover:bg-red-100" : "hover:bg-muted"
                            )}
                        >
                            <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
                        </Button>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">{t("the_experience")}</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            {place.description}
                        </p>

                        {/* AI Tip / Smart Insight */}
                        <div className="bg-emerald-50 dark:bg-emerald-500/10 p-5 rounded-3xl border border-emerald-100 dark:border-emerald-500/20 relative overflow-hidden group/tip">
                            <div className="flex items-start gap-3 relative z-10">
                                <div className="bg-emerald-500 p-1.5 rounded-lg shrink-0">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">{t("ai_local_insight")}</h4>
                                    <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed italic">
                                        "{place.category === 'Hill Station' ?
                                            `Best visited during early morning for the mist. Don't forget to try the local tea varieties nearby!` :
                                            place.category === 'Beach' ?
                                                `Perfect for sunset views. The evening breeze here is magical and ideal for a peaceful walk.` :
                                                `Highly recommended for its unique atmosphere. Local travelers suggest spending at least 3 hours to fully explore.`}"
                                    </p>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/tip:opacity-20 transition-opacity">
                                <Sparkles className="h-16 w-16 text-emerald-500" />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {place.tags?.map((tag: string) => (
                                <span key={tag} className="text-[9px] px-2.5 py-1.5 bg-muted rounded-full text-muted-foreground font-bold uppercase tracking-wider">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Gallery (Small preview) */}
                    {place.images && place.images.length > 1 && (
                        <div>
                            <h3 className="font-bold text-sm mb-3">{t("gallery")}</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {place.images.slice(1, 4).map((img: string, i: number) => (
                                    <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-slate-100">
                                        <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Link href={`/places/${place._id}`} target="_blank" className="block pb-6">
                        <Button variant="outline" className="w-full rounded-2xl h-14 border-slate-200 text-slate-600 hover:text-black hover:border-slate-800 transition-all font-bold">
                            {t("view_more_details")} <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </ScrollArea>
        </div>
    );
}
