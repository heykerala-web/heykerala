import { Metadata } from 'next';
import { placeService } from '@/services/placeService';
import PlaceDetailsClient from './PlaceDetailsClient';

// Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params.id;
  const response = await placeService.getById(id);

  if (!response || !response.success || !response.data) {
    return {
      title: 'Place Not Found | Hey Kerala',
      description: 'The requested place could not be found.'
    };
  }

  const place = response.data;

  return {
    title: `${place.name} | ${place.district} | Hey Kerala`,
    description: place.description?.substring(0, 160) || `Explore ${place.name} in ${place.district}, Kerala. Discover travel tips, reviews, and high-quality photos.`,
    openGraph: {
      title: `${place.name} - Explore ${place.district}`,
      description: place.description?.substring(0, 160),
      images: place.images?.[0] ? [{ url: place.images[0] }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: place.name,
      description: place.description?.substring(0, 160),
      images: [place.images?.[0] || ''],
    }
  };
}

export default async function PlaceDetailsPage({ params }: { params: { id: string } }) {
  const id = params.id;

  // Fetch initial data on server for better Performance (FCP/LCP)
  const response = await placeService.getById(id);
  const initialPlace = response?.success ? response.data : null;

  return (
    <PlaceDetailsClient placeId={id} initialPlace={initialPlace} />
  );
}
