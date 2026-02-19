"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, MapPin, Hospital, Shield, Clock, AlertTriangle } from "lucide-react"
import dynamic from "next/dynamic";
const LeafletMap = dynamic(() => import("@/app/components/Map/LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-muted animate-pulse rounded-3xl" />
});

export default function EmergencyPage() {
  const [selectedDistrict, setSelectedDistrict] = useState("thiruvananthapuram")

  const districts = [
    { id: "thiruvananthapuram", name: "Thiruvananthapuram", code: "TVM" },
    { id: "kollam", name: "Kollam", code: "KLM" },
    { id: "pathanamthitta", name: "Pathanamthitta", code: "PTA" },
    { id: "alappuzha", name: "Alappuzha", code: "ALP" },
    { id: "kottayam", name: "Kottayam", code: "KTM" },
    { id: "idukki", name: "Idukki", code: "IDK" },
    { id: "ernakulam", name: "Ernakulam", code: "EKM" },
    { id: "thrissur", name: "Thrissur", code: "TSR" },
    { id: "palakkad", name: "Palakkad", code: "PKD" },
    { id: "malappuram", name: "Malappuram", code: "MPM" },
    { id: "kozhikode", name: "Kozhikode", code: "KZD" },
    { id: "wayanad", name: "Wayanad", code: "WYD" },
    { id: "kannur", name: "Kannur", code: "KNR" },
    { id: "kasaragod", name: "Kasaragod", code: "KSD" },
  ]

  const emergencyContacts: Record<string, {
    police: string;
    fire: string;
    medical: string;
    tourist: string;
    collector: string;
    hospital: string;
  }> = {
    thiruvananthapuram: {
      police: "0471-2721547",
      fire: "0471-2447320",
      medical: "0471-2443344",
      tourist: "0471-2321132",
      collector: "0471-2333128",
      hospital: "Medical College Hospital: 0471-2443152",
    },
    kollam: {
      police: "0474-2794100",
      fire: "0474-2794533",
      medical: "0474-2794108",
      tourist: "0474-2794625",
      collector: "0474-2794100",
      hospital: "District Hospital: 0474-2794533",
    },
    ernakulam: {
      police: "0484-2356156",
      fire: "0484-2368001",
      medical: "0484-2403282",
      tourist: "0484-2371761",
      collector: "0484-2368020",
      hospital: "Medical Trust Hospital: 0484-2358001",
    },
    // Add more districts as needed
  }

  const universalNumbers = [
    {
      name: "Emergency (All Services)",
      number: "112",
      description: "Police, Fire, Medical - Single number for all emergencies",
      icon: AlertTriangle,
      color: "bg-red-500",
      available: "24/7",
    },
    {
      name: "Police",
      number: "100",
      description: "Police emergency and law enforcement",
      icon: Shield,
      color: "bg-blue-500",
      available: "24/7",
    },
    {
      name: "Fire Service",
      number: "101",
      description: "Fire emergency and rescue services",
      icon: AlertTriangle,
      color: "bg-orange-500",
      available: "24/7",
    },
    {
      name: "Medical Emergency",
      number: "108",
      description: "Ambulance and medical emergency services",
      icon: Hospital,
      color: "bg-green-500",
      available: "24/7",
    },
    {
      name: "Tourist Helpline",
      number: "1363",
      description: "24/7 tourist assistance and information",
      icon: MapPin,
      color: "bg-purple-500",
      available: "24/7",
    },
    {
      name: "Women Helpline",
      number: "1091",
      description: "Women in distress helpline",
      icon: Phone,
      color: "bg-pink-500",
      available: "24/7",
    },
  ]

  const selectedDistrictData = emergencyContacts[selectedDistrict] || emergencyContacts.thiruvananthapuram

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 pb-20 lg:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
          <h1 className="font-poppins text-4xl md:text-6xl font-bold mb-4">Emergency Contacts</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Important emergency numbers and contacts for your safety across Kerala
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Universal Emergency Numbers */}
        <section className="mb-16">
          <h2 className="font-poppins text-3xl font-bold text-center mb-12">Universal Emergency Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universalNumbers.map((contact) => (
              <Card key={contact.number} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 ${contact.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <contact.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{contact.number}</div>
                  <h3 className="font-poppins font-semibold text-lg mb-2">{contact.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{contact.description}</p>
                  <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                    <Clock className="h-4 w-4" />
                    {contact.available}
                  </div>
                  <Button
                    className={`w-full mt-4 ${contact.color} hover:opacity-90`}
                    onClick={() => window.open(`tel:${contact.number}`)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* District-wise Contacts */}
        <section>
          <h2 className="font-poppins text-3xl font-bold text-center mb-12">District-wise Emergency Contacts</h2>

          {/* District Selector */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-4 text-center">Select Your District:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {districts.map((district) => (
                <button
                  key={district.id}
                  onClick={() => setSelectedDistrict(district.id)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all ${selectedDistrict === district.id
                      ? "bg-kerala-green text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow"
                    }`}
                >
                  <div className="font-bold">{district.code}</div>
                  <div className="text-xs">{district.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected District Contacts */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-poppins text-2xl text-center">
                {districts.find((d) => d.id === selectedDistrict)?.name} Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(selectedDistrictData).map(([type, contact]) => {
                  const contactString = contact as string
                  return (
                    <div key={type} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-kerala-green rounded-full flex items-center justify-center">
                          <Phone className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold capitalize">{type.replace(/([A-Z])/g, " $1")}</h4>
                          <p className="text-sm text-gray-600">Emergency Contact</p>
                        </div>
                      </div>
                      <div className="text-lg font-bold mb-2">{contactString}</div>
                      <Button
                        size="sm"
                        className="w-full bg-kerala-green hover:bg-kerala-green/90"
                        onClick={() => window.open(`tel:${contactString.split(":")[0]}`)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Map of Nearest Services */}
        <section className="mt-16">
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="font-poppins text-2xl md:text-3xl text-center">
                Find Nearest Emergency Services
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <LeafletMap
                center={[10.5276, 76.2144]}
                zoom={8}
                markers={[
                  { lat: 10.5276, lng: 76.2144, title: "Emergency Services", description: "Kerala" },
                ]}
                height="500px"
              />
            </CardContent>
          </Card>
        </section>

        {/* Important Tips */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
            <CardContent className="p-8">
              <h3 className="font-poppins text-2xl font-bold mb-6 text-center">Emergency Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">📱 Save These Numbers</h4>
                  <ul className="space-y-2 text-sm opacity-90">
                    <li>• Save emergency numbers in your phone</li>
                    <li>• Keep a written copy as backup</li>
                    <li>• Share with family members</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">🆘 In Case of Emergency</h4>
                  <ul className="space-y-2 text-sm opacity-90">
                    <li>• Stay calm and speak clearly</li>
                    <li>• Provide exact location details</li>
                    <li>• Follow operator instructions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
