import Stay from '../models/Stay';

export const seedStays = async () => {
    try {
        const count = await Stay.countDocuments();
        if (count > 0) {
            console.log('✅ Stays already exist, skipping seed.');
            return;
        }

        console.log('🌱 Seeding sample stays...');

        const sampleStays = [
            {
                name: 'Munnar Tea Hills Resort',
                type: 'resort',
                description: 'A beautiful resort surrounded by tea plantations in Munnar.',
                district: 'Munnar',
                latitude: 10.0889,
                longitude: 77.0595,
                images: ['/stay/elixir-hillsresort.jpg'],
                price: 4500,
                amenities: ['wifi', 'parking', 'pool', 'restaurant'],
                ratingAvg: 4.8
            },
            {
                name: 'Kochi Grand Hotel',
                type: 'hotel',
                description: 'Luxury stay in the heart of Kochi city.',
                district: 'Kochi',
                latitude: 9.9312,
                longitude: 76.2673,
                images: ['/stay/green-gates-hotel.jpg'],
                price: 3200,
                amenities: ['wifi', 'ac', 'gym'],
                ratingAvg: 4.5,
                status: 'approved'
            },
            {
                name: 'Wayanad Jungle Homestay',
                type: 'homestay',
                description: 'Experience nature at its best with this cozy homestay.',
                district: 'Wayanad',
                latitude: 11.6854,
                longitude: 76.1320,
                images: ['/stay/zostel-kochi.jpg'],
                price: 1800,
                amenities: ['wifi', 'breakfast'],
                ratingAvg: 4.9
            },
            {
                name: 'Alleppey Houseboat Stay',
                type: 'homestay',
                description: 'Floating houseboats on the backwaters required.',
                district: 'Alappuzha',
                latitude: 9.4981,
                longitude: 76.3388,
                images: ['/stay/spice-coasthouseboats.jpg'],
                price: 7000,
                amenities: ['ac', 'meals', 'guide'],
                ratingAvg: 4.7
            },
            {
                name: 'Varkala Beach Resort',
                type: 'resort',
                description: 'Stay right next to the famous Varkala cliff.',
                district: 'Varkala',
                latitude: 8.7379,
                longitude: 76.7163,
                images: ['/stay/beach-safarihomestay.jpg'],
                price: 5500,
                amenities: ['pool', 'beach access', 'bar'],
                ratingAvg: 4.6,
                status: 'approved'
            },
            {
                name: 'Kumarakom Lake Resort',
                type: 'resort',
                description: 'Luxury traditional Kerala resort by the lake.',
                district: 'Kumarakom',
                latitude: 9.6175,
                longitude: 76.4300,
                images: ['/stay/coconutlagoon.jpg'],
                price: 12000,
                amenities: ['pool', 'spa', 'boating'],
                ratingAvg: 5.0,
                status: 'approved'
            },
            {
                name: 'The Malabar House',
                type: 'hotel',
                description: 'Heritage hotel in Fort Kochi with colonial charm.',
                district: 'Kochi',
                latitude: 9.9657,
                longitude: 76.2421,
                images: ['/stay/the-terracecafe.jpg'],
                price: 8500,
                amenities: ['wifi', 'pool', 'restaurant'],
                ratingAvg: 4.8
            },
            {
                name: 'Tea Valley Resort',
                type: 'resort',
                description: 'Secluded resort in the tea valleys of Munnar.',
                district: 'Munnar',
                latitude: 10.0574,
                longitude: 77.0620,
                images: ['/stay/green-gates-hotel.jpg'],
                price: 4000,
                amenities: ['campfire', 'trekking'],
                ratingAvg: 4.4,
                status: 'approved'
            },
            {
                name: 'Paragon Restaurant',
                type: 'restaurant',
                description: 'Famous for its biryani and Kerala cuisine.',
                district: 'Kozhikode',
                latitude: 11.2588,
                longitude: 75.7804,
                images: ['/stay/paragonrestaurant.jpg'],
                price: 500,
                amenities: ['ac', 'parking'],
                ratingAvg: 4.9
            },
            {
                name: 'Kashi Art Cafe',
                type: 'cafe',
                description: 'A beautiful cafe with art gallery in Fort Kochi.',
                district: 'Kochi',
                latitude: 9.9660,
                longitude: 76.2425,
                images: ['/stay/the-rice-boat.jpg'],
                price: 300,
                amenities: ['wifi', 'outdoor seating'],
                ratingAvg: 4.7
            }
        ];

        await Stay.insertMany(sampleStays);
        console.log('✅ Stays seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding stays:', error);
    }
};
