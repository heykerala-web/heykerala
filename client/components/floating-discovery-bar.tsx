"use client"

import * as React from "react"
import { Search, MapPin, Grid, Compass, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

export function FloatingDiscoveryBar() {
    const [open, setOpen] = React.useState(false)

    const SearchForm = () => (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
            {/* Search Input */}
            <div className="relative group md:col-span-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors">
                    <Search className="h-4 w-4" />
                </div>
                <Input
                    placeholder="Search destinations..."
                    className="pl-9 bg-white/50 md:bg-white/10 border-white/10 md:text-white text-foreground placeholder:text-muted-foreground md:placeholder:text-white/50 focus:bg-white transition-all rounded-xl h-12"
                />
            </div>

            {/* Region Filter */}
            <div className="relative md:col-span-1">
                <Select>
                    <SelectTrigger className="w-full bg-white/50 md:bg-white/10 border-white/10 md:text-white text-foreground h-12 rounded-xl focus:ring-accent/50 focus:ring-2">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-accent" />
                            <SelectValue placeholder="Region" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="north">North Kerala</SelectItem>
                        <SelectItem value="central">Central Kerala</SelectItem>
                        <SelectItem value="south">South Kerala</SelectItem>
                        <SelectItem value="coast">Coastal Belt</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Category Filter */}
            <div className="relative md:col-span-1">
                <Select>
                    <SelectTrigger className="w-full bg-white/50 md:bg-white/10 border-white/10 md:text-white text-foreground h-12 rounded-xl focus:ring-accent/50 focus:ring-2">
                        <div className="flex items-center gap-2">
                            <Grid className="h-4 w-4 text-accent" />
                            <SelectValue placeholder="Category" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="beach">Beaches</SelectItem>
                        <SelectItem value="hill">Hills</SelectItem>
                        <SelectItem value="backwater">Backwaters</SelectItem>
                        <SelectItem value="culture">Culture</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Action Button */}
            <div className="md:col-span-1">
                <Button className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:scale-105 active:scale-95">
                    <Compass className="mr-2 h-4 w-4" />
                    Explore
                </Button>
            </div>
        </div>
    )

    return (
        <>
            <div className="absolute bottom-[-24px] left-0 right-0 z-40 px-6 flex justify-center">
                {/* Desktop View */}
                <div className="hidden md:block w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6 animate-in slide-in-from-bottom-6 duration-700">
                    <SearchForm />
                </div>

                {/* Mobile View - Trigger Button */}
                <div className="md:hidden w-full max-w-md">
                    <Drawer open={open} onOpenChange={setOpen}>
                        <DrawerTrigger asChild>
                            <button className="w-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-4 flex items-center gap-3 text-white">
                                <Search className="h-5 w-5 opacity-70" />
                                <span className="flex-1 text-left opacity-90 text-sm">Search destinations...</span>
                                <div className="bg-white/20 p-2 rounded-lg">
                                    <SlidersHorizontal className="h-4 w-4" />
                                </div>
                            </button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <div className="mx-auto w-full max-w-sm">
                                <DrawerHeader>
                                    <DrawerTitle>Filter Destinations</DrawerTitle>
                                </DrawerHeader>
                                <div className="p-4 pb-8">
                                    <SearchForm />
                                </div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>
        </>
    )
}
