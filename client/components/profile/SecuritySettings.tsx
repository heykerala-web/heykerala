"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Loader2, ShieldCheck, Key, LogOut, Trash2, AlertTriangle } from "lucide-react";
import api from "@/services/api";

export default function SecuritySettings() {
    const { logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.put("/users/password", passwordData);
            if (data.success) {
                toast.success("Password updated successfully");
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            toast.error("Please enter your password to confirm");
            return;
        }

        setDeleteLoading(true);
        try {
            const { data } = await api.delete("/users/account", { data: { password: deletePassword } });
            if (data.success) {
                toast.success("Account deleted successfully. We're sorry to see you go.");
                logout();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete account");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold">Security & Privacy</h2>
                <p className="text-muted-foreground">Manage your credentials and account protection.</p>
            </div>

            <div className="grid gap-6">
                {/* Password Change */}
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
                    <div className="flex items-center gap-6 mb-10">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                            <Key className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900">Password & Authentication</h3>
                            <p className="text-gray-500 font-medium">Secure your account with a strong password.</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordChange} className="max-w-xl space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="currentPassword" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Current Password</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                className="h-12 rounded-2xl border-gray-200 bg-gray-50/50 focus:border-emerald-500 focus:ring-emerald-500/20"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="newPassword" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="h-12 rounded-2xl border-gray-200 bg-gray-50/50 focus:border-emerald-500 focus:ring-emerald-500/20"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Confirm New</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="h-12 rounded-2xl border-gray-200 bg-gray-50/50 focus:border-emerald-500 focus:ring-emerald-500/20"
                                />
                            </div>
                        </div>
                        <div className="pt-4">
                            <Button type="submit" disabled={loading} className="px-8 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/20">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Password
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Additional Settings */}
                <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/10">
                            <ShieldCheck className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h4 className="font-bold">Two-Factor Authentication</h4>
                            <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                        </div>
                    </div>
                    <Button variant="outline" disabled className="rounded-xl border-blue-200">Enable 2FA</Button>
                </div>

                {/* Danger Zone */}
                <Card className="border-destructive/20 shadow-none bg-destructive/5 overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-destructive flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> Danger Zone
                        </CardTitle>
                        <CardDescription>Irreversible actions for your account.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!showDeleteConfirm ? (
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-bold">Delete Account</h4>
                                    <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back. Please be certain.</p>
                                </div>
                                <Button
                                    variant="destructive"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="rounded-xl"
                                >
                                    Delete My Account
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                <p className="text-sm font-bold text-destructive">
                                    Final Confirmation: Please enter your password to permanently delete your account.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Input
                                        type="password"
                                        placeholder="Your password"
                                        className="rounded-xl bg-background"
                                        value={deletePassword}
                                        onChange={(e) => setDeletePassword(e.target.value)}
                                    />
                                    <Button
                                        variant="destructive"
                                        disabled={deleteLoading}
                                        onClick={handleDeleteAccount}
                                        className="rounded-xl whitespace-nowrap"
                                    >
                                        {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Final Delete
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="rounded-xl"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
