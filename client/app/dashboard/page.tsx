"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Star } from "lucide-react";
import Image from "next/image";

interface Place {
  _id: string;
  name: string;
  image: string;
  location: string;
  ratingAvg?: number;
}

interface Review {
  _id: string;
  place: Place;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [savedPlaces, setSavedPlaces] = useState<Place[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [placesRes, reviewsRes, submissionsRes] = await Promise.all([
        api.get("/users/saved"),
        api.get("/users/reviews"),
        api.get("/users/submissions"),
      ]);

      if (placesRes.data.success) setSavedPlaces(placesRes.data.savedPlaces);
      if (reviewsRes.data.success) setReviews(reviewsRes.data.reviews);
      if (submissionsRes.data.success) setSubmissions(submissionsRes.data.submissions);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const { data } = await api.delete(`/users/reviews/${reviewId}`);
      if (data.success) {
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      }
    } catch (error) {
      console.error("Failed to delete review", error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold">Please log in to view your dashboard</h1>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-muted-foreground">Manage your trips, saved places, and reviews.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/profile">Edit Profile</Link>
        </Button>
      </div>

      {/* Saved Places Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Saved Places</h2>
        {savedPlaces.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <p className="text-gray-500 mb-4">You haven't saved any places yet.</p>
            <Button asChild>
              <Link href="/places">Explore Places</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPlaces.map((place) => (
              <Card key={place._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src={place.image || "/placeholder.jpg"}
                    alt={place.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{place.name}</span>
                    {place.ratingAvg ? (
                      <span className="flex items-center text-sm font-normal text-yellow-600">
                        <Star className="w-4 h-4 mr-1 fill-current" /> {place.ratingAvg}
                      </span>
                    ) : null}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {place.location}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/places/${place._id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* My Contributions Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">My Contributions</h2>
          <div className="flex gap-2">
            <Button asChild size="sm">
              <Link href="/add-listing">Add New Listing</Link>
            </Button>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <p className="text-gray-500 mb-4">You haven't contributed any items yet.</p>
            <p className="text-sm text-muted-foreground">Share your favorite places, stays, or events with the community.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((item: any) => (
                  <tr key={item._id} className="border-b last:border-0 hover:bg-muted/10">
                    <td className="px-6 py-4 font-medium">{item.name || item.title}</td>
                    <td className="px-6 py-4">{item.type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                          ${item.status === 'approved' ? 'bg-green-100 text-green-800' :
                          item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* My Reviews Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">My Reviews</h2>
        {reviews.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <p className="text-gray-500 mb-4">You haven't written any reviews yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <Card key={review._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{review.place?.name || "Unknown Place"}</h3>
                      <div className="flex items-center text-yellow-500 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteReview(review._id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      Delete
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 italic">"{review.comment}"</p>
                  <p className="text-xs text-muted-foreground mt-4">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
