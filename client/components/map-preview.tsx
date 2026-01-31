interface MapPreviewProps {
  query: string | null;
}

export default function MapPreview({ query }: MapPreviewProps) {
  if (!query) return null;

  return (
    <iframe
      className="rounded-lg border ml-4"
      src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
      width={300}
      height={200}
      loading="lazy"
    ></iframe>
  );
}
