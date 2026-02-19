"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Shield, User } from "lucide-react";
import toast from "react-hot-toast";

interface UserType {
    _id: string;
    name: string;
    email: string;
    role: "Admin" | "Tourist" | "Contributor";
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get("/admin/users");
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            setUsers((prev) =>
                prev.map((u) => (u._id === userId ? { ...u, role: newRole as any } : u))
            );
            toast.success("Role updated");
        } catch (error) {
            toast.error("Failed to update role");
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure? This action cannot be undone.")) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            setUsers((prev) => prev.filter((u) => u._id !== userId));
            toast.success("User deleted");
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Users</h1>
                    <p className="text-slate-500 font-medium mt-2">View and manage user roles and permissions.</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-b border-slate-100 hover:bg-transparent">
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-6 pl-8">User Info</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-6">Role</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-6">Joined Date</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-6 text-right pr-8">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                <TableCell className="py-5 pl-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold border-2 border-white shadow-sm">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{user.name}</div>
                                            <div className="text-xs text-slate-400 font-medium">{user.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${user.role === "Admin"
                                            ? "bg-purple-50 text-purple-600 border-purple-100"
                                            : user.role === "Contributor"
                                                ? "bg-blue-50 text-blue-600 border-blue-100"
                                                : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                            }`}
                                    >
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell className="text-sm font-semibold text-slate-600">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-slate-600 hover:bg-slate-100">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl shadow-slate-200/50 p-1">
                                            <DropdownMenuItem onClick={() => handleRoleChange(user._id, "Admin")} className="rounded-lg text-xs font-bold text-slate-600 focus:bg-slate-50">
                                                <Shield className="mr-2 h-3.5 w-3.5" /> Make Admin
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleRoleChange(user._id, "Contributor")} className="rounded-lg text-xs font-bold text-slate-600 focus:bg-slate-50">
                                                <User className="mr-2 h-3.5 w-3.5" /> Make Contributor
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleRoleChange(user._id, "Tourist")} className="rounded-lg text-xs font-bold text-slate-600 focus:bg-slate-50">
                                                <User className="mr-2 h-3.5 w-3.5" /> Make Tourist
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(user._id)}
                                                className="text-red-500 focus:text-red-600 focus:bg-red-50 rounded-lg text-xs font-bold mt-1"
                                            >
                                                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete User
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
