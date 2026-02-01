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
    <section className="bg-muted/30 rounded-[2.5rem] py-16 px-8 md:px-12 border border-white/20">
      <div className="text-center mb-16">
        <h2 className="text-h2 mb-4">Safety & Support</h2>
        <p className="text-muted-foreground text-sm uppercase tracking-[0.2em] font-bold">Reliable assistance whenever you need it</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {emergencyServices.map((service) => (
          <a
            key={service.name}
            href={`tel:${service.number}`}
            className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col items-center border border-white/40"
          >
            <div
              className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-inner"
            >
              <service.icon className="h-7 w-7 transition-transform group-hover:scale-110" />
            </div>

            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">{service.name}</h3>

            <div className="text-3xl font-extrabold text-foreground mb-4 tabular-nums">
              {service.number}
            </div>

            <p className="text-muted-foreground text-xs font-medium leading-relaxed max-w-[140px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {service.description}
            </p>
          </a>
        ))}
      </div>
    </section>
  )
}
