"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import api from "@/services/api";
import { toast } from "react-hot-toast";
import { Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post("/auth/login", { email, password });
            if (data.success) {
                if (data.user.role !== "Admin") {
                    toast.error("Access denied: Not an administrator.");
                    return;
                }
                toast.success("Admin access granted.");
                login(data);
                // AuthContext login now handles redirect, but we can be explicit here too
                router.push("/admin");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
            <div className="w-full max-w-[450px]">
                {/* Branding / Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="h-14 w-14 bg-emerald-600 rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-emerald-200/50 mb-6">
                        <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Hey<span className="text-emerald-600">Kerala</span> Admin
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Secure Administrative Portal</p>
                </div>

                <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2rem] overflow-hidden bg-white">
                    <CardHeader className="pt-10 px-10 pb-0">
                        <CardTitle className="text-xl font-bold">Sign In</CardTitle>
                        <CardDescription>Enter your admin credentials to continue</CardDescription>
                    </CardHeader>
                    <CardContent className="p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-600 font-semibold px-1">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@heykerala.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-14 bg-slate-50/50 border-slate-200 rounded-2xl focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" title="Password" className="text-slate-600 font-semibold px-1">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-14 bg-slate-50/50 border-slate-200 rounded-2xl focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-200 transition-all duration-300 font-bold text-lg group"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Access Dashboard
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-slate-100 flex justify-center">
                            <Link href="/" className="text-slate-400 hover:text-emerald-600 text-sm font-semibold flex items-center gap-2 transition-colors">
                                <span>Return to Main Website</span>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <p className="mt-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                    &copy; 2026 HEY KERALA • CONTROL PANEL
                </p>
            </div>
        </div >
    );
}
