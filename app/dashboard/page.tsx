import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Calendar, Star, TrendingUp } from "lucide-react"

export const metadata = {
  title: "Dashboard | Hey Kerala",
  description: "Your Kerala travel dashboard",
}

export default function DashboardPage() {
  const stats = [
    { title: "Places Visited", value: "12", icon: MapPin, color: "text-emerald-600" },
    { title: "Saved Places", value: "8", icon: Heart, color: "text-red-500" },
    { title: "Upcoming Events", value: "3", icon: Calendar, color: "text-blue-600" },
    { title: "Reviews Written", value: "5", icon: Star, color: "text-yellow-500" },
  ]

  const recentActivity = [
    { action: "Saved", place: "Munnar Tea Gardens", time: "2 hours ago" },
    { action: "Reviewed", place: "Kovalam Beach", time: "1 day ago" },
    { action: "Visited", place: "Alleppey Backwaters", time: "3 days ago" },
  ]

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-poppins text-3xl font-bold mb-2">Welcome back, Traveler!</h1>
          <p className="text-gray-600">Here&apos;s your Kerala journey overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{activity.action}</span> {activity.place}
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-kerala-green hover:bg-kerala-green/90">Plan New Trip</Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Write Review
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  View Saved Places
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
