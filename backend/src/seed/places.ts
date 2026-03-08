export interface Place {
  name: string;
  district: string;
  description: string;
  lat: number;
  lng: number;
  tags: string[];
  priceLevel?: string;
}

export const KERALA_PLACES: Place[] = [
  {
    name: "Alleppey Backwaters",
    district: "Alappuzha",
    description: "Famous houseboats and serene backwater cruises",
    lat: 9.4981,
    lng: 76.3355,
    tags: ["backwaters", "houseboat", "relaxation", "nature"],
  },
  {
    name: "Munnar Tea Gardens",
    district: "Idukki",
    description: "Scenic tea plantations and cool hill station climate",
    lat: 10.5869,
    lng: 77.0595,
    tags: ["hill-station", "tea", "nature", "adventure"],
  },
  {
    name: "Fort Kochi",
    district: "Ernakulam",
    description: "Historic port city with colonial architecture and backwaters",
    lat: 9.9673,
    lng: 76.2456,
    tags: ["history", "culture", "architecture", "beaches"],
  },
  {
    name: "Wayanad Wildlife Sanctuary",
    district: "Wayanad",
    description: "Dense forests with wildlife and trekking opportunities",
    lat: 11.5945,
    lng: 75.9789,
    tags: ["wildlife", "trekking", "adventure", "nature"],
  },
  {
    name: "Kumarakom Bird Sanctuary",
    district: "Kottayam",
    description: "Migratory birds and serene backwater environment",
    lat: 9.6015,
    lng: 76.4118,
    tags: ["birds", "nature", "backwaters", "relaxation"],
  },
  {
    name: "Thrissur Pooram",
    district: "Thrissur",
    description:
      "Grand temple festival with elephant processions and cultural performances",
    lat: 10.5276,
    lng: 76.2144,
    tags: ["culture", "festival", "spirituality", "celebration"],
  },
  {
    name: "Athirapally Waterfall",
    district: "Thrissur",
    description: "Majestic waterfall surrounded by lush greenery and forests",
    lat: 10.2389,
    lng: 76.5689,
    tags: ["waterfall", "nature", "adventure", "photography"],
  },
  {
    name: "Kottayam Lakes",
    district: "Kottayam",
    description: "Tranquil lakes perfect for boating and relaxation",
    lat: 9.5915,
    lng: 76.5220,
    tags: ["lakes", "boating", "relaxation", "nature"],
  },
  {
    name: "Periyar National Park",
    district: "Idukki",
    description: "Tiger reserve with forest trails and wildlife spotting",
    lat: 9.3325,
    lng: 77.2847,
    tags: ["wildlife", "trekking", "adventure", "nature"],
  },
  {
    name: "Vagamon Hill Station",
    district: "Idukki",
    description: "Peaceful hill destination with green meadows and pine forests",
    lat: 9.8238,
    lng: 76.7275,
    tags: ["hill-station", "nature", "relaxation", "adventure"],
  },
  {
    name: "Kozhikode Beach",
    district: "Kozhikode",
    description: "Iconic beach with a long stretch of sand and the famous lighthouse",
    lat: 11.2588,
    lng: 75.7663,
    tags: ["beaches", "culture", "nature", "relaxation"],
  },
  {
    name: "Mananchira Square",
    district: "Kozhikode",
    description: "Beautiful park surrounding a large man-made pond in the heart of the city",
    lat: 11.2520,
    lng: 75.7801,
    tags: ["culture", "park", "history", "nature"],
  },
  {
    name: "Banasura Sagar Dam",
    district: "Wayanad",
    description: "Largest earth dam in India offering boat rides and mountain views",
    lat: 11.6372,
    lng: 75.9221,
    tags: ["dam", "nature", "boating", "adventure"],
  },
  {
    name: "Edakkal Caves",
    district: "Wayanad",
    description: "Prehistoric caves with ancient carvings and a scenic trek",
    lat: 11.6254,
    lng: 76.2343,
    tags: ["history", "trekking", "adventure", "culture"],
  },
  {
    name: "Kovalam Beach",
    district: "Thiruvananthapuram",
    description: "Famous beach with golden sand and a landmark lighthouse",
    lat: 8.4021,
    lng: 76.9787,
    tags: ["beaches", "luxury", "nature", "relaxation"],
  },
  {
    name: "Padmanabhaswamy Temple",
    district: "Thiruvananthapuram",
    description: "Magnificent Hindu temple known for its wealth and architecture",
    lat: 8.4830,
    lng: 76.9435,
    tags: ["culture", "history", "spirituality"],
  },
  {
    name: "Cherai Beach",
    district: "Ernakulam",
    description: "Peaceful beach with backwaters and dolphins",
    lat: 10.1416,
    lng: 76.1783,
    tags: ["beaches", "nature", "relaxation"],
  },
];
