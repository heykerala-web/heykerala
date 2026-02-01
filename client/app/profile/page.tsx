"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams, useRouter } from "next/navigation";
import ProfileLayout from "@/components/profile/ProfileLayout";
import ProfileOverview from "@/components/profile/ProfileOverview";
import PersonalInfo from "@/components/profile/PersonalInfo";
import MyBookings from "@/components/profile/MyBookings";
import SavedItems from "@/components/profile/SavedItems";
import MyContributions from "@/components/profile/MyContributions";
import MyPhotos from "@/components/profile/MyPhotos";
import ReviewCenter from "@/components/profile/ReviewCenter";
import SecuritySettings from "@/components/profile/SecuritySettings";
import NotificationCenter from "@/components/profile/NotificationCenter";
import api from "@/services/api";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, loading: authLoading, updateUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const [statsLoading, setStatsLoading] = useState(true);

  // Sync state with URL if changed externally
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("tab", tab);
      router.push(`/profile?${params.toString()}`, { scroll: false });
    }
  };

  // Refresh user data with stats on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const { data } = await api.get("/users/me");
        if (data.success) {
          updateUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch extended user data:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    } else if (!authLoading) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || (statsLoading && user)) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <ProfileOverview />;
      case "personal": return <PersonalInfo />;
      case "bookings": return <MyBookings />;
      case "saved": return <SavedItems />;
      case "contributions": return <MyContributions />;
      case "photos": return <MyPhotos />;
      case "reviews": return <ReviewCenter />;
      case "security": return <SecuritySettings />;
      case "notifications": return <NotificationCenter />;
      default: return <ProfileOverview />;
    }
  };

  return (
    <ProfileLayout activeTab={activeTab} setActiveTab={handleTabChange}>
      {renderContent()}
    </ProfileLayout>
  );
}
