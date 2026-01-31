type PackageType = {
  image: string;
  title: string;
  duration: string;
  price: number;
};

interface PackageCardProps {
  pkg: PackageType;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <img
        src={pkg.image}
        alt={pkg.title}
        className="w-full h-40 rounded-xl object-cover"
      />

      <h3 className="font-bold text-xl mt-3">{pkg.title}</h3>

      <p className="text-gray-600">{pkg.duration}</p>

      <div className="text-emerald-600 mt-2 font-bold text-xl">₹{pkg.price}</div>

      <button className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-xl">
        Book Now
      </button>
    </div>
  );
}
