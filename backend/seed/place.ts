export interface Place {
  id: number;
  name: string;
  description: string;
  lat: number;
  lng: number;
  tags: string[];
}

export const KERALA_PLACES: Place[] = [
  { id: 1, name: "Munnar Tea Gardens", description: "Expansive tea plantations, rolling hills, and breathtaking viewpoints.", lat: 10.0889, lng: 77.0595, tags: ["hill-station", "nature"] },
  { id: 2, name: "Alleppey Backwaters", description: "Famous for its houseboat cruises along the serene backwaters.", lat: 9.4981, lng: 76.3388, tags: ["backwaters", "relax"] },
  { id: 3, name: "Varkala Beach", description: "A stunning cliff beach known for its sunsets and natural springs.", lat: 8.7383, lng: 76.7161, tags: ["beach", "relax"] },
  { id: 4, name: "Thekkady (Periyar National Park)", description: "Home to elephants, tigers, and a rich variety of flora and fauna.", lat: 9.6033, lng: 77.1696, tags: ["wildlife", "nature"] },
  { id: 5, name: "Fort Kochi", description: "A charming area with a rich colonial history, Chinese fishing nets, and art cafes.", lat: 9.9658, lng: 76.2422, tags: ["history", "culture"] },
  { id: 6, name: "Wayanad", description: "Lush green district with waterfalls, caves, and spice plantations.", lat: 11.6854, lng: 76.1320, tags: ["hill-station", "nature", "adventure"] },
  { id: 7, name: "Marari Beach", description: "A quiet and clean beach, perfect for relaxation and experiencing local fishing village life.", lat: 9.6015, lng: 76.3214, tags: ["beach", "relax"] },
  { id: 8, name: "Athirappilly Waterfalls", description: "Often called the 'Niagara of India', this is the largest waterfall in Kerala.", lat: 10.2847, lng: 76.5683, tags: ["nature", "adventure"] }
];