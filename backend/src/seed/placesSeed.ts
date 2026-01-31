import dotenv from "dotenv";
dotenv.config();

import Place from "../models/Place";
import connectDB from "../config/db";

const samplePlaces = [
  // 1. Thiruvananthapuram
  {
    name: "Padmanabhaswamy Temple",
    slug: "padmanabhaswamy-temple",
    district: "Thiruvananthapuram",
    location: "East Fort, Thiruvananthapuram",
    category: "Pilgrimage",
    description: "The Sree Padmanabhaswamy Temple is a Hindu temple dedicated to Lord Vishnu. It is considered the richest temple in the world and is a masterpiece of Dravidian and Kerala architectural styles.",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Padmanabhaswamy_Temple_in_Tiruvananthapuram.jpg",
    latitude: 8.4830,
    longitude: 76.9436,
    rating: 4.8,
    highlights: ["Richest Temple", "Dravidian Architecture", "Anantha Shayanam", "Mural Paintings"],
    bestTimeToVisit: "All year round",
    entryFee: "Free (Special Darshan Paid)",
    openingHours: "3:30 AM - 12:00 PM, 5:00 PM - 8:30 PM",
    ratingAvg: 4.8,
    images: ["https://upload.wikimedia.org/wikipedia/commons/3/3d/Padmanabhaswamy_Temple_in_Tiruvananthapuram.jpg"]
  },
  {
    name: "Varkala Cliff",
    slug: "varkala-cliff",
    district: "Thiruvananthapuram",
    location: "Varkala, Thiruvananthapuram",
    category: "Beach",
    description: "Varkala is the only place in southern Kerala where cliffs are found adjacent to the Arabian Sea. The beach is famous for its natural springs which are believed to have medicinal properties.",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Varkala_Beach_Kerala.jpg",
    latitude: 8.7379,
    longitude: 76.7163,
    rating: 4.7,
    highlights: ["Red Cliffs", "Papanasam Beach", "Paragliding", "Ayurveda Centers"],
    bestTimeToVisit: "September to March",
    entryFee: "Free",
    openingHours: "24/7",
    ratingAvg: 4.7,
    images: ["https://upload.wikimedia.org/wikipedia/commons/d/d4/Varkala_Beach_Kerala.jpg"]
  },
  {
    name: "Kovalam Beach",
    slug: "kovalam-beach",
    district: "Thiruvananthapuram",
    location: "Kovalam, Thiruvananthapuram",
    category: "Beach",
    description: "Kovalam is an internationally renowned beach with three adjacent crescent beaches. It has been a favorite haunt of tourists since the 1930s.",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Kovalam_Beach_Kerala.jpg",
    latitude: 8.4004,
    longitude: 76.9787,
    rating: 4.6,
    highlights: ["Lighthouse Beach", "Surfing", "Catamaran Ride", "Sunset Views"],
    bestTimeToVisit: "September to March",
    entryFee: "Free",
    openingHours: "24/7",
    ratingAvg: 4.6,
    images: ["https://upload.wikimedia.org/wikipedia/commons/b/b3/Kovalam_Beach_Kerala.jpg"]
  },

  // 2. Kollam
  {
    name: "Jatayu Earth Center",
    slug: "jatayu-earth-center",
    district: "Kollam",
    location: "Chadayamangalam, Kollam",
    category: "Adventure",
    description: "Jatayu Earth Center hosts the world's largest bird sculpture. It is a rock-themed park built to promote mythology and adventure tourism.",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Jatayu_Nature_Park%2C_Kerala.jpg",
    latitude: 8.8684,
    longitude: 76.8684,
    rating: 4.8,
    highlights: ["Largest Bird Sculpture", "Cable Car Ride", "Hilltop View", "Adventure Park"],
    bestTimeToVisit: "Morning or Evening",
    entryFee: "₹400 approx",
    openingHours: "10:00 AM - 8:00 PM",
    ratingAvg: 4.8,
    images: ["https://upload.wikimedia.org/wikipedia/commons/c/c4/Jatayu_Nature_Park%2C_Kerala.jpg"]
  },
  {
    name: "Ashtamudi Lake",
    slug: "ashtamudi-lake",
    district: "Kollam",
    location: "Kollam City",
    category: "Backwaters",
    description: "Ashtamudi Lake is the gateway to the backwaters of Kerala. The lake is shaped like a palm with eight branches, hence the name 'Ashtamudi'.",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/30/Ashtamudi_Lake_Kollam.jpg",
    latitude: 8.9000,
    longitude: 76.6000,
    rating: 4.5,
    highlights: ["Houseboat Cruise", "Gateway to Backwaters", "Munroe Island", "Mangroves"],
    bestTimeToVisit: "August to March",
    entryFee: "Varies for boats",
    openingHours: "6:00 AM - 6:00 PM",
    ratingAvg: 4.5,
    images: ["https://upload.wikimedia.org/wikipedia/commons/3/30/Ashtamudi_Lake_Kollam.jpg"]
  },

  // 3. Pathanamthitta
  {
    name: "Gavi",
    slug: "gavi",
    district: "Pathanamthitta",
    location: "Gavi, Pathanamthitta",
    category: "Nature",
    description: "Gavi is an eco-tourism spot known for its pristine beauty and wildlife. It is part of the Periyar Tiger Reserve and offers a great escape into nature.",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/90/Gavi_Kerala.jpg",
    latitude: 9.4363,
    longitude: 77.1645,
    rating: 4.6,
    highlights: ["Jeep Safari", "Nature Walk", "Camping", "Wildlife Spotting"],
    bestTimeToVisit: "September to February",
    entryFee: "Permit Required",
    openingHours: "6:00 AM - 5:00 PM",
    ratingAvg: 4.6,
    images: ["https://upload.wikimedia.org/wikipedia/commons/9/90/Gavi_Kerala.jpg"]
  },

  // 4. Alappuzha
  {
    name: "Alappuzha Backwaters",
    slug: "alappuzha-backwaters",
    district: "Alappuzha",
    location: "Alappuzha",
    category: "Backwaters",
    description: "Famous as the 'Venice of the East', Alleppey offers enchanting houseboat cruises through lush green paddy fields and coconut groves.",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Alappuzha_Boat_Beauty_W.jpg",
    latitude: 9.4981,
    longitude: 76.3388,
    rating: 4.9,
    highlights: ["Houseboats", "Snake Boat Race", "Paddy Fields", "Canal Cruise"],
    bestTimeToVisit: "September to March",
    entryFee: "Varies by boat",
    openingHours: "24/7",
    ratingAvg: 4.9,
    images: ["https://upload.wikimedia.org/wikipedia/commons/e/e4/Alappuzha_Boat_Beauty_W.jpg"]
  },
  {
    name: "Kuttanad",
    slug: "kuttanad",
    district: "Alappuzha",
    location: "Kuttanad, Alappuzha",
    category: "Nature",
    description: "Kuttanad, the 'Rice Bowl of Kerala', is unique for farming below sea level. It offers scenic views of endless paddy fields and waterways.",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Kuttanad.jpg",
    latitude: 9.3888,
    longitude: 76.4740,
    rating: 4.7,
    highlights: ["Below Sea Level Farming", "Rural Life", "Scenic Canals", "Warm Hospitality"],
    bestTimeToVisit: "August to March",
    entryFee: "Free",
    openingHours: "24/7",
    ratingAvg: 4.7,
    images: ["https://upload.wikimedia.org/wikipedia/commons/6/6f/Kuttanad.jpg"]
  },

  // 5. Kottayam
  {
    name: "Kumarakom",
    slug: "kumarakom",
    district: "Kottayam",
    location: "Kumarakom, Kottayam",
    category: "Backwaters",
    description: "Cluster of little islands on the Vembanad Lake, Kumarakom is a bird watcher's paradise and a top luxury backwater destination.",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Kumarakom.jpg",
    latitude: 9.6176,
    longitude: 76.4301,
    rating: 4.7,
    highlights: ["Bird Sanctuary", "Luxury Resorts", "Vembanad Lake", "Houseboats"],
    bestTimeToVisit: "September to March",
    entryFee: "Sanctuary: ₹50",
    openingHours: "6:00 AM - 6:00 PM",
    ratingAvg: 4.7,
    images: ["https://upload.wikimedia.org/wikipedia/commons/f/fa/Kumarakom.jpg"]
  },

  // 6. Idukki
  {
    name: "Munnar",
    slug: "munnar-hills",
    district: "Idukki",
    location: "Munnar, Idukki",
    category: "Hill Station",
    description: "South India's most popular hill station, famous for tea plantations, misty hills, and the Neelakurinji flower blooming once every 12 years.",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Munnar_hill_station_Kerala.jpg",
    latitude: 10.0889,
    longitude: 77.0595,
    rating: 4.9,
    highlights: ["Tea Gardens", "Eravikulam Park", "Mattupetty Dam", "Cool Climate"],
    bestTimeToVisit: "September to March",
    entryFee: "Varies",
    openingHours: "9:00 AM - 5:00 PM",
    ratingAvg: 4.9,
    images: ["https://upload.wikimedia.org/wikipedia/commons/5/5f/Munnar_hill_station_Kerala.jpg"]
  },
  {
    name: "Thekkady",
    slug: "thekkady-periyar",
    district: "Idukki",
    location: "Kumily, Idukki",
    category: "Wildlife",
    description: "Home to Periyar Tiger Reserve, Thekkady offers boat rides where you can spot wild elephants and diverse fauna in their natural habitat.",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Periyar_National_Park_Thekkady.jpg",
    latitude: 9.6031,
    longitude: 77.1615,
    rating: 4.6,
    highlights: ["Periyar Lake Boat Ride", "Elephant Safari", "Spice Walk", "Tiger Reserve"],
    bestTimeToVisit: "September to March",
    entryFee: "₹400 approx",
    openingHours: "6:00 AM - 5:00 PM",
    ratingAvg: 4.6,
    images: ["https://upload.wikimedia.org/wikipedia/commons/9/91/Periyar_National_Park_Thekkady.jpg"]
  },

  // 7. Ernakulam (Kochi)
  {
    name: "Fort Kochi",
    slug: "fort-kochi",
    district: "Ernakulam",
    location: "Fort Kochi",
    category: "History",
    description: "A historical melting pot with colonial architecture, Chinese fishing nets, and a vibrant arts scene. It reflects Portuguese, Dutch, and British influences.",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/94/Chinese_Fishing_Nets_Kochi.jpg",
    latitude: 9.9656,
    longitude: 76.2421,
    rating: 4.5,
    highlights: ["Chinese Fishing Nets", "St. Francis Church", "Jew Town", "Mattancherry Palace"],
    bestTimeToVisit: "October to March",
    entryFee: "Free",
    openingHours: "24/7",
    ratingAvg: 4.5,
    images: ["https://upload.wikimedia.org/wikipedia/commons/9/94/Chinese_Fishing_Nets_Kochi.jpg"]
  },
  {
    name: "Marine Drive",
    slug: "marine-drive-kochi",
    district: "Ernakulam",
    location: "Kochi City",
    category: "City",
    description: "A scenic promenade in Kochi along the backwaters, popular for evening walks, boat rides, and shopping.",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/06/Marine_Drive_Kochi_2.jpg",
    latitude: 9.9774,
    longitude: 76.2755,
    rating: 4.3,
    highlights: ["Sunset Walk", "Rainbow Bridge", "Boat Ride", "Shopping"],
    bestTimeToVisit: "Evenings",
    entryFee: "Free",
    openingHours: "24/7",
    ratingAvg: 4.3,
    images: ["https://upload.wikimedia.org/wikipedia/commons/0/06/Marine_Drive_Kochi_2.jpg"]
  },

  // 8. Thrissur
  {
    name: "Athirappilly Waterfalls",
    slug: "athirappilly-falls",
    district: "Thrissur",
    location: "Athirappilly, Thrissur",
    category: "Nature",
    description: "Known as the 'Niagara of India', this 80-foot high waterfall is a majestic sight, especially during the monsoon.",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/29/Athirapally_Waterfalls_Kerala.jpg",
    latitude: 10.2851,
    longitude: 76.5698,
    rating: 4.8,
    highlights: ["Niagara of India", "Rainforest", "Baahubali Film Site", "Trekking"],
    bestTimeToVisit: "June to January",
    entryFee: "₹50",
    openingHours: "8:00 AM - 6:00 PM",
    ratingAvg: 4.8,
    images: ["https://upload.wikimedia.org/wikipedia/commons/2/29/Athirapally_Waterfalls_Kerala.jpg"]
  },

  // 9. Palakkad
  {
    name: "Silent Valley National Park",
    slug: "silent-valley",
    district: "Palakkad",
    location: "Mannarkkad, Palakkad",
    category: "Nature",
    description: "One of the last remaining rainforests in the Western Ghats, known for its rich biodiversity and the absence of cicadas.",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Silent_Valley_National_Park.jpg",
    latitude: 11.1309,
    longitude: 76.4258,
    rating: 4.6,
    highlights: ["Rainforest", "Biodiversity", "Lion-tailed Macaque", "Trekking"],
    bestTimeToVisit: "December to April",
    entryFee: "₹50 (plus Jeep)",
    openingHours: "8:00 AM - 1:00 PM",
    ratingAvg: 4.6,
    images: ["https://upload.wikimedia.org/wikipedia/commons/7/7e/Silent_Valley_National_Park.jpg"]
  },

  // 10. Malappuram
  {
    name: "Teak Museum",
    slug: "teak-museum-nilambur",
    district: "Malappuram",
    location: "Nilambur, Malappuram",
    category: "Culture",
    description: "The world's first teak museum, located in Nilambur. It offers insights into the history and uses of teak wood.",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Nilambur_Teak_Museum.jpg",
    latitude: 11.2828,
    longitude: 76.2428,
    rating: 4.2,
    highlights: ["World's First Teak Museum", "Bio-resources Park", "Conolly's Plot"],
    bestTimeToVisit: "All year round",
    entryFee: "₹20",
    openingHours: "10:00 AM - 4:30 PM (Closed Mondays)",
    ratingAvg: 4.2,
    images: ["https://upload.wikimedia.org/wikipedia/commons/3/3f/Nilambur_Teak_Museum.jpg"]
  },

  // 11. Kozhikode
  {
    name: "Kappad Beach",
    slug: "kappad-beach",
    district: "Kozhikode",
    location: "Kappad, Kozhikode",
    category: "Beach",
    description: "A historic beach where Vasco da Gama landed in 1498, marking the beginning of the spice route effectively.",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/62/Kappad_Beach.jpg",
    latitude: 11.3891,
    longitude: 75.7177,
    rating: 4.4,
    highlights: ["History", "Stone Monument", "Clean Beach", "Sunset"],
    bestTimeToVisit: "October to March",
    entryFee: "Free",
    openingHours: "24/7",
    ratingAvg: 4.4,
    images: ["https://upload.wikimedia.org/wikipedia/commons/6/62/Kappad_Beach.jpg"]
  },

  // 12. Wayanad
  {
    name: "Edakkal Caves",
    slug: "edakkal-caves",
    district: "Wayanad",
    location: "Nenmenil, Wayanad",
    category: "History",
    description: "Two natural caves featuring prehistoric petroglyphs (rock carvings) dating back to 6000 BC, providing evidence of early human settlement.",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/38/Edakkal_Caves_Kerala.jpg",
    latitude: 11.6322,
    longitude: 76.2366,
    rating: 4.5,
    highlights: ["Prehistoric Carvings", "Trekking", "View Point", "History"],
    bestTimeToVisit: "October to May",
    entryFee: "₹30",
    openingHours: "9:30 AM - 4:00 PM (Closed Mondays)",
    ratingAvg: 4.5,
    images: ["https://upload.wikimedia.org/wikipedia/commons/3/38/Edakkal_Caves_Kerala.jpg"]
  },

  // 13. Kannur
  {
    name: "Muzhappilangad Drive-in Beach",
    slug: "muzhappilangad-beach",
    district: "Kannur",
    location: "Muzhappilangad, Kannur",
    category: "Beach",
    description: "Asia's longest drive-in beach, offering a unique experience of driving along the 4km coastline.",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Muzhappilangad_Drive-in_Beach.jpg",
    latitude: 11.7922,
    longitude: 75.4497,
    rating: 4.7,
    highlights: ["Drive-in Beach", "Water Sports", "Beach Festival", "Sunset Drive"],
    bestTimeToVisit: "September to May",
    entryFee: "₹50 per car",
    openingHours: "24/7",
    ratingAvg: 4.7,
    images: ["https://upload.wikimedia.org/wikipedia/commons/4/4b/Muzhappilangad_Drive-in_Beach.jpg"]
  },

  // 14. Kasaragod
  {
    name: "Bekal Fort",
    slug: "bekal-fort",
    district: "Kasaragod",
    location: "Bekal, Kasaragod",
    category: "History",
    description: "The largest fort in Kerala, offering stunning views of the Arabian Sea. It's a key historical landmark appearing in many movies.",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Bekal_Fort_Kasaragod.jpg",
    latitude: 12.3839,
    longitude: 75.0333,
    rating: 4.7,
    highlights: ["Largest Fort", "Sea View", "Observation Tower", "Beach Park"],
    bestTimeToVisit: "October to March",
    entryFee: "₹25",
    openingHours: "8:00 AM - 5:30 PM",
    ratingAvg: 4.7,
    images: ["https://upload.wikimedia.org/wikipedia/commons/e/e0/Bekal_Fort_Kasaragod.jpg"]
  },
];

export async function seedPlaces() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Clear existing places
    await Place.deleteMany({});
    console.log("Cleared existing places");

    // Insert sample places
    const insertedPlaces = await Place.insertMany(samplePlaces);
    console.log(`✅ Seeded ${insertedPlaces.length} places successfully!`);

    return insertedPlaces;
  } catch (error: any) {
    console.error("Error seeding places:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedPlaces()
    .then(() => {
      console.log("Seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}






