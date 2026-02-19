export interface Place {
  name: string;
  description: string;
  lat: number;
  lng: number;
  tags: string[];
  priceLevel?: string;
}

export const KERALA_PLACES: Place[] = [
  {
    name: "Alleppey Backwaters",
    description: "Famous houseboats and serene backwater cruises",
    lat: 9.4981,
    lng: 76.3355,
    tags: ["backwaters", "houseboat", "relaxation", "nature"],
  },
  {
    name: "Munnar Tea Gardens",
    description: "Scenic tea plantations and cool hill station climate",
    lat: 10.5869,
    lng: 77.0595,
    tags: ["hill-station", "tea", "nature", "adventure"],
  },
  {
    name: "Fort Kochi",
    description: "Historic port city with colonial architecture and backwaters",
    lat: 9.9673,
    lng: 76.2456,
    tags: ["history", "culture", "architecture", "beaches"],
  },
  {
    name: "Wayanad Wildlife Sanctuary",
    description: "Dense forests with wildlife and trekking opportunities",
    lat: 11.5945,
    lng: 75.9789,
    tags: ["wildlife", "trekking", "adventure", "nature"],
  },
  {
    name: "Kumarakom Bird Sanctuary",
    description: "Migratory birds and serene backwater environment",
    lat: 9.6015,
    lng: 76.4118,
    tags: ["birds", "nature", "backwaters", "relaxation"],
  },
  {
    name: "Thrissur Pooram",
    description:
      "Grand temple festival with elephant processions and cultural performances",
    lat: 10.5276,
    lng: 76.2144,
    tags: ["culture", "festival", "spirituality", "celebration"],
  },
  {
    name: "Athirapally Waterfall",
    description: "Majestic waterfall surrounded by lush greenery and forests",
    lat: 10.2389,
    lng: 76.5689,
    tags: ["waterfall", "nature", "adventure", "photography"],
  },
  {
    name: "Kottayam Lakes",
    description: "Tranquil lakes perfect for boating and relaxation",
    lat: 9.5915,
    lng: 76.5220,
    tags: ["lakes", "boating", "relaxation", "nature"],
  },
  {
    name: "Periyar National Park",
    description: "Tiger reserve with forest trails and wildlife spotting",
    lat: 9.3325,
    lng: 77.2847,
    tags: ["wildlife", "trekking", "adventure", "nature"],
  },
  {
    name: "Vagamon Hill Station",
    description:
      "Peaceful hill destination with green meadows and pine forests",
    lat: 9.8238,
    lng: 76.7275,
    tags: ["hill-station", "nature", "relaxation", "adventure"],
  },
];
