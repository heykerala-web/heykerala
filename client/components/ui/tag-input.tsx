"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TagInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    tags: string[];
    setTags: (tags: string[]) => void;
    placeholder?: string;
    label?: string; // Optional label text to show internal instructions
}

export function TagInput({ tags, setTags, className, placeholder, label, ...props }: TagInputProps) {
    const [inputValue, setInputValue] = React.useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
            // Remove last tag if input is empty
            setTags(tags.slice(0, -1));
        }
    };

    const addTag = () => {
        const trimmed = inputValue.trim().replace(/,/g, "");
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
            setInputValue("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className="space-y-3">
            <div className={cn(
                "flex flex-wrap gap-2 p-3 min-h-[5rem] bg-gray-50 rounded-3xl border-2 border-transparent focus-within:bg-white focus-within:border-emerald-500/10 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all",
                className
            )}>
                {tags.map((tag, index) => (
                    <div key={index} className="animate-in fade-in zoom-in duration-300">
                        <Badge
                            variant="secondary"
                            className="h-8 px-3 text-sm font-bold bg-white text-gray-800 border border-gray-200 shadow-sm flex items-center gap-1 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors cursor-pointer group"
                            onClick={() => removeTag(tag)}
                        >
                            {tag}
                            <X className="w-3 h-3 text-gray-400 group-hover:text-red-500" />
                        </Badge>
                    </div>
                ))}

                <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={addTag}
                    className="flex-1 min-w-[150px] bg-transparent border-none h-8 text-lg font-medium placeholder:text-gray-400 focus-visible:ring-0 p-0"
                    placeholder={tags.length === 0 ? (placeholder || "Type and press Enter...") : ""}
                    {...props}
                />
            </div>
            {/* Helper text */}
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-2">
                {label || "Type a trait and press Enter to add"}
            </p>
        </div>
    );
}
