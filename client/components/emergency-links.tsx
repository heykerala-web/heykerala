import { Phone, MapPin, Heart, Wrench } from "lucide-react"

const emergencyServices = [
  {
    name: "Emergency",
    number: "112",
    icon: Phone,
    color: "bg-red-500",
    description: "Police, Fire, Medical",
  },
  {
    name: "Tourist Helpline",
    number: "1363",
    icon: MapPin,
    color: "bg-blue-500",
    description: "24/7 Tourist Support",
  },
  {
    name: "Medical Emergency",
    number: "108",
    icon: Heart,
    color: "bg-green-500",
    description: "Ambulance Service",
  },
  {
    name: "Roadside Assistance",
    number: "1073",
    icon: Wrench,
    color: "bg-orange-500",
    description: "Vehicle Breakdown",
  },
]

export function EmergencyLinks() {
  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="font-poppins text-2xl md:text-3xl font-bold mb-2">Emergency Contacts</h2>
        <p className="text-gray-600">Important numbers for your safety and convenience</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {emergencyServices.map((service) => (
          <a
            key={service.name}
            href={`tel:${service.number}`}
            className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center"
          >
            <div
              className={`w-12 h-12 ${service.color} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
            >
              <service.icon className="h-6 w-6 text-white" />
            </div>

            <h3 className="font-poppins font-semibold text-lg mb-1">{service.name}</h3>

            <div className="text-2xl font-bold text-gray-900 mb-1">{service.number}</div>

            <p className="text-gray-600 text-sm">{service.description}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
