"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  User,
  Heart,
  MapPin,
  Camera,
  Settings,
  Edit,
  Trash2,
  Star,
  Calendar,
  Phone,
  Mail,
  Globe,
  Award,
  Bookmark,
} from "lucide-react"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)

  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 234 567 8900",
    location: "New York, USA",
    bio: "Travel enthusiast who loves exploring Kerala's backwaters and hill stations. Always looking for authentic local experiences!",
    joinDate: "March 2023",
    avatar: "/placeholder.svg?height=120&width=120&text=SJ",
  })

  const stats = [
    { label: "Places Visited", value: "12", icon: MapPin, color: "text-blue-500" },
    { label: "Reviews Written", value: "8", icon: Star, color: "text-yellow-500" },
    { label: "Photos Shared", value: "45", icon: Camera, color: "text-green-500" },
    { label: "Trips Planned", value: "3", icon: Calendar, color: "text-purple-500" },
  ]

  const savedPlaces = [
    {
      id: 1,
      name: "Munnar Tea Gardens",
      location: "Munnar, Idukki",
      image: "/munnar-tea-gardens-rolling-green-hills.png",
      rating: 4.8,
      savedDate: "2 days ago",
    },
    {
      id: 2,
      name: "Alleppey Backwaters",
      location: "Alleppey, Alappuzha",
      image: "/kerala-backwaters-houseboat-golden-sunset.png",
      rating: 4.9,
      savedDate: "1 week ago",
    },
    {
      id: 3,
      name: "Kovalam Beach",
      location: "Kovalam, Thiruvananthapuram",
      image: "/kovalam-beach-palm-trees-sunrise.png",
      rating: 4.6,
      savedDate: "2 weeks ago",
    },
  ]

  const myReviews = [
    {
      id: 1,
      place: "Munnar Tea Gardens",
      rating: 5,
      review:
        "Absolutely breathtaking! The tea plantations stretch as far as the eye can see. Perfect weather and amazing photo opportunities.",
      date: "1 week ago",
      likes: 24,
      image: "/munnar-tea-gardens-rolling-green-hills.png",
    },
    {
      id: 2,
      place: "Alleppey Backwaters",
      rating: 5,
      review:
        "The houseboat experience was magical. Floating through the serene backwaters while enjoying traditional Kerala cuisine was unforgettable.",
      date: "2 weeks ago",
      likes: 18,
      image: "/kerala-backwaters-houseboat-golden-sunset.png",
    },
  ]

  const achievements = [
    { title: "Explorer", description: "Visited 10+ places", icon: MapPin, earned: true },
    { title: "Reviewer", description: "Written 5+ reviews", icon: Star, earned: true },
    { title: "Photographer", description: "Shared 25+ photos", icon: Camera, earned: true },
    { title: "Local Expert", description: "Helped 50+ travelers", icon: Award, earned: false },
  ]

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "saved", label: "Saved Places", icon: Bookmark },
    { id: "reviews", label: "My Reviews", icon: Star },
    { id: "photos", label: "Photos", icon: Camera },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const handleSave = () => {
    setIsEditing(false)
    // Save profile logic here
  }

  const handleDeletePlace = (id) => {
    // Delete saved place logic
    console.log("Delete place:", id)
  }

  const handleDeleteReview = (id) => {
    // Delete review logic
    console.log("Delete review:", id)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20 lg:pb-8">
      {/* Profile Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={profile.avatar || "/placeholder.svg"}
                alt={profile.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <button className="absolute bottom-2 right-2 bg-white text-kerala-green p-2 rounded-full shadow-lg hover:bg-gray-100">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="font-poppins text-3xl md:text-4xl font-bold mb-2">{profile.name}</h1>
              <div className="flex flex-col md:flex-row gap-4 text-white/90 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Joined {profile.joinDate}
                </div>
              </div>
              <p className="text-white/90 max-w-2xl">{profile.bio}</p>
            </div>

            <Button onClick={() => setIsEditing(!isEditing)} className="bg-card text-primary hover:bg-muted">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card rounded-2xl p-4 text-center border">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                      <Heart className="h-5 w-5 text-accent" />
                      <div>
                        <p className="font-medium">Saved Munnar Tea Gardens</p>
                        <p className="text-sm text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                      <Star className="h-5 w-5 text-accent" />
                      <div>
                        <p className="font-medium">Reviewed Alleppey Backwaters</p>
                        <p className="text-sm text-muted-foreground">1 week ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                      <Camera className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Uploaded 5 photos from Kovalam</p>
                        <p className="text-sm text-muted-foreground">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Edit Profile Form */}
              {isEditing && (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleSave} className="bg-kerala-green hover:bg-kerala-green/90">
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{profile.location}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Travel Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Backwaters</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="h-4 w-4 text-accent fill-accent" />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Hill Stations</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Beaches</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i <= 3 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Saved Places Tab */}
        {activeTab === "saved" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-poppins text-2xl font-bold">Saved Places ({savedPlaces.length})</h2>
              <Button variant="outline">Clear All</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPlaces.map((place) => (
                <Card key={place.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={place.image || "/placeholder.svg"}
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleDeletePlace(place.id)}
                      className="absolute top-3 right-3 bg-destructive text-destructive-foreground p-2 rounded-full hover:opacity-90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{place.name}</h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{place.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium">{place.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">Saved {place.savedDate}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-poppins text-2xl font-bold">My Reviews ({myReviews.length})</h2>
              <Button className="bg-kerala-green hover:bg-kerala-green/90">Write Review</Button>
            </div>
            <div className="space-y-6">
              {myReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={review.image || "/placeholder.svg"}
                        alt={review.place}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{review.place}</h3>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-foreground">{review.review}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {review.likes} likes
                          </div>
                          <button className="hover:text-primary">Edit</button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === "photos" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-poppins text-2xl font-bold">My Photos (45)</h2>
              <Button className="bg-kerala-green hover:bg-kerala-green/90">
                <Camera className="h-4 w-4 mr-2" />
                Upload Photos
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="relative group aspect-square">
                  <img
                    src={`/travel-photo-.jpg?key=e46j3&height=200&width=200&query=Travel+photo+${i + 1}`}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <button className="text-white hover:text-red-400">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div>
            <h2 className="font-poppins text-2xl font-bold mb-6">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.title}
                  className={achievement.earned ? "bg-accent/20 border-accent/30" : "bg-muted"}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        achievement.earned ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <achievement.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{achievement.title}</h3>
                      <p className="text-muted-foreground">{achievement.description}</p>
                      {achievement.earned && <span className="text-primary text-sm font-medium">✓ Earned</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="max-w-2xl">
            <h2 className="font-poppins text-2xl font-bold mb-6">Account Settings</h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Profile Visibility</h4>
                      <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Show Email</h4>
                      <p className="text-sm text-gray-600">Display email on your public profile</p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Activity Status</h4>
                      <p className="text-sm text-gray-600">Show when you were last active</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-gray-600">Receive push notifications</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-600 mb-2">Delete Account</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
