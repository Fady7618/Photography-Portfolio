export default function ImageSkeleton() {
  return (
    <div className="animate-pulse bg-gray-200 rounded-lg overflow-hidden">
      <div className="aspect-square bg-gray-300"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}