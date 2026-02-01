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
                images: ['https://images.unsplash.com/photo-1571896349842-6e53ce41e8f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
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
                images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
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
                images: ['https://images.unsplash.com/photo-1587061949409-02df41d5e562?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
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
                images: ['https://images.unsplash.com/photo-1596422846543-75c6fc197f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
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
                images: ['https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
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
                images: ['https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
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
                images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
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
                images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
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
                images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
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
                images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
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
