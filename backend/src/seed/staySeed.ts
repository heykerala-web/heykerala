import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import Stay from "../models/Stay";

// Try loading env from root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const staysData = [
    {
        name: "Grand Hyatt Kochi",
        type: "hotel",
        description: "Luxury hotel overlooking the backwaters of Kochi. Features multiple dining options, a large pool, and event spaces.",
        district: "Kochi",
        pricePerNight: 12000,
        images: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/166699264.jpg?k=3af89c7295988220800727038006451000632126260840c8382711019183416c&o=&hp=1"],
        amenities: ["Wifi", "Pool", "Parking", "AC", "Restaurant"],
        ratingAvg: 4.8,
        rooms: [
            { roomType: "King Room", price: 12000, maxGuests: 2, availableCount: 5 },
            { roomType: "Suite", price: 25000, maxGuests: 4, availableCount: 2 }
        ]
    },
    {
        name: "Vythiri Resort Wayanad",
        type: "resort",
        description: "A jungle getaway in the heart of Wayanad rainforests. Treehouses and cottages available.",
        district: "Wayanad",
        pricePerNight: 15000,
        images: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/37397623.jpg?k=b48301556947231454c602058309605342203741544026362534571616142171&o=&hp=1"],
        amenities: ["Wifi", "Pool", "Spa", "Trekking"],
        ratingAvg: 4.7,
        rooms: [
            { roomType: "Cottage", price: 15000, maxGuests: 2, availableCount: 3 },
            { roomType: "Treehouse", price: 22000, maxGuests: 2, availableCount: 1 }
        ]
    },
    {
        name: "Paragon Restaurant",
        type: "restaurant",
        description: "The most famous biryani spot in Kozhikode. Authentic Malabar flavors.",
        district: "Kozhikode",
        averagePrice: 500,
        images: ["https://media-cdn.tripadvisor.com/media/photo-s/0e/96/52/56/paragon.jpg"],
        amenities: ["AC", "Parking"],
        ratingAvg: 4.9,
        rooms: []
    },
    {
        name: "Munnar Tea Hills Resort",
        type: "resort",
        description: "Surrounded by tea gardens, offering a misty and cool vacation experience.",
        district: "Munnar",
        pricePerNight: 8000,
        images: ["https://pix10.agoda.net/hotelImages/116/1162839/1162839_16060815410043254199.jpg?ca=6&ce=1&s=1024x768"],
        amenities: ["Wifi", "Breakfast", "View"],
        ratingAvg: 4.5,
        rooms: [
            { roomType: "Standard Room", price: 8000, maxGuests: 2, availableCount: 10 }
        ]
    },
    {
        name: "Fort Kochi Homestay",
        type: "homestay",
        description: "Experience local life in this charming heritage home in Fort Kochi.",
        district: "Kochi",
        pricePerNight: 2500,
        images: ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/36/49/09/facade.jpg?w=700&h=-1&s=1"],
        amenities: ["Wifi", "Kitchen", "Breakfast"],
        ratingAvg: 4.6,
        rooms: [
            { roomType: "Standard Room", price: 2500, maxGuests: 2, availableCount: 2 }
        ]
    },
    {
        name: "Kashi Art Cafe",
        type: "cafe",
        description: "Arts, coffee, and delicious continental food in a relaxed gallery setting.",
        district: "Kochi",
        averagePrice: 600,
        images: ["https://media-cdn.tripadvisor.com/media/photo-s/0e/cc/14/0d/entrance.jpg"],
        amenities: ["Wifi", "Art Gallery"],
        ratingAvg: 4.7
    },
    {
        name: "The Raviz Ashtamudi",
        type: "resort",
        description: "Traditional architecture meets modern luxury on the banks of Ashtamudi Lake.",
        district: "Kollam",
        pricePerNight: 11000,
        images: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/39534576.jpg?k=152b144405362145322765104443422071981240166258071853610080644026&o=&hp=1"],
        amenities: ["Pool", "Boating", "Spa", "Wifi"],
        ratingAvg: 4.6,
        rooms: [
            { roomType: "Lake View Room", price: 11000, maxGuests: 2, availableCount: 5 }
        ]
    },
    {
        name: "Dhe Puttu",
        type: "restaurant",
        description: "Specializing in various types of Puttu, a Kerala breakfast staple.",
        district: "Kochi",
        averagePrice: 400,
        images: ["https://b.zmtcdn.com/data/pictures/2/9500642/47b4e3391d17973059434444585f9227.jpg"],
        amenities: ["AC", "Family Friendly"],
        ratingAvg: 4.3
    },
    {
        name: "Varkala Cliff Resort",
        type: "resort",
        description: "Stunning views of the Arabian Sea from the famous Varkala Cliff.",
        district: "Varkala",
        pricePerNight: 5000,
        images: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/295175402.jpg?k=f867451314757304165158203061611252119106093181816712396440261313&o=&hp=1"],
        amenities: ["Beach Access", "Wifi", "Restaurant"],
        ratingAvg: 4.4,
        rooms: [
            { roomType: "Cliff View Room", price: 5000, maxGuests: 2, availableCount: 4 }
        ]
    },
    {
        name: "Thakkaram Restaurant",
        type: "restaurant",
        description: "A themed restaurant offering wide varieties of Malabar cuisine.",
        district: "Kannur",
        averagePrice: 550,
        images: ["https://media-cdn.tripadvisor.com/media/photo-s/0d/16/e0/8c/interior.jpg"],
        amenities: ["Themed Decor", "AC"],
        ratingAvg: 4.2
    }
];

const seedStays = async () => {
    let connection;
    try {
        const mongoUri = "mongodb://127.0.0.1:27017/heykerala_dev"; // Force local IP to match mongod bind
        console.log("Connecting to:", mongoUri);

        connection = await mongoose.connect(mongoUri);
        console.log("Connected to DB");

        const count = await Stay.countDocuments();
        if (count > 0) {
            console.log(`DB already has ${count} stays. Skipping seed.`);
        } else {
            console.log("Seeding stays...");
            await Stay.insertMany(staysData);
            console.log("Seeded " + staysData.length + " stays.");
        }
    } catch (error) {
        console.error("Error seeding stays:", error);
    } finally {
        if (connection) await mongoose.disconnect();
        process.exit();
    }
};

seedStays();
