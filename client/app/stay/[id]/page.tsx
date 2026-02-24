import { Metadata } from 'next';
import { stayService } from '@/services/stayService';
import StayDetailsClient from './StayDetailsClient';

// Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const id = params.id;
    const response = await stayService.getById(id);

    if (!response || !response.success || !response.data) {
        return {
            title: 'Stay Not Found | Hey Kerala',
            description: 'The requested stay could not be found.'
        };
    }

    const stay = response.data;

    return {
        title: `${stay.name} | ${stay.district} | Hey Kerala`,
        description: stay.description?.substring(0, 160) || `Book your stay at ${stay.name} in ${stay.district}, Kerala. Explore amenities, reviews, and nearby attractions.`,
        openGraph: {
            title: `${stay.name} - ${stay.type} in ${stay.district}`,
            description: stay.description?.substring(0, 160),
            images: stay.images?.[0] ? [{ url: stay.images[0] }] : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: stay.name,
            description: stay.description?.substring(0, 160),
            images: [stay.images?.[0] || ''],
        }
    };
}

export default async function StayDetailsPage({ params }: { params: { id: string } }) {
    const id = params.id;

    // Fetch initial data on server for better Performance (FCP/LCP)
    const response = await stayService.getById(id);
    const initialStay = response?.success ? response.data : null;

    return (
        <StayDetailsClient id={id} initialStay={initialStay} />
    );
}
